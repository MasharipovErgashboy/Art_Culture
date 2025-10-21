export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const accessToken = localStorage.getItem("access_token")
  return !!accessToken
}

export async function getUser() {
  if (typeof window === "undefined") return null

  // First check localStorage
  const userData = localStorage.getItem("user")
  if (userData) {
    try {
      return JSON.parse(userData)
    } catch (e) {
      console.error("Error parsing user data:", e)
    }
  }

  // If not in localStorage, fetch from API
  const accessToken = localStorage.getItem("access_token")
  if (!accessToken) return null

  try {
    const response = await fetch("https://artculture.pythonanywhere.com/auth/me/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.ok) {
      const user = await response.json()
      // Cache in localStorage
      localStorage.setItem("user", JSON.stringify(user))
      return user
    }
  } catch (e) {
    console.error("Error fetching user data:", e)
  }

  return null
}

export function logout(redirectUrl?: string) {
  if (typeof window === "undefined") return

  localStorage.removeItem("user")
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user_email")

  window.location.href = redirectUrl || "/"
}

function isTokenExpired(token: string): boolean {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split(".")
    if (parts.length !== 3) return true

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]))

    // Check if token has expiry time
    if (!payload.exp) return false

    // Check if token is expired (with 30 second buffer)
    const now = Math.floor(Date.now() / 1000)
    const isExpired = payload.exp < now + 30

    console.log("[v0] Token expiry check:", {
      expiresAt: new Date(payload.exp * 1000).toISOString(),
      now: new Date(now * 1000).toISOString(),
      isExpired,
    })

    return isExpired
  } catch (error) {
    console.error("[v0] Error checking token expiry:", error)
    return true
  }
}

export async function ensureValidToken(): Promise<boolean> {
  if (typeof window === "undefined") return false

  const accessToken = localStorage.getItem("access_token")
  if (!accessToken) {
    console.log("[v0] No access token found")
    return false
  }

  // Check if token is expired
  if (isTokenExpired(accessToken)) {
    console.log("[v0] Access token is expired, attempting refresh...")
    const newToken = await refreshAccessToken()

    if (newToken) {
      console.log("[v0] Token refreshed successfully")
      return true
    } else {
      console.error("[v0] Token refresh failed")
      return false
    }
  }

  console.log("[v0] Access token is still valid")
  return true
}

export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null

  const refreshToken = localStorage.getItem("refresh_token")
  if (!refreshToken) {
    console.log("[v0] ❌ REFRESH FAILED: No refresh token available")
    return null
  }

  try {
    console.log("[v0] ========== REFRESHING ACCESS TOKEN ==========")
    console.log("[v0] Refresh token exists:", !!refreshToken)
    console.log("[v0] API endpoint: https://artculture.pythonanywhere.com/auth/token/refresh/")

    const response = await fetch("https://artculture.pythonanywhere.com/auth/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    })

    console.log("[v0] Refresh token API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] ❌ REFRESH FAILED: API returned error")
      console.error("[v0] Status:", response.status)
      console.error("[v0] Response:", errorText)

      if (response.status === 401 || response.status === 403) {
        console.error("[v0] Refresh token invalid or expired (401/403)")
        console.error("[v0] Reason: Token might be expired or revoked")
        logout()
      } else {
        console.error("[v0] Refresh token API error:", response.status)
        console.error("[v0] Reason: Server error or network issue - Not logging out, will retry later")
      }
      return null
    }

    const data = await response.json()
    console.log("[v0] ✅ REFRESH SUCCESS: New access token received")

    // Update access token in localStorage
    if (data.access) {
      localStorage.setItem("access_token", data.access)
      console.log("[v0] Access token updated in localStorage")
      console.log("[v0] ========== TOKEN REFRESH SUCCESS ==========")
      return data.access
    } else {
      console.error("[v0] ❌ REFRESH FAILED: No access token in response")
      return null
    }
  } catch (error) {
    console.error("[v0] ========== TOKEN REFRESH ERROR ==========")
    console.error("[v0] ❌ REFRESH FAILED: Network or parsing error")
    console.error("[v0] Error:", error)
    console.error("[v0] Reason: This is likely a network error, not logging out")
    console.error("[v0] ========== TOKEN REFRESH ERROR END ==========")
    return null
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  if (typeof window === "undefined") {
    throw new Error("fetchWithAuth can only be used in browser environment")
  }

  // Check if token is expired before making request
  const isValid = await ensureValidToken()
  if (!isValid) {
    console.error("[v0] Token validation failed before request")
    throw new Error("REFRESH_PAGE")
  }

  const token = localStorage.getItem("access_token")
  if (!token) {
    console.error("[v0] No access token available for authenticated request")
    throw new Error("NO_TOKEN")
  }

  // Add authorization header
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  console.log("[v0] Making authenticated request to:", url)

  // Make the request
  let response = await fetch(url, { ...options, headers })

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    console.log("[v0] Received 401 Unauthorized, attempting to refresh token...")
    const newToken = await refreshAccessToken()

    if (newToken) {
      console.log("[v0] Token refreshed successfully, retrying request...")
      // Retry with new token
      const newHeaders = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      }
      response = await fetch(url, { ...options, headers: newHeaders })
      console.log("[v0] Retry request status:", response.status)

      if (response.status === 401) {
        console.error("[v0] Still 401 after token refresh")
        throw new Error("REFRESH_PAGE")
      }
    } else {
      console.error("[v0] Token refresh failed")
      throw new Error("REFRESH_PAGE")
    }
  }

  return response
}

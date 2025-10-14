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

export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null

  const refreshToken = localStorage.getItem("refresh_token")
  if (!refreshToken) {
    console.log("[v0] No refresh token available")
    return null
  }

  try {
    console.log("[v0] ========== REFRESHING ACCESS TOKEN ==========")
    console.log("[v0] Refresh token exists:", !!refreshToken)

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
      console.error("[v0] Refresh token invalid or expired, logging out")
      // If refresh token is invalid, clear all auth data
      logout()
      return null
    }

    const data = await response.json()
    console.log("[v0] New access token received")

    // Update tokens in localStorage
    if (data.access) {
      localStorage.setItem("access_token", data.access)
      console.log("[v0] Access token updated in localStorage")
    }
    if (data.refresh) {
      localStorage.setItem("refresh_token", data.refresh)
      console.log("[v0] Refresh token updated in localStorage")
    }

    console.log("[v0] ========== TOKEN REFRESH SUCCESS ==========")
    return data.access
  } catch (error) {
    console.error("[v0] ========== TOKEN REFRESH ERROR ==========")
    console.error("[v0] Error refreshing token:", error)
    console.error("[v0] ========== TOKEN REFRESH ERROR END ==========")
    logout()
    return null
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  if (typeof window === "undefined") {
    throw new Error("fetchWithAuth can only be used in browser environment")
  }

  const token = localStorage.getItem("access_token")
  if (!token) {
    console.error("[v0] No access token available for authenticated request")
    throw new Error("No access token available")
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
    } else {
      console.error("[v0] Token refresh failed, user will be logged out")
    }
  }

  return response
}

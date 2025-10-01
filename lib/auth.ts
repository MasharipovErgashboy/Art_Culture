export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const user = localStorage.getItem("user")
  const accessToken = localStorage.getItem("access_token")

  return !!(user && accessToken)
}

export function getUser() {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("user")
  if (!userData) return null

  try {
    return JSON.parse(userData)
  } catch (e) {
    console.error("Error parsing user data:", e)
    return null
  }
}

export function logout() {
  if (typeof window === "undefined") return

  localStorage.removeItem("user")
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")

  window.location.href = "/"
}

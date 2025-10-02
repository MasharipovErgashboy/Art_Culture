"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id?: string
  name?: string
  surname?: string
  email: string
  avatar?: string
  username?: string
  subscription?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userData: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  requireAuth: (callback?: () => void) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user")
        const accessToken = localStorage.getItem("access_token")

        if (userData && accessToken) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userData: User, accessToken: string, refreshToken: string) => {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("access_token", accessToken)
    localStorage.setItem("refresh_token", refreshToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
    router.push("/")
  }

  // Function to check auth and redirect if needed
  const requireAuth = (callback?: () => void): boolean => {
    if (!user) {
      // Extract language from pathname
      const lang = pathname?.split("/")[1] || "uz"
      const returnUrl = encodeURIComponent(pathname || `/${lang}`)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
      return false
    }

    if (callback) {
      callback()
    }
    return true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
    
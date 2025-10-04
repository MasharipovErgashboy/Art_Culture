"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { Loader } from "@/components/Loader"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setMounted(true)
    const authStatus = isAuthenticated()
    setIsAuth(authStatus)

    if (!authStatus) {
      const pathParts = pathname?.split("/").filter(Boolean) || []
      const lang = pathParts[0] && ["uz", "ru", "en"].includes(pathParts[0]) ? pathParts[0] : "uz"
      const returnUrl = encodeURIComponent(pathname || `/${lang}`)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
    }
  }, [router, pathname])

  if (!mounted || !isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return <>{children}</>
}

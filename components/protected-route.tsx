"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { Loader } from "@/components/Loader"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuth = isAuthenticated()

  useEffect(() => {
    if (!isAuth) {
      const pathParts = pathname?.split("/").filter(Boolean) || []
      const lang = pathParts[0] && ["uz", "ru", "en"].includes(pathParts[0]) ? pathParts[0] : "uz"
      const returnUrl = encodeURIComponent(pathname || `/${lang}`)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
    }
  }, [isAuth, router, pathname])

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return <>{children}</>
}

"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AlertCircle, CheckCircle, KeyRound, Eye, EyeOff } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { fetchWithAuth } from "@/lib/auth"

interface Translations {
  changePassword: string
  changePasswordDesc: string
  newPassword: string
  passwordRequirements: string
  minLength: string
  changePasswordButton: string
  cancel: string
  passwordChanged: string
  passwordChangedDesc: string
  passwordTooShort: string
  error: string
  backToProfile: string
  loginRequired: string
}

const translations: { [key: string]: Translations } = {
  uz: {
    changePassword: "Parolni o'zgartirish",
    changePasswordDesc: "Yangi parol kiriting",
    newPassword: "Yangi parol",
    passwordRequirements: "Parol talablari:",
    minLength: "Kamida 8 ta belgi",
    changePasswordButton: "Parolni o'zgartirish",
    cancel: "Bekor qilish",
    passwordChanged: "Parol muvaffaqiyatli o'zgartirildi!",
    passwordChangedDesc: "Yangi parolingiz bilan tizimga kirishingiz mumkin.",
    passwordTooShort: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
    error: "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
    backToProfile: "Profilga qaytish",
    loginRequired: "Tizimga kirish kerak. Iltimos, qayta kiring.",
  },
  ru: {
    changePassword: "Изменить пароль",
    changePasswordDesc: "Введите новый пароль",
    newPassword: "Новый пароль",
    passwordRequirements: "Требования к паролю:",
    minLength: "Минимум 8 символов",
    changePasswordButton: "Изменить пароль",
    cancel: "Отмена",
    passwordChanged: "Пароль успешно изменен!",
    passwordChangedDesc: "Вы можете войти в систему с новым паролем.",
    passwordTooShort: "Пароль должен содержать минимум 8 символов",
    error: "Произошла ошибка. Пожалуйста, попробуйте снова.",
    backToProfile: "Вернуться в профиль",
    loginRequired: "Необходимо войти в систему. Пожалуйста, авторизуйтесь снова.",
  },
  en: {
    changePassword: "Change Password",
    changePasswordDesc: "Enter your new password",
    newPassword: "New Password",
    passwordRequirements: "Password requirements:",
    minLength: "At least 8 characters",
    changePasswordButton: "Change Password",
    cancel: "Cancel",
    passwordChanged: "Password changed successfully!",
    passwordChangedDesc: "You can now login with your new password.",
    passwordTooShort: "Password must be at least 8 characters long",
    error: "An error occurred. Please try again.",
    backToProfile: "Back to Profile",
    loginRequired: "Login required. Please log in again.",
  },
}

export default function ChangePasswordPage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params?.lang as string) || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [newPassword, setNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (newPassword.length < 8) {
      setError(t.passwordTooShort)
      return
    }

    setIsLoading(true)

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://artculture.pythonanywhere.com"
      const url = `${API_BASE}/auth/change-password/`

      console.log("[v0] Change password URL:", url)
      console.log("[v0] Password length:", newPassword.length)

      const response = await fetchWithAuth(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("[v0] Error response:", errorData)
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Success response:", data)

      setSuccess(true)
      setNewPassword("")

      setTimeout(() => {
        router.push(`/${lang}/profile`)
      }, 2000)
    } catch (err) {
      console.error("[v0] Change password error:", err)
      setError(err instanceof Error ? err.message : t.error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push(`/${lang}/profile`)
  }

  if (success) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg border-0">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t.passwordChanged}</h2>
                <p className="text-gray-600">{t.passwordChangedDesc}</p>
                <Button onClick={handleCancel} className="w-full mt-4">
                  {t.backToProfile}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <KeyRound className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">{t.changePassword}</CardTitle>
            </div>
            <CardDescription className="text-base">{t.changePasswordDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword">{t.newPassword}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">{t.passwordRequirements}</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    {t.minLength}
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  {t.cancel}
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "..." : t.changePasswordButton}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </ProtectedRoute>
  )
}

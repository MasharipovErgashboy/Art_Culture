"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react"

const AUTH_BASE = "https://artculture.pythonanywhere.com"

const translations = {
  uz: {
    title: "Yangi parol o'rnating",
    description: "Quyida yangi parolingizni kiriting",
    passwordLabel: "Yangi parol",
    passwordPlaceholder: "Yangi parolingizni kiriting",
    resetButton: "Parolni tiklash",
    resettingButton: "Parol tiklanmoqda...",
    successTitle: "Parol muvaffaqiyatli tiklandi",
    successDescription:
      "Parolingiz muvaffaqiyatli yangilandi. Bir necha soniyadan keyin login sahifasiga yo'naltirilasiz.",
    loginButton: "Tizimga kirish",
    loginNote: "Endi yangi parolingiz bilan tizimga kirishingiz mumkin",
    backToLogin: "Tizimga kirish sahifasiga qaytish",
    newRequestLink: "yangi tiklash so'rovi yuboring",
    problemText: "Agar muammo bo'lsa,",
    errorInvalidToken: "Noto'g'ri tiklash havolasi. Iltimos, yangi parol tiklash so'rovini yuboring.",
    errorInvalidTokenShort: "Noto'g'ri tiklash tokeni",
    errorPasswordLength: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
    errorDefault: "Parolni tiklashda xatolik yuz berdi. Qaytadan urinib ko'ring.",
    errorNetwork: "Tarmoq xatosi. Internetga ulanishni tekshiring va qaytadan urinib ko'ring.",
  },
  ru: {
    title: "Установите новый пароль",
    description: "Введите ваш новый пароль ниже",
    passwordLabel: "Новый пароль",
    passwordPlaceholder: "Введите новый пароль",
    resetButton: "Сбросить пароль",
    resettingButton: "Сброс пароля...",
    successTitle: "Пароль успешно сброшен",
    successDescription:
      "Ваш пароль успешно обновлен. Через несколько секунд вы будете перенаправлены на страницу входа.",
    loginButton: "Войти в систему",
    loginNote: "Теперь вы можете войти с новым паролем",
    backToLogin: "Вернуться на страницу входа",
    newRequestLink: "отправить новый запрос на сброс",
    problemText: "Если возникла проблема,",
    errorInvalidToken: "Неверная ссылка для сброса. Пожалуйста, отправьте новый запрос на сброс пароля.",
    errorInvalidTokenShort: "Неверный токен сброса",
    errorPasswordLength: "Пароль должен содержать не менее 6 символов",
    errorDefault: "Ошибка при сбросе пароля. Попробуйте еще раз.",
    errorNetwork: "Ошибка сети. Проверьте подключение к интернету и попробуйте снова.",
  },
  en: {
    title: "Set New Password",
    description: "Enter your new password below",
    passwordLabel: "New Password",
    passwordPlaceholder: "Enter your new password",
    resetButton: "Reset Password",
    resettingButton: "Resetting Password...",
    successTitle: "Password Successfully Reset",
    successDescription:
      "Your password has been successfully updated. You will be redirected to the login page in a few seconds.",
    loginButton: "Login",
    loginNote: "You can now login with your new password",
    backToLogin: "Back to login page",
    newRequestLink: "submit a new reset request",
    problemText: "If there's a problem,",
    errorInvalidToken: "Invalid reset link. Please submit a new password reset request.",
    errorInvalidTokenShort: "Invalid reset token",
    errorPasswordLength: "Password must be at least 6 characters long",
    errorDefault: "Error resetting password. Please try again.",
    errorNetwork: "Network error. Check your internet connection and try again.",
  },
}

export default function PasswordResetConfirmPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError(t.errorInvalidToken)
    }
  }, [searchParams, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError(t.errorInvalidTokenShort)
      return
    }

    if (password.length < 6) {
      setError(t.errorPasswordLength)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`${AUTH_BASE}/auth/password-reset-confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: token,
        },
        body: JSON.stringify({
          password: password,
        }),
      })

      const data = await response.json().catch(() => {
        return {}
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(data.detail || data.message || t.errorDefault)
      }
    } catch (error) {
      setError(t.errorNetwork)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600">{t.successTitle}</CardTitle>
              <CardDescription className="text-muted-foreground">{t.successDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/login">
                <Button className="w-full" size="lg">
                  {t.loginButton}
                </Button>
              </Link>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{t.loginNote}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">{t.title}</CardTitle>
              <CardDescription className="text-muted-foreground">{t.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t.passwordLabel}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      required
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={isLoading || !token}>
                  {isLoading ? t.resettingButton : t.resetButton}
                </Button>

                <div className="text-center">
                  <Link href="/login" className="text-sm text-primary hover:underline">
                    {t.backToLogin}
                  </Link>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {t.problemText}{" "}
                    <Link href={`/${lang}/forgot-password`} className="text-primary hover:underline">
                      {t.newRequestLink}
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  )
}

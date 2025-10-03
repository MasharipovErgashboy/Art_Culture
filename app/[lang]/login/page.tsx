"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams, useParams } from "next/navigation"

const AUTH_BASE = "https://artculture.pythonanywhere.com/auth"

const translations = {
  uz: {
    title: "Tizimga kirish",
    description: "Art&Culture portaliga kirish uchun ma'lumotlaringizni kiriting",
    email: "Email manzil",
    emailPlaceholder: "example@email.com",
    password: "Parol",
    passwordPlaceholder: "Parolingizni kiriting",
    rememberMe: "Meni eslab qol",
    forgotPassword: "Parolni unutdingizmi?",
    loginButton: "Kirish",
    loggingIn: "Kirilmoqda...",
    noAccount: "Hisobingiz yo'qmi?",
    register: "Ro'yxatdan o'ting",
    needHelp: "Tizimga kirishda muammo bo'lsa,",
    contactSupport: "yordam xizmatiga murojaat qiling",
  },
  ru: {
    title: "Вход в систему",
    description: "Введите свои данные для входа на портал Art&Culture",
    email: "Email адрес",
    emailPlaceholder: "example@email.com",
    password: "Пароль",
    passwordPlaceholder: "Введите пароль",
    rememberMe: "Запомнить меня",
    forgotPassword: "Забыли пароль?",
    loginButton: "Войти",
    loggingIn: "Вход...",
    noAccount: "Нет аккаунта?",
    register: "Зарегистрироваться",
    needHelp: "Если у вас проблемы со входом,",
    contactSupport: "обратитесь в службу поддержки",
  },
  en: {
    title: "Login",
    description: "Enter your credentials to access the Art&Culture portal",
    email: "Email address",
    emailPlaceholder: "example@email.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    loginButton: "Login",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account?",
    register: "Register",
    needHelp: "If you have trouble logging in,",
    contactSupport: "contact support",
  },
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()

  const lang = (params?.lang as string) || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz
  const returnUrl = searchParams?.get("returnUrl")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`${AUTH_BASE}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("access_token", data.access)
        localStorage.setItem("refresh_token", data.refresh)
        localStorage.setItem("user_email", formData.email)

        if (returnUrl) {
          router.push(returnUrl)
        } else {
          router.push(`/${lang}`)
        }
      } else {
        setError(JSON.stringify(data))
      }
    } catch (err: any) {
      setError(err.message || "Serverga ulanib bo'lmadi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">{t.title}</CardTitle>
              <CardDescription className="text-sm sm:text-base text-muted-foreground">{t.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">
                    {t.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm sm:text-base">
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t.passwordPlaceholder}
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 text-sm sm:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">{t.rememberMe}</span>
                  </label>
                  <Link href={`/${lang}/forgot-password`} className="text-primary hover:underline">
                    {t.forgotPassword}
                  </Link>
                </div>

                <Button type="submit" className="w-full text-sm sm:text-base" size="lg" disabled={isLoading}>
                  {isLoading ? t.loggingIn : t.loginButton}
                </Button>
              </form>

              <Separator />

              <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t.noAccount}{" "}
                  <Link href={`/${lang}/register`} className="text-primary hover:underline font-medium">
                    {t.register}
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {t.needHelp}{" "}
                  <Link href={`/${lang}/contact`} className="text-primary hover:underline">
                    {t.contactSupport}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

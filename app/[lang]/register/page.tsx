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
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

const AUTH_BASE = "https://artculture.pythonanywhere.com/auth"

const translations = {
  uz: {
    title: "Ro'yxatdan o'tish",
    description: "Hisob yaratish uchun quyidagi formani to'ldiring",
    username: "Foydalanuvchi nomi",
    usernamePlaceholder: "Foydalanuvchi nomingiz",
    email: "Email",
    emailPlaceholder: "example@email.com",
    password: "Parol",
    passwordPlaceholder: "Parol kiriting",
    confirmPassword: "Parolni tasdiqlang",
    confirmPasswordPlaceholder: "Parolni qayta kiriting",
    registerButton: "Ro'yxatdan o'tish",
    registering: "Ro'yxatdan o'tilmoqda...",
    haveAccount: "Hisobingiz bormi?",
    login: "Tizimga kiring",
    errors: {
      usernameRequired: "Foydalanuvchi nomi majburiy",
      usernameInvalid: "Faqat harflar, raqamlar va @/./+/-/_ belgilariga ruxsat beriladi",
      emailRequired: "Email majburiy",
      emailInvalid: "Email noto'g'ri formatda",
      passwordRequired: "Parol majburiy",
      passwordTooShort: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
      passwordMismatch: "Parollar mos emas",
    },
  },
  ru: {
    title: "Регистрация",
    description: "Заполните форму для создания аккаунта",
    username: "Имя пользователя",
    usernamePlaceholder: "Ваше имя пользователя",
    email: "Email",
    emailPlaceholder: "example@email.com",
    password: "Пароль",
    passwordPlaceholder: "Введите пароль",
    confirmPassword: "Подтвердите пароль",
    confirmPasswordPlaceholder: "Введите пароль повторно",
    registerButton: "Зарегистрироваться",
    registering: "Регистрация...",
    haveAccount: "Уже есть аккаунт?",
    login: "Войти",
    errors: {
      usernameRequired: "Имя пользователя обязательно",
      usernameInvalid: "Разрешены только буквы, цифры и символы @/./+/-/_",
      emailRequired: "Email обязателен",
      emailInvalid: "Неверный формат email",
      passwordRequired: "Пароль обязателен",
      passwordTooShort: "Пароль должен содержать минимум 6 символов",
      passwordMismatch: "Пароли не совпадают",
    },
  },
  en: {
    title: "Register",
    description: "Fill out the form to create an account",
    username: "Username",
    usernamePlaceholder: "Your username",
    email: "Email",
    emailPlaceholder: "example@email.com",
    password: "Password",
    passwordPlaceholder: "Enter password",
    confirmPassword: "Confirm password",
    confirmPasswordPlaceholder: "Re-enter password",
    registerButton: "Register",
    registering: "Registering...",
    haveAccount: "Already have an account?",
    login: "Login",
    errors: {
      usernameRequired: "Username is required",
      usernameInvalid: "Only letters, numbers and @/./+/-/_ are allowed",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email format",
      passwordRequired: "Password is required",
      passwordTooShort: "Password must be at least 6 characters",
      passwordMismatch: "Passwords do not match",
    },
  },
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const params = useParams()

  const lang = (params?.lang as string) || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = t.errors.usernameRequired
    } else {
      const usernameRegex = /^[\w.@+-]+$/
      if (!usernameRegex.test(formData.username)) {
        newErrors.username = t.errors.usernameInvalid
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = t.errors.emailRequired
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.errors.emailInvalid
    }

    if (!formData.password) {
      newErrors.password = t.errors.passwordRequired
    } else if (formData.password.length < 6) {
      newErrors.password = t.errors.passwordTooShort
    }

    if (formData.password !== formData.password2) {
      newErrors.password2 = t.errors.passwordMismatch
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const res = await fetch(`${AUTH_BASE}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        router.push(`/${lang}/login`)
      } else {
        if (data.email) setErrors({ email: data.email[0] })
        else if (data.username) setErrors({ username: data.username[0] })
        else if (data.password) setErrors({ password: data.password[0] })
        else if (data.password2) setErrors({ password2: data.password2[0] })
        else setErrors({ general: JSON.stringify(data) })
      }
    } catch (err: any) {
      setErrors({ general: err.message || "Serverga ulanib bo'lmadi" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
    }
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
                {errors.general && (
                  <p className="text-xs sm:text-sm text-destructive bg-destructive/10 p-2 rounded">{errors.general}</p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm sm:text-base">
                    {t.username}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder={t.usernamePlaceholder}
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 text-sm sm:text-base"
                      required
                    />
                  </div>
                  {errors.username && <p className="text-xs sm:text-sm text-destructive">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">
                    {t.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                  {errors.email && <p className="text-xs sm:text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm sm:text-base">
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs sm:text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password2" className="text-sm sm:text-base">
                    {t.confirmPassword}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password2"
                      name="password2"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t.confirmPasswordPlaceholder}
                      value={formData.password2}
                      onChange={handleChange}
                      className="pl-10 pr-10 text-sm sm:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password2 && <p className="text-xs sm:text-sm text-destructive">{errors.password2}</p>}
                </div>

                <Button type="submit" className="w-full text-sm sm:text-base" size="lg" disabled={isLoading}>
                  {isLoading ? t.registering : t.registerButton}
                </Button>
              </form>

              <Separator />

              <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t.haveAccount}{" "}
                  <Link href={`/${lang}/login`} className="text-primary hover:underline font-medium">
                    {t.login}
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

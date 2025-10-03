"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"

const AUTH_BASE = "https://artculture.pythonanywhere.com/auth"

const translations = {
  uz: {
    title: "Parolni tiklash",
    description: "Email manzilingizni kiriting va parolni tiklash havolasini yuboramiz",
    emailLabel: "Email manzil",
    emailPlaceholder: "example@email.com",
    sendButton: "Havolani yuborish",
    sendingButton: "Yuborilmoqda...",
    successMessage: "Parolni tiklash uchun havola emailingizga yuborildi.",
    errorDefault: "Xatolik yuz berdi",
    errorNetwork: "Serverga ulanib bo'lmadi",
  },
  ru: {
    title: "Восстановление пароля",
    description: "Введите ваш email адрес и мы отправим ссылку для восстановления пароля",
    emailLabel: "Email адрес",
    emailPlaceholder: "example@email.com",
    sendButton: "Отправить ссылку",
    sendingButton: "Отправка...",
    successMessage: "Ссылка для восстановления пароля отправлена на ваш email.",
    errorDefault: "Произошла ошибка",
    errorNetwork: "Не удалось подключиться к серверу",
  },
  en: {
    title: "Password Recovery",
    description: "Enter your email address and we'll send you a password reset link",
    emailLabel: "Email Address",
    emailPlaceholder: "example@email.com",
    sendButton: "Send Link",
    sendingButton: "Sending...",
    successMessage: "Password reset link has been sent to your email.",
    errorDefault: "An error occurred",
    errorNetwork: "Could not connect to server",
  },
}

export default function ForgotPasswordPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch(`${AUTH_BASE}/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(t.successMessage)
      } else {
        setError(data.detail || t.errorDefault)
      }
    } catch (err: any) {
      setError(t.errorNetwork)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
              <CardDescription className="text-muted-foreground">{t.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.emailLabel}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {message && <p className="text-green-600 text-sm">{message}</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? t.sendingButton : t.sendButton}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

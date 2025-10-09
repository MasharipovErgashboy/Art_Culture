"use client"

import type React from "react"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react"

const AUTH_BASE = "https://artculture.pythonanywhere.com/auth"

const translations = {
  uz: {
    title: "Parolni tiklash",
    description: "Email manzilingizni kiriting va parolni tiklash havolasini yuboramiz",
    emailLabel: "Email manzil",
    emailPlaceholder: "example@email.com",
    sendButton: "Havolani yuborish",
    sendingButton: "Yuborilmoqda...",
    resendButton: "Qayta yuborish",
    successMessage: "Parolni tiklash uchun havola yuborildi!",
    successNote: "Iltimos, emailingizni tekshiring. Agar xat kelmasa, spam papkasini ham ko'rib chiqing.",
    spamNote: "Eslatma: Xat spam papkasiga tushgan bo'lishi mumkin.",
    waitNote: "Qayta yuborish uchun {seconds} soniya kuting...",
    errorDefault: "Xatolik yuz berdi",
    errorNetwork: "Serverga ulanib bo'lmadi",
    backendNote: "Agar email kelmasa, backend email xizmatini sozlash kerak (SMTP, SendGrid, AWS SES).",
  },
  ru: {
    title: "Восстановление пароля",
    description: "Введите ваш email адрес и мы отправим ссылку для восстановления пароля",
    emailLabel: "Email адрес",
    emailPlaceholder: "example@email.com",
    sendButton: "Отправить ссылку",
    sendingButton: "Отправка...",
    resendButton: "Отправить повторно",
    successMessage: "Ссылка для восстановления пароля отправлена!",
    successNote: "Пожалуйста, проверьте вашу почту. Если письмо не пришло, проверьте папку спам.",
    spamNote: "Примечание: Письмо может попасть в папку спам.",
    waitNote: "Подождите {seconds} секунд перед повторной отправкой...",
    errorDefault: "Произошла ошибка",
    errorNetwork: "Не удалось подключиться к серверу",
    backendNote: "Если email не приходит, необходимо настроить email сервис на backend (SMTP, SendGrid, AWS SES).",
  },
  en: {
    title: "Password Recovery",
    description: "Enter your email address and we'll send you a password reset link",
    emailLabel: "Email Address",
    emailPlaceholder: "example@email.com",
    sendButton: "Send Link",
    sendingButton: "Sending...",
    resendButton: "Resend",
    successMessage: "Password reset link has been sent!",
    successNote: "Please check your email. If you don't see it, check your spam folder.",
    spamNote: "Note: The email might be in your spam folder.",
    waitNote: "Wait {seconds} seconds before resending...",
    errorDefault: "An error occurred",
    errorNetwork: "Could not connect to server",
    backendNote: "If email is not received, backend email service needs to be configured (SMTP, SendGrid, AWS SES).",
  },
}

export default function ForgotPasswordPage({ params }: { params: { lang: string } }) {
  const currentLang = params.lang || "uz"
  const t = translations[currentLang as keyof typeof translations] || translations.uz

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

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
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
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

                {message && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <p className="font-semibold mb-1">{message}</p>
                      <p className="text-sm">{t.successNote}</p>
                      <p className="text-xs mt-2 text-green-700">{t.spamNote}</p>
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {countdown > 0 ? (
                  <Button type="button" className="w-full" size="lg" disabled>
                    {t.waitNote.replace("{seconds}", countdown.toString())}
                  </Button>
                ) : (
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? t.sendingButton : message ? t.resendButton : t.sendButton}
                  </Button>
                )}

                {process.env.NODE_ENV === "development" && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs text-blue-800">{t.backendNote}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

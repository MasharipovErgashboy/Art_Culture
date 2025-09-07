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

const AUTH_BASE = "http://10.20.1.89:8002/auth"

export default function ForgotPasswordPage() {
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
        setMessage("Parolni tiklash uchun havola emailingizga yuborildi.")
      } else {
        setError(data.detail || "Xatolik yuz berdi")
      }
    } catch (err: any) {
      setError("Serverga ulanib bo'lmadi")
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
              <CardTitle className="text-2xl font-bold">Parolni tiklash</CardTitle>
              <CardDescription className="text-muted-foreground">
                Email manzilingizni kiriting va parolni tiklash havolasini yuboramiz
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email manzil</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
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
                  {isLoading ? "Yuborilmoqda..." : "Havolani yuborish"}
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

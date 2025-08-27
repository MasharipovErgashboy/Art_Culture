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
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock authentication - in real app this would be actual authentication
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          name: "Abdulla",
          surname: "Karimov",
          email: formData.email,
          avatar: "/placeholder.svg?key=user-avatar",
        }),
      )

      setIsLoading(false)
      router.push("/")
      window.location.reload() // Refresh to update navbar state
    }, 1000)
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

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Tizimga kirish</CardTitle>
              <CardDescription className="text-muted-foreground">
                Art&Culture portaliga kirish uchun ma'lumotlaringizni kiriting
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email manzil</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Parol</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Parolingizni kiriting"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10"
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Meni eslab qol</span>
                  </label>
                  <Link href="/forgot-password" className="text-primary hover:underline">
                    Parolni unutdingizmi?
                  </Link>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Kirilmoqda..." : "Kirish"}
                </Button>
              </form>

              <Separator />

              <div className="text-center">
                <p className="text-muted-foreground">
                  Hisobingiz yo'qmi?{" "}
                  <Link href="/register" className="text-primary hover:underline font-medium">
                    Ro'yxatdan o'ting
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Tizimga kirishda muammo bo'lsa,{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    yordam xizmatiga murojaat qiling
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

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
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Ism kiritish majburiy"
    }

    if (!formData.surname.trim()) {
      newErrors.surname = "Familiya kiritish majburiy"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email manzil kiritish majburiy"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email manzil noto'g'ri formatda"
    }

    if (!formData.password) {
      newErrors.password = "Parol kiritish majburiy"
    } else if (formData.password.length < 6) {
      newErrors.password = "Parol kamida 6 ta belgidan iborat bo'lishi kerak"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Parollar mos kelmaydi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock registration - in real app this would be actual registration
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          name: formData.name,
          surname: formData.surname,
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

    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Ro'yxatdan o'tish</CardTitle>
              <CardDescription className="text-muted-foreground">
                Art&Culture portalida hisob yaratish uchun ma'lumotlaringizni kiriting
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ism</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Ismingiz"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surname">Familiya</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="surname"
                        name="surname"
                        type="text"
                        placeholder="Familiyangiz"
                        value={formData.surname}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                    {errors.surname && <p className="text-sm text-destructive">{errors.surname}</p>}
                  </div>
                </div>

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
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
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
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Parolni tasdiqlang</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Parolni qayta kiriting"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="mt-1 rounded border-border" required />
                  <p className="text-sm text-muted-foreground">
                    Men{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      foydalanish shartlari
                    </Link>{" "}
                    va{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      maxfiylik siyosati
                    </Link>{" "}
                    bilan tanishdim va roziman
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
                </Button>
              </form>

              <Separator />

              <div className="text-center">
                <p className="text-muted-foreground">
                  Hisobingiz bormi?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Tizimga kiring
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

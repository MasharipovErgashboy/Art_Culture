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
import { Badge } from "@/components/ui/badge"
import { CreditCard, Lock, ShieldCheck, ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "",
    phone: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)

  // Sample book data (in real app, this would come from cart/URL params)
  const book = {
    id: "uzbek-culture-history",
    title: "O'zbekiston madaniyati tarixi",
    author: "Prof. Karimov A.B.",
    price: "120,000 so'm",
    image: "/placeholder.svg?key=book1",
    isbn: "978-9943-01-234-5",
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim()
      if (formatted.length <= 19) {
        setFormData((prev) => ({ ...prev, [name]: formatted }))
      }
      return
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
      if (formatted.length <= 5) {
        setFormData((prev) => ({ ...prev, [name]: formatted }))
      }
      return
    }

    // Limit CVV to 3 digits
    if (name === "cvv") {
      const formatted = value.replace(/\D/g, "")
      if (formatted.length <= 3) {
        setFormData((prev) => ({ ...prev, [name]: formatted }))
      }
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      alert("To'lov muvaffaqiyatli amalga oshirildi! Kitob yuklab olish havolasi emailingizga yuborildi.")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-8 sm:py-12 responsive-padding">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-6">
            <Button variant="ghost" asChild className="hover-primary">
              <Link href="/books">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kitoblarga qaytish
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Buyurtma tafsilotlari
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-28 relative rounded-lg overflow-hidden">
                      <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
                      <p className="text-muted-foreground">{book.author}</p>
                      <Badge variant="outline">ISBN: {book.isbn}</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Kitob narxi:</span>
                      <span>{book.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Xizmat haqi:</span>
                      <span>0 so'm</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Jami:</span>
                      <span className="text-primary">{book.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-primary">
                    <ShieldCheck className="h-6 w-6" />
                    <div>
                      <h4 className="font-semibold">Xavfsiz to'lov</h4>
                      <p className="text-sm text-muted-foreground">Barcha to'lovlar SSL shifrlash bilan himoyalangan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    To'lov ma'lumotlari
                  </CardTitle>
                  <CardDescription>Xavfsiz to'lov uchun karta ma'lumotlaringizni kiriting</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email manzil *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefon raqam *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+998 90 123 45 67"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardholderName">Karta egasining ismi *</Label>
                        <Input
                          id="cardholderName"
                          name="cardholderName"
                          value={formData.cardholderName}
                          onChange={handleInputChange}
                          placeholder="JOHN SMITH"
                          required
                          className="mt-1 uppercase"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardNumber">Karta raqami *</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            className="mt-1 pr-12"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Amal qilish muddati *</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>Sizning ma'lumotlaringiz xavfsiz va shifrlangan</span>
                    </div>

                    <Button type="submit" className="w-full hover-primary" size="lg" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          To'lov amalga oshirilmoqda...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          {book.price} to'lash
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

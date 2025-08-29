"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  Users,
  BookOpen,
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Manzil",
      details: [" О‘zbekiston Respublikasi Toshkent sh. Mirzo Ulug’bek tumani, Yalang’och dahasi 127 «A» uy. 100164"],
    },
    {
      icon: Phone,
      title: "Telefon",
      details: ["(71)230-28-15", "(71)230-28-15"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@artculture.uz", "support@artculture.uz"],
    },
    {
      icon: Clock,
      title: "Ish vaqti",
      details: ["Dushanba - Juma: 9:00 - 18:00", "Shanba: 9:00 - 14:00", "Yakshanba: Dam olish kuni"],
    },
  ]

  const departments = [
    {
      name: "Ilmiy bo'lim",
      email: "science@artculture.uz",
      phone: "+998 71 227 12 26",
      description: "Ilmiy nashrlar va tadqiqotlar bo'yicha savollar",
    },
    {
      name: "Texnik yordam",
      email: "support@artculture.uz",
      phone: "+998 71 227 12 27",
      description: "Portal ishida texnik muammolar",
    },
    {
      name: "Hamkorlik bo'limi",
      email: "partnership@artculture.uz",
      phone: "+998 71 227 12 28",
      description: "Hamkorlik va loyihalar bo'yicha takliflar",
    },
  ]

  const faqData = [
    {
      icon: Users,
      category: "Foydalanuvchi hisobi",
      question: "Portaldan qanday foydalanish mumkin?",
      answer:
        "Portal bepul foydalanish uchun ochiq. Ro'yxatdan o'tish orqali barcha imkoniyatlardan foydalanishingiz mumkin. Shaxsiy kabinetingizda sevimli maqolalar va kitoblarni saqlash, yuklab olish tarixi va boshqa qulayliklardan foydalanishingiz mumkin.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: BookOpen,
      category: "Nashr qilish",
      question: "Maqola yoki kitob qanday nashr qilish mumkin?",
      answer:
        "Maqola nashr qilish uchun ilmiy bo'lim bilan bog'laning. Barcha maqolalar ilmiy ekspertizadan o'tadi. Nashr qilish jarayoni: 1) Maqolani yuborish, 2) Ilmiy ekspertiza, 3) Tahrirlash, 4) Nashr qilish. Jarayon 2-4 hafta davom etadi.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: HelpCircle,
      category: "Texnik yordam",
      question: "Texnik yordam qanday olish mumkin?",
      answer:
        "Texnik muammolar uchun support@artculture.uz manziliga yozing yoki +998 71 227 12 27 raqamiga qo'ng'iroq qiling. Bizning texnik yordam jamoasi 24/7 ishlaydi va barcha muammolarni tezkor hal qiladi. Masofaviy yordam ham taqdim etamiz.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: MessageSquare,
      category: "Hamkorlik",
      question: "Hamkorlik qilish va loyiha taklif qilish mumkinmi?",
      answer:
        "Albatta! Hamkorlik takliflari uchun partnership@artculture.uz manziliga murojaat qiling. Biz universitetlar, tadqiqot markazlari va xalqaro tashkilotlar bilan hamkorlik qilishdan mamnunmiz. Loyiha takliflaringizni kutamiz.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: BookOpen,
      category: "Kirish huquqlari",
      question: "Barcha materiallar bepulmi?",
      answer:
        "Portalning asosiy qismi bepul. Ba'zi premium kitoblar va maxsus tadqiqotlar uchun to'lov talab qilinishi mumkin. Talabalar va tadqiqotchilar uchun maxsus chegirmalar mavjud. Batafsil ma'lumot uchun biz bilan bog'laning.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Users,
      category: "Jamoat aloqalari",
      question: "Konferensiya va tadbirlarda qanday qatnashish mumkin?",
      answer:
        "Bizning konferensiya va tadbirlar haqida ma'lumot olish uchun 'Konferensiya' bo'limiga tashrif buyuring. Ro'yxatdan o'tgan foydalanuvchilar barcha tadbirlar haqida email orqali xabardor qilinadi. Onlayn va oflayn tadbirlarda qatnashish mumkin.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />



      {/* Main Content */}
      <section className="py-12 sm:py-16 responsive-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">
            {/* Contact Form */}
            <div>
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">Xabar yuborish</CardTitle>
                  <p className="text-muted-foreground responsive-text">
                    Quyidagi formani to'ldiring va biz tez orada siz bilan bog'lanamiz.
                  </p>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Xabar yuborildi!</h3>
                      <p className="text-muted-foreground">
                        Sizning xabaringiz muvaffaqiyatli yuborildi. Biz tez orada siz bilan bog'lanamiz.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Ism va familiya *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Ismingiz va familiyangiz"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email manzil *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Mavzu *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          placeholder="Xabar mavzusi"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Xabar *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Xabaringizni bu yerga yozing..."
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full hover-secondary" size="lg" disabled={isLoading}>
                        {isLoading ? (
                          "Yuborilmoqda..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Xabar yuborish
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Aloqa ma'lumotlari</h2>
                <div className="grid grid-cols-1 gap-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                              {info.details.map((detail, idx) => (
                                <p key={idx} className="text-muted-foreground responsive-text">
                                  {detail}
                                </p>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                Bo'limlar
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty">
                Muayyan masalalar bo'yicha to'g'ridan-to'g'ri tegishli bo'lim bilan bog'laning
              </p>
            </div>

            <div className="responsive-grid">
              {departments.map((dept, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">{dept.name}</CardTitle>
                    <p className="text-muted-foreground responsive-text">{dept.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm sm:text-base">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${dept.email}`} className="text-primary hover:underline">
                          {dept.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-sm sm:text-base">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${dept.phone}`} className="text-primary hover:underline">
                          {dept.phone}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced FAQ Section */}
          <div>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
                Tez-tez so'raladigan savollar
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground text-pretty">
                Eng ko'p so'raladigan savollar va batafsil javoblar
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqData.map((faq, index) => {
                const IconComponent = faq.icon
                const isOpen = openFAQ === index
                return (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                  >
                    <CardHeader
                      className="cursor-pointer hover:bg-primary/5 transition-colors duration-200"
                      onClick={() => toggleFAQ(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${faq.bgColor}`}>
                            <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${faq.color}`} />
                          </div>
                          <div className="text-left">
                            <div className="text-xs sm:text-sm text-muted-foreground mb-1">{faq.category}</div>
                            <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
                              {faq.question}
                            </CardTitle>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {isOpen && (
                      <CardContent className="pt-0 pb-6">
                        <div className="ml-16 sm:ml-20">
                          <p className="text-muted-foreground leading-relaxed responsive-text">{faq.answer}</p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <Card className="inline-block p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground mb-1">Javobingizni topa olmadingizmi?</h3>
                    <p className="text-muted-foreground text-sm">Biz bilan bog'laning, sizga yordam beramiz</p>
                  </div>
                  <Button variant="outline" className="hover-secondary bg-transparent">
                    Savol berish
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

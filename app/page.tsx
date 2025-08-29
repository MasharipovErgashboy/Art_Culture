"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  FileText,
  Calendar,
  Globe,
  Users,
  Lightbulb,
  Award,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Star,
  Bell,
  Eye,
  Play,
  Volume2,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showVideoModal, setShowVideoModal] = useState(false)

  const slides = [
    {
      title: "Yangi ilmiy jurnallar",
      description: "2024-yilning eng so'nggi tadqiqot natijalari va ilmiy maqolalar",
      image: "/scientific-research-books-and-journals.png",
      buttonText: "Batafsil",
      href: "/journals",
    },
    {
      title: "Xalqaro konferensiya",
      description: "Zamonaviy texnologiyalar va innovatsiyalar bo'yicha xalqaro anjuman",
      image: "/Conference.jpg",
      buttonText: "Ro'yxatdan o'tish",
      href: "/conference",
    },
    {
      title: "Akademik kitoblar",
      description: "Oliy ta'lim muassasalari uchun maxsus tayyorlangan darsliklar",
      image: "/Akademic.jpg",
      buttonText: "Kitoblarni ko'rish",
      href: "/books",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const sections = [
    {
      title: "Jurnallar",
      description: "Ilmiy jurnallar va maqolalar to'plami",
      icon: FileText,
      href: "/journals",
      color: "text-primary",
    },
    {
      title: "Kitoblar",
      description: "Akademik kitoblar va darsliklar",
      icon: BookOpen,
      href: "/books",
      color: "text-secondary",
    },
    {
      title: "Konferensiya",
      description: "Ilmiy konferensiyalar va tadbirlar",
      icon: Calendar,
      href: "/conference",
      color: "text-primary",
    },
  ]

  const handlePdfView = (language: string) => {
    const pdfUrls = {
      uzbek: "/rector-info-uz.pdf",
      russian: "/rector-info-ru.pdf",
      english: "/rector-info-en.pdf",
    }

    const url = pdfUrls[language as keyof typeof pdfUrls] || pdfUrls.uzbek
    window.open(url, "_blank")
  }

  const handleVideoClick = () => {
    setShowVideoModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Swiper */}
      <section className="py-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-3">
              <Card className="h-96 bg-white/20 backdrop-blur-md border-white/30 shadow-2xl rounded-none overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="bg-gradient-to-r from-white/30 to-white/20 p-4 flex items-center justify-center border-b">
                    <Bell className="w-5 h-5 mr-2" />
                    <h3 className="font-bold text-sm">RASMIY E'LON</h3>
                  </div>
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/50">
                        <img src="/rector-photo.jpg" alt="Rektor" className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">NODIRBEK SAYFULLAYEV</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        Universitetimiz rektori, ilmiy faoliyat va ta'lim sohasi bo'yicha mutaxassis
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-800 mb-2">Maqolasi:</p>

                      <Button
                        size="sm"
                        onClick={() => handlePdfView("uzbek")}
                        className="w-full bg-[#003D7F] hover:bg-[#002B5A] text-white text-xs flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        O'zbek tilida
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handlePdfView("russian")}
                        className="w-full bg-[#003D7F] hover:bg-[#002B5A] text-white text-xs flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Rus tilida
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handlePdfView("english")}
                        className="w-full bg-[#003D7F] hover:bg-[#002B5A] text-white text-xs flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        English
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-6">
              <div className="relative bg-white shadow-xl overflow-hidden rounded-none">
                <div className="relative h-96">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={slide.image || "/placeholder.svg"}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center text-white px-8">
                          <h2 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                          <p className="text-lg mb-6 max-w-2xl">{slide.description}</p>
                          <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                            <Link href={slide.href}>{slide.buttonText}</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <Card className="h-96 bg-white/20 backdrop-blur-md border-white/30 shadow-2xl rounded-none overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="bg-gradient-to-r from-white/30 to-white/20 p-4 flex items-center justify-center border-b">
                    <Megaphone className="w-5 h-5 mr-2" />
                    <h3 className="font-bold text-sm">REKLAMA</h3>
                  </div>
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    <div className="bg-gradient-to-br from-[#003D7F]/20 to-[#0059B2]/20 rounded-xl p-4 border shadow-lg hover:shadow-xl transition-all">
                      <div className="relative mb-3">
                        <div
                          className="aspect-video bg-black/80 rounded-lg overflow-hidden relative group cursor-pointer"
                          onClick={handleVideoClick}
                        >
                          <img src="/video-poster.jpg" alt="Video reklama" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-all">
                            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                              <Play className="w-7 h-7 text-gray-800 ml-1" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2">
                            <Volume2 className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            LIVE
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-[#003D7F] to-[#0059B2] rounded-full flex items-center justify-center mr-2">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-bold text-gray-800">ACP</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                        Ilmiy tadqiqot metodlari bo'yicha professional treninglar
                      </p>
                      <Button
                        size="sm"
                        onClick={handleVideoClick}
                        className="w-full bg-gradient-to-r from-[#003D7F] to-[#0059B2] hover:from-[#002B5A] hover:to-[#004080] text-white text-xs"
                      >
                        Videoni ko'rish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video controls autoPlay className="w-full h-full" poster="/video-poster.jpg">
                <source src="/Reklama_1.mp4" type="video/mp4" />
                Brauzeringiz video formatini qo'llab-quvvatlamaydi.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Main Sections */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">Asosiy bo'limlar</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ilmiy resurslar va ma'lumotlarga tezkor kirish uchun kerakli bo'limlarni tanlang
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Card
                  key={section.title}
                  className="group hover:shadow-lg transition-all duration-300 border hover:border-primary/30 hover:scale-105"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                      <Icon className={`h-8 w-8 ${section.color}`} />
                    </div>
                    <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button variant="outline" asChild className="w-full bg-transparent">
                      <Link href={section.href}>Ko'rish</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 bg-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Nima uchun bizni tanlaysiz?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ilmiy tadqiqotlar va ta'lim sohasida eng yaxshi xizmatlarni taqdim etamiz
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-4 p-6 rounded-lg bg-background/50 hover:bg-background">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Sifatli kontent</h3>
              <p className="text-muted-foreground">Ekspert tomonidan tekshirilgan ilmiy materiallar</p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-background/50 hover:bg-background">
              <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <Globe className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Global kirish</h3>
              <p className="text-muted-foreground">Istalgan joydan 24/7 kirish imkoniyati</p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-background/50 hover:bg-background">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Hamjamiyat</h3>
              <p className="text-muted-foreground">Tadqiqotchilar va olimlar jamoasi</p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-background/50 hover:bg-background">
              <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Innovatsiya</h3>
              <p className="text-muted-foreground">Zamonaviy texnologiyalar va yondashuvlar</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

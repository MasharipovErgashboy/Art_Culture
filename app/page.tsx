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
  Award,
  Lightbulb,
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
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0)
  const [currentBookSlide, setCurrentBookSlide] = useState(0)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)

  const slides = [
    {
      title: "Yangi ilmiy jurnallar",
      description: "2024-yilning eng so'nggi tadqiqot natijalari va ilmiy maqolalar",
      image: "/scientific-research-books-and-journals.jpg",
      buttonText: "Batafsil",
      href: "/journals",
    },
    {
      title: "Xalqaro konferensiya",
      description: "Zamonaviy texnologiyalar va innovatsiyalar bo'yicha xalqaro anjuman",
      image: "/swiper_konferensiya.jpg",
      buttonText: "Ro'yxatdan o'tish",
      href: "/conference",
    },
    {
      title: "Akademik kitoblar",
      description: "Oliy ta'lim muassasalari uchun maxsus tayyorlangan darsliklar",
      image: "/swiper_konferensiya2.jpg",
      buttonText: "Kitoblarni ko'rish",
      href: "/books",
    },
  ]

  const adSlides = [
    {
      title: "Premium Kurs Dasturi",
      company: "EduTech Academy",
      category: "Ta'lim xizmatlari",
      price: "299,000 so'm",
      originalPrice: "450,000 so'm",
      discount: "33%",
      image: "/premium-course-advertisement-modern-education.jpg",
      isPopular: true,
      badge: "Eng mashhur",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "/premium-course-video-thumbnail.jpg",
      description: "Zamonaviy ta'lim texnologiyalari bo'yicha professional treninglar",
    },
    {
      title: "Ilmiy Tadqiqot Vositalari",
      company: "Research Pro",
      category: "Dasturiy ta'minot",
      price: "150,000 so'm",
      originalPrice: "200,000 so'm",
      discount: "25%",
      image: "/research-tools-software-advertisement-analytics.jpg",
      isPopular: true,
      badge: "Bestseller",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "/research-software-demo-thumbnail.jpg",
      description: "Ilmiy tadqiqotlar uchun professional tahlil dasturlari",
    },
    {
      title: "Onlayn Konferensiya Platformasi",
      company: "ConferenceHub",
      category: "Texnologiya xizmatlari",
      price: "89,000 so'm",
      originalPrice: "120,000 so'm",
      discount: "26%",
      image: "/online-conference-platform-advertisement-virtual.jpg",
      isPopular: false,
      badge: "Yangi xizmat",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "/conference-platform-demo-thumbnail.jpg",
      description: "Virtual konferensiyalar va vebinarlar uchun professional platforma",
    },
    {
      title: "Akademik Yozuv Kursi",
      company: "WriteAcademic",
      category: "Skill Development",
      price: "199,000 so'm",
      originalPrice: "280,000 so'm",
      discount: "29%",
      image: "/academic-writing-course-advertisement-professional.jpg",
      isPopular: true,
      badge: "Top reyting",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "/academic-writing-tutorial-thumbnail.jpg",
      description: "Ilmiy maqolalar va dissertatsiyalar yozish bo'yicha kurs",
    },
    {
      title: "Statistik Tahlil Dasturi",
      company: "DataAnalytics Pro",
      category: "Dasturiy ta'minot",
      price: "320,000 so'm",
      originalPrice: "450,000 so'm",
      discount: "29%",
      image: "/statistical-analysis-software-advertisement-data.jpg",
      isPopular: false,
      badge: "Professional",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "/statistics-software-demo-thumbnail.jpg",
      description: "Ilmiy tadqiqotlar uchun kuchli statistik tahlil vositalari",
    },
    {
      title: "Nashriyot Xizmatlari",
      company: "PublishExpert",
      category: "Nashriyot xizmatlari",
      price: "250,000 so'm",
      originalPrice: "350,000 so'm",
      discount: "28%",
      image: "/publishing-services-advertisement-academic-journal.jpg",
      isPopular: true,
      badge: "Kafolat bilan",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "/publishing-process-video-thumbnail.jpg",
      description: "Ilmiy maqolalar va kitoblarni nashr qilish xizmatlari",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    const videoTimer = setInterval(() => {
      setCurrentVideoSlide((prev) => (prev + 1) % adSlides.length)
    }, 5000)
    return () => clearInterval(videoTimer)
  }, [adSlides.length])

  useEffect(() => {
    const bookTimer = setInterval(() => {
      setCurrentBookSlide((prev) => (prev + 1) % adSlides.length)
    }, 4000)
    return () => clearInterval(bookTimer)
  }, [adSlides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const nextVideoSlide = () => setCurrentVideoSlide((prev) => (prev + 1) % adSlides.length)
  const prevVideoSlide = () => setCurrentVideoSlide((prev) => (prev - 1 + adSlides.length) % adSlides.length)

  const nextBookSlide = () => setCurrentBookSlide((prev) => (prev + 1) % adSlides.length)
  const prevBookSlide = () => setCurrentBookSlide((prev) => (prev - 1 + adSlides.length) % adSlides.length)

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

  const handleVideoPlay = (youtubeId: string) => {
    setSelectedVideoId(youtubeId)
    setShowVideoModal(true)
  }

  const handleSubscriptionClick = (planType: string) => {
    // Redirect to login page since user is not authenticated
    router.push("/login")
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#DCE3F8" }}>
      <Navbar />

      <section className="py-8">
        <div className="w-full px-2">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Chap Card - RASMIY E'LON */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] bg-white/20 backdrop-blur-md border-white/30 shadow-2xl rounded-l-lg rounded-r-none lg:rounded-r-none overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-white/30 to-white/20 p-4 flex items-center justify-center border-b">
                    <Bell className="w-5 h-5 mr-2" />
                    <h3 className="font-bold text-sm">RASMIY E'LON</h3>
                  </div>

                  {/* Content (centered) */}
                  <div className="flex-1 p-4 flex flex-col justify-center items-center space-y-6 text-center">
                    {/* Rektor */}
                    <div>
                      <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/50">
                        <img src="/rektor-photo.jpg" alt="Rektor" className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">NODIRBEK SAYFULLAYEV</h4>
                      <p className="text-sm text-gray-700 leading-relaxed max-w-[200px] mx-auto">
                        Universitetimiz rektori, ilmiy faoliyat va ta'lim sohasi bo'yicha mutaxassis
                      </p>
                    </div>

                    {/* Maqola tugmalari */}
                    <div className="w-full space-y-2">
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

                    {/* Hikmat */}
                    <div className="w-full bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-3 mb-4 rounded-r-lg">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 mr-2" />
                        <span className="text-xs font-semibold text-amber-800">Konfutsiy hikmati</span>
                      </div>
                      <p className="text-xs italic text-amber-700 leading-relaxed text-left">
                        "Bilim olish - hayotning eng katta boyligi"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* O'rta Swiper */}
            <div className="lg:col-span-6">
              <div className="relative bg-white shadow-xl overflow-hidden rounded-none">
                <div className="relative h-[600px]">
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

            {/* O'ng Card - REKLAMA */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] bg-white/20 backdrop-blur-md border-white/30 shadow-2xl rounded-r-lg rounded-l-none lg:rounded-l-none overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="bg-gradient-to-r from-white/30 to-white/20 p-4 flex items-center justify-center border-b">
                    <Megaphone className="w-5 h-5 mr-2" />
                    <h3 className="font-bold text-sm">REKLAMA</h3>
                  </div>
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {/* Video reklama */}
                    <div className="bg-gradient-to-br from-[#003D7F]/20 to-[#0059B2]/20 rounded-xl p-4 border shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="relative mb-3">
                        <div
                          className="aspect-video bg-black/80 rounded-lg overflow-hidden relative group cursor-pointer"
                          onClick={() => handleVideoPlay(adSlides[currentVideoSlide].youtubeId)}
                        >
                          <img
                            src={adSlides[currentVideoSlide].thumbnail || "/placeholder.svg"}
                            alt="Video reklama"
                            className="w-full h-full object-cover"
                          />
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
                        <span className="text-xs font-bold text-gray-800">Premium Kurs</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                        Ilmiy tadqiqot metodlari bo'yicha professional treninglar
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleVideoPlay(adSlides[currentVideoSlide].youtubeId)}
                        className="w-full text-xs font-medium border-0"
                        style={{
                          backgroundColor: "#003D7F",
                          color: "#ffffff",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#002B5A"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#003D7F"
                        }}
                      >
                        Videoni ko'rish
                      </Button>
                    </div>
                    {/* Maxsus taklif */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-[#003D7F] to-[#0059B2] rounded-full flex items-center justify-center mr-2">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-bold text-gray-800">MAXSUS TAKLIF</span>
                      </div>
                      <p className="text-xs text-green-700 font-medium mb-2">Ilmiy nashrlar uchun 50% chegirma!</p>
                      <p className="text-xs text-green-600">Birinchi maqolangizni nashr qilish uchun maxsus narx</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {showVideoModal && selectedVideoId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => {
                setShowVideoModal(false)
                setSelectedVideoId(null)
              }}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
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

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16">
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

      {/* Advertisement Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Reklama</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Sizning ehtiyojlaringiz uchun maxsus takliflar va xizmatlar
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl mx-0">
            {/* Navigation Arrows */}
            <button
              onClick={prevBookSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            <button
              onClick={nextBookSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>

            <div className="overflow-hidden rounded-2xl mx-12">
              <div className="flex items-center justify-center gap-4">
                {/* Previous slide (left) */}
                <div className="w-1/4 opacity-50 scale-75 transition-all duration-500">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4">
                      <img
                        src={
                          adSlides[(currentBookSlide - 1 + adSlides.length) % adSlides.length].image ||
                          `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(adSlides[(currentBookSlide - 1 + adSlides.length) % adSlides.length].title + " advertisement") || "/placeholder.svg"}`
                        }
                        alt={adSlides[(currentBookSlide - 1 + adSlides.length) % adSlides.length].title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <h4 className="text-sm font-semibold mt-2 truncate">
                        {adSlides[(currentBookSlide - 1 + adSlides.length) % adSlides.length].title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Current slide (center) */}
                <div className="w-1/2 scale-100 transition-all duration-500">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="grid md:grid-cols-5 gap-0">
                      {/* Advertisement Image - Left Side */}
                      <div className="md:col-span-2 bg-gradient-to-br from-blue-100 to-indigo-100 p-8 flex items-center justify-center">
                        <div className="relative">
                          <img
                            src={
                              adSlides[currentBookSlide].image ||
                              `/placeholder.svg?height=280&width=200&query=${encodeURIComponent(adSlides[currentBookSlide].title + " advertisement") || "/placeholder.svg"}`
                            }
                            alt={adSlides[currentBookSlide].title}
                            className="w-40 h-56 object-cover rounded-lg shadow-lg"
                          />
                          {adSlides[currentBookSlide].discount && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              -{adSlides[currentBookSlide].discount}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Advertisement Details - Right Side */}
                      <div className="md:col-span-3 p-8 flex flex-col justify-center">
                        <div className="mb-3">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {adSlides[currentBookSlide].category}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">
                          {adSlides[currentBookSlide].title}
                        </h3>

                        <p className="text-slate-600 mb-2">{adSlides[currentBookSlide].company}</p>

                        <p className="text-slate-500 text-sm mb-4">{adSlides[currentBookSlide].description}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-slate-500">(4.8)</span>
                        </div>

                        <div className="flex items-baseline gap-3 mb-6">
                          <span className="text-2xl font-bold text-green-600">{adSlides[currentBookSlide].price}</span>
                          {adSlides[currentBookSlide].originalPrice && (
                            <span className="text-slate-400 line-through">
                              {adSlides[currentBookSlide].originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Buyurtma berish</Button>
                          <Button
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                          >
                            Batafsil
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next slide (right) */}
                <div className="w-1/4 opacity-50 scale-75 transition-all duration-500">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4">
                      <img
                        src={
                          adSlides[(currentBookSlide + 1) % adSlides.length].image ||
                          `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(adSlides[(currentBookSlide + 1) % adSlides.length].title + " advertisement") || "/placeholder.svg"}`
                        }
                        alt={adSlides[(currentBookSlide + 1) % adSlides.length].title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <h4 className="text-sm font-semibold mt-2 truncate">
                        {adSlides[(currentBookSlide + 1) % adSlides.length].title}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {adSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBookSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentBookSlide ? "bg-blue-600 scale-125" : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-16 bg-[#DCE3F8] relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-black">Obuna xarid qilish</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Sizning ehtiyojlaringizga mos keladigan obuna rejasini tanlang va barcha premium xizmatlardan foydalaning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Weekly Subscription */}
            <Card className="relative bg-white hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-green-100">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-800">Haftalik obuna</CardTitle>
                <CardDescription className="text-slate-600">Qisqa muddatli loyihalar uchun ideal</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-slate-800 mb-1">49,000 so'm</div>
                  <div className="text-sm text-slate-500">/ hafta</div>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 text-left">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Barcha jurnallarga kirish
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>5 ta kitob yuklab olish
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Asosiy qo'llab-quvvatlash
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Konferensiya ma'lumotlari
                  </li>
                </ul>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-6"
                  onClick={() => handleSubscriptionClick("weekly")}
                >
                  Haftalik obuna
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Subscription - Popular */}
            <Card className="relative bg-white hover:shadow-xl transition-all duration-300 border-2 border-blue-500 transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Eng mashhur</span>
              </div>
              <CardHeader className="text-center pb-4 pt-8">
                <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-800">Oylik obuna</CardTitle>
                <CardDescription className="text-slate-600">Ko'pchilik tomonidan tanlanadigan reja</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-slate-800 mb-1">149,000 so'm</div>
                  <div className="text-sm text-slate-500">/ oy</div>
                  <div className="text-xs text-green-600 font-medium">25% tejash</div>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 text-left">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Barcha jurnallarga cheksiz kirish
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Cheksiz kitob yuklab olish
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Premium qo'llab-quvvatlash
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Konferensiya chegirmalari
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Ekskluziv kontentlar
                  </li>
                </ul>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6"
                  onClick={() => handleSubscriptionClick("monthly")}
                >
                  Oylik obuna
                </Button>
              </CardContent>
            </Card>

            {/* Annual Subscription */}
            <Card className="relative bg-white hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-purple-100">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-800">Yillik obuna</CardTitle>
                <CardDescription className="text-slate-600">Maksimal tejash va imtiyozlar</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-slate-800 mb-1">1,299,000 so'm</div>
                  <div className="text-sm text-slate-500">/ yil</div>
                  <div className="text-xs text-green-600 font-medium">40% tejash</div>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 text-left">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Barcha premium xizmatlar
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Cheksiz yuklab olish
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    VIP qo'llab-quvvatlash
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Bepul konferensiya kirish
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Shaxsiy konsultatsiya
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Ilk navbatda yangiliklar
                  </li>
                </ul>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
                  onClick={() => handleSubscriptionClick("annual")}
                >
                  Yillik obuna
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <p className="text-sm text-slate-500 mb-4">Barcha obunalar 7 kunlik bepul sinov muddati bilan keladi</p>
            <div className="flex justify-center items-center space-x-6 text-xs text-slate-400">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Istalgan vaqtda bekor qilish
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Xavfsiz to'lov
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                24/7 qo'llab-quvvatlash
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

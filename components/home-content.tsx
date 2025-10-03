"use client"

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
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchConferences, type Conference, getSlugForLang } from "@/lib/api"

interface RasmiyElon {
  id: number
  media: string | null
  homepage_content: string | null
  homepage_content_uz: string | null
  homepage_content_en: string | null
  homepage_content_ru: string | null
  description: string | null
  description_uz: string | null
  description_en: string | null
  description_ru: string | null
  title?: string
  slug?: string
  name?: string
  slug_uz?: string
  slug_ru?: string
  slug_en?: string
}

interface Reklama {
  id: number
  title: string
  description: string
  image?: string
  company?: string
  category?: string
  price?: string
  originalPrice?: string
  discount?: string
  media?: string
  homepage_content?: string
  slug_uz?: string
  slug_en?: string
  slug_ru?: string
}

interface Yangilik {
  id: number
  title: string
  description: string
  media?: string
  date: string
  slug_uz?: string
  slug_en?: string
  slug_ru?: string
}

interface ApiData {
  rasmiy_elon: RasmiyElon
  reklama: Reklama[]
  yangiliklar: Yangilik[]
}

const API_BASE = "http://127.0.0.1:8000"

const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
}

const isVideoFile = (url: string): boolean => {
  if (!url) return false
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"]
  const lowerUrl = url.toLowerCase()
  return videoExtensions.some((ext) => lowerUrl.endsWith(ext))
}

const translations = {
  uz: {
    rasmiyElon: "RASMIY E'LON",
    reklama: "REKLAMA",
    batafsil: "Batafsil",
    batafsilKorish: "Batafsil ko'rish",
    konferensiyaKorish: "Konferensiyani ko'rish",
    elonlarYuklanmoqda: "E'lonlar yuklanmoqda...",
    reklamalarYuklanmoqda: "Reklamalar yuklanmoqda...",
    konferensiyalarYuklanmoqda: "Konferensiyalar yuklanmoqda...",
    iltimosKuting: "Iltimos, kuting...",
    rasmiyElonTitle: "Rasmiy E'lon",
    rasmiyElonEmpty: "Hozircha rasmiy e'lonlar mavjud emas. Yangi e'lonlar tez orada e'lon qilinadi.",
    reklamalarTitle: "Reklamalar",
    reklamalarEmpty: "Hozircha reklamalar mavjud emas. Django serverni ishga tushiring yoki keyinroq qaytib keling.",
    asosiyBolimlar: "Asosiy bo'limlar",
    asosiyBolimlarDesc: "Ilmiy resurslar va ma'lumotlarga tezkor kirish uchun kerakli bo'limlarni tanlang",
    jurnallar: "Jurnallar",
    jurnallarDesc: "Ilmiy jurnallar va maqolalar to'plami",
    kitoblar: "Kitoblar",
    kitoblarDesc: "Akademik kitoblar va darsliklar",
    konferensiya: "Konferensiya",
    konferensiyaDesc: "Ilmiy konferensiyalar va tadbirlar",
    korish: "Ko'rish",
    nimaUchunBiz: "Nima uchun bizni tanlaysiz?",
    nimaUchunBizDesc: "Ilmiy tadqiqotlar va ta'lim sohasida eng yaxshi xizmatlarni taqdim etamiz",
    sifatliKontent: "Sifatli kontent",
    sifatliKontentDesc: "Ekspert tomonidan tekshirilgan ilmiy materiallar",
    globalKirish: "Global kirish",
    globalKirishDesc: "Istalgan joydan 24/7 kirish imkoniyati",
    hamjamiyat: "Hamjamiyat",
    hamjamiyatDesc: "Tadqiqotchilar va olimlar jamoasi",
    innovatsiya: "Innovatsiya",
    innovatsiyaDesc: "Zamonaviy texnologiyalar va yondashuvlar",
    songgiYangiliklar: "So'nggi yangiliklar",
    songgiYangiliklarDesc: "Eng muhim yangiliklar va tadbirlar haqida xabar beramiz",
    yangiliklarYuklanmoqda: "Yangiliklar yuklanmoqda...",
    yangiliklarMavjudEmas: "Yangiliklar mavjud emas",
    yangiliklarMavjudEmasDesc:
      "Hozircha yangiliklar mavjud emas. Django serverni ishga tushiring yoki keyinroq qaytib keling.",
    batafsilOqish: "Batafsil o'qish",
    obunaBolish: "Obuna bo'ling",
    obunaBolishDesc: "Eng so'nggi yangiliklar va maxsus takliflardan xabardor bo'ling",
    emailKiriting: "Email manzilingizni kiriting",
    obuna: "Obuna bo'lish",
  },
  ru: {
    rasmiyElon: "ОФИЦИАЛЬНОЕ ОБЪЯВЛЕНИЕ",
    reklama: "РЕКЛАМА",
    batafsil: "Подробнее",
    batafsilKorish: "Посмотреть подробнее",
    konferensiyaKorish: "Посмотреть конференцию",
    elonlarYuklanmoqda: "Загрузка объявлений...",
    reklamalarYuklanmoqda: "Загрузка рекламы...",
    konferensiyalarYuklanmoqda: "Загрузка конференций...",
    iltimosKuting: "Пожалуйста, подождите...",
    rasmiyElonTitle: "Официальное объявление",
    rasmiyElonEmpty:
      "На данный момент официальных объявлений нет. Новые объявления будут опубликованы в ближайшее время.",
    reklamalarTitle: "Реклама",
    reklamalarEmpty: "На данный момент рекламы нет. Запустите сервер Django или вернитесь позже.",
    asosiyBolimlar: "Основные разделы",
    asosiyBolimlarDesc: "Выберите нужные разделы для быстрого доступа к научным ресурсам и информации",
    jurnallar: "Журналы",
    jurnallarDesc: "Коллекция научных журналов и статей",
    kitoblar: "Книги",
    kitoblarDesc: "Академические книги и учебники",
    konferensiya: "Конференция",
    konferensiyaDesc: "Научные конференции и мероприятия",
    korish: "Посмотреть",
    nimaUchunBiz: "Почему выбирают нас?",
    nimaUchunBizDesc: "Мы предоставляем лучшие услуги в области научных исследований и образования",
    sifatliKontent: "Качественный контент",
    sifatliKontentDesc: "Научные материалы, проверенные экспертами",
    globalKirish: "Глобальный доступ",
    globalKirishDesc: "Доступ 24/7 из любой точки мира",
    hamjamiyat: "Сообщество",
    hamjamiyatDesc: "Сообщество исследователей и ученых",
    innovatsiya: "Инновации",
    innovatsiyaDesc: "Современные технологии и подходы",
    songgiYangiliklar: "Последние новости",
    songgiYangiliklarDesc: "Информируем о самых важных новостях и событиях",
    yangiliklarYuklanmoqda: "Загрузка новостей...",
    yangiliklarMavjudEmas: "Новостей нет",
    yangiliklarMavjudEmasDesc: "На данный момент новостей нет. Запустите сервер Django или вернитесь позже.",
    batafsilOqish: "Читать подробнее",
    obunaBolish: "Подписаться",
    obunaBolishDesc: "Будьте в курсе последних новостей и специальных предложений",
    emailKiriting: "Введите ваш email",
    obuna: "Подписаться",
  },
  en: {
    rasmiyElon: "OFFICIAL ANNOUNCEMENT",
    reklama: "ADVERTISEMENT",
    batafsil: "Details",
    batafsilKorish: "View details",
    konferensiyaKorish: "View conference",
    elonlarYuklanmoqda: "Loading announcements...",
    reklamalarYuklanmoqda: "Loading advertisements...",
    konferensiyalarYuklanmoqda: "Loading conferences...",
    iltimosKuting: "Please wait...",
    rasmiyElonTitle: "Official Announcement",
    rasmiyElonEmpty: "There are no official announcements at the moment. New announcements will be published soon.",
    reklamalarTitle: "Advertisements",
    reklamalarEmpty: "There are no advertisements at the moment. Start the Django server or come back later.",
    asosiyBolimlar: "Main Sections",
    asosiyBolimlarDesc: "Select the sections you need for quick access to scientific resources and information",
    jurnallar: "Journals",
    jurnallarDesc: "Collection of scientific journals and articles",
    kitoblar: "Books",
    kitoblarDesc: "Academic books and textbooks",
    konferensiya: "Conference",
    konferensiyaDesc: "Scientific conferences and events",
    korish: "View",
    nimaUchunBiz: "Why choose us?",
    nimaUchunBizDesc: "We provide the best services in scientific research and education",
    sifatliKontent: "Quality content",
    sifatliKontentDesc: "Scientific materials verified by experts",
    globalKirish: "Global access",
    globalKirishDesc: "24/7 access from anywhere in the world",
    hamjamiyat: "Community",
    hamjamiyatDesc: "Community of researchers and scientists",
    innovatsiya: "Innovation",
    innovatsiyaDesc: "Modern technologies and approaches",
    songgiYangiliklar: "Latest news",
    songgiYangiliklarDesc: "We inform you about the most important news and events",
    yangiliklarYuklanmoqda: "Loading news...",
    yangiliklarMavjudEmas: "No news",
    yangiliklarMavjudEmasDesc: "There is no news at the moment. Start the Django server or come back later.",
    batafsilOqish: "Read more",
    obunaBolish: "Subscribe",
    obunaBolishDesc: "Stay informed about the latest news and special offers",
    emailKiriting: "Enter your email",
    obuna: "Subscribe",
  },
}

interface HomeContentProps {
  lang: "uz" | "ru" | "en"
}

export function HomeContent({ lang }: HomeContentProps) {
  const router = useRouter()
  const t = translations[lang] || translations.uz

  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0)
  const [currentBookSlide, setCurrentBookSlide] = useState(0)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)

  const [apiData, setApiData] = useState<ApiData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  const [conferences, setConferences] = useState<Conference[]>([])
  const [conferencesLoading, setConferencesLoading] = useState(true)

  const handleReklamaDetail = (reklama: Reklama) => {
    const slugToUse = getSlugForLang(reklama, lang) || reklama.id.toString()
    router.push(`/${lang}/reklama/${slugToUse}`)
  }

  const handleRasmiyElonDetail = (rasmiyElon: RasmiyElon) => {
    const slugToUse = getSlugForLang(rasmiyElon, lang) || rasmiyElon.id.toString()
    router.push(`/${lang}/rasmiy-elon/${slugToUse}`)
  }

  useEffect(() => {
    const fetchLatestConferences = async () => {
      try {
        setConferencesLoading(true)

        const response = await fetchConferences(lang, 1)

        if (response && response.results && Array.isArray(response.results)) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const upcomingConferences = response.results.filter((conference) => {
            const conferenceDate = new Date(conference.date)
            conferenceDate.setHours(0, 0, 0, 0)
            return conferenceDate >= today
          })

          const sortedConferences = upcomingConferences.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateB.getTime() - dateA.getTime()
          })

          const latestConferences = sortedConferences.slice(0, 3)
          setConferences(latestConferences)
        } else {
          setConferences([])
        }
      } catch (error) {
        console.error("Error fetching conferences:", error)
        setConferences([])
      } finally {
        setConferencesLoading(false)
      }
    }

    fetchLatestConferences()
  }, [lang])

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(`${API_BASE}/${lang}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Accept-Language": lang,
          },
          mode: "cors",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Full API response:", data)
        console.log("[v0] Rasmiy elon object:", data.rasmiy_elon)
        console.log("[v0] All rasmiy_elon fields:", Object.keys(data.rasmiy_elon || {}))
        console.log("[v0] Rasmiy elon slug:", data.rasmiy_elon?.slug)
        console.log("[v0] Rasmiy elon name:", data.rasmiy_elon?.name)
        setApiData(data)
        setApiError(null)
      } catch (error) {
        console.error("API Error:", error)

        if (error instanceof TypeError && error.message.includes("fetch")) {
          setApiError(`Django server bilan bog'lanish xatoligi.`)
        } else {
          setApiError(error instanceof Error ? error.message : "API xatolik yuz berdi")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchApiData()
  }, [lang])

  const slides =
    conferences && conferences.length > 0
      ? conferences.map((conference) => ({
          title: conference.name,
          description:
            conference.description && conference.description.length > 100
              ? conference.description.replace(/<[^>]*>/g, "").substring(0, 100) + "..."
              : conference.description?.replace(/<[^>]*>/g, "") || "",
          image: conference.image ? `${API_BASE}${conference.image}` : "/swiper_konferensiya.jpg",
          buttonText: t.konferensiyaKorish,
          href: `/${lang}/conferences/${getSlugForLang(conference, lang)}`,
          date: conference.date,
          location: conference.manzil,
        }))
      : [
          {
            title: "Yangi ilmiy jurnallar",
            description: "2024-yilning eng so'nggi tadqiqot natijalari va ilmiy maqolalar",
            image: "/scientific-research-books-and-journals.jpg",
            buttonText: t.batafsil,
            href: `/${lang}/jurnals`,
          },
          {
            title: "Xalqaro konferensiya",
            description: "Zamonaviy texnologiyalar va innovatsiyalar bo'yicha xalqaro anjuman",
            image: "/swiper_konferensiya.jpg",
            buttonText: t.konferensiyaKorish,
            href: `/${lang}/conferences`,
          },
          {
            title: "Akademik kitoblar",
            description: "Oliy ta'lim muassasalari uchun maxsus tayyorlangan darsliklar",
            image: "/swiper_konferensiya2.jpg",
            buttonText: t.korish,
            href: `/${lang}/books`,
          },
        ]

  const adSlides = [
    {
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "/rickroll_thumbnail.jpg",
    },
    {
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "/rickroll_thumbnail.jpg",
    },
  ]

  useEffect(() => {
    if (slides && slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 4000) // Changed from 5000ms to 4000ms (4 seconds)
      return () => clearInterval(timer)
    }
  }, [slides])

  useEffect(() => {
    const videoTimer = setInterval(() => {
      setCurrentVideoSlide((prev) => (prev + 1) % adSlides.length)
    }, 4000) // Changed from 5000ms to 4000ms (4 seconds)
    return () => clearInterval(videoTimer)
  }, [adSlides])

  useEffect(() => {
    const yangiliklarLength = apiData?.yangiliklar?.length || adSlides.length
    const bookTimer = setInterval(() => {
      setCurrentBookSlide((prev) => (prev + 1) % yangiliklarLength)
    }, 4000)
    return () => clearInterval(bookTimer)
  }, [adSlides, apiData?.yangiliklar])

  const nextSlide = () => {
    if (slides && slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }
  }
  const prevSlide = () => {
    if (slides && slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }
  }

  const nextVideoSlide = () => setCurrentVideoSlide((prev) => (prev + 1) % adSlides.length)
  const prevVideoSlide = () => setCurrentVideoSlide((prev) => (prev - 1 + adSlides.length) % adSlides.length)

  const nextBookSlide = () => {
    const length = apiData?.yangiliklar?.length || 1
    setCurrentBookSlide((prev) => (prev + 1) % length)
  }
  const prevBookSlide = () => {
    const length = apiData?.yangiliklar?.length || 1
    setCurrentBookSlide((prev) => (prev - 1 + length) % length)
  }

  const sections = [
    {
      title: t.jurnallar,
      description: t.jurnallarDesc,
      icon: FileText,
      href: `/${lang}/jurnals`,
      gradient: "from-[#003D7F] to-[#0059B2]",
      iconBg: "bg-blue-100",
      iconColor: "text-[#003D7F]",
    },
    {
      title: t.kitoblar,
      description: t.kitoblarDesc,
      icon: BookOpen,
      href: `/${lang}/books`,
      gradient: "from-[#003D7F] to-[#0059B2]",
      iconBg: "bg-blue-100",
      iconColor: "text-[#003D7F]",
    },
    {
      title: t.konferensiya,
      description: t.konferensiyaDesc,
      icon: Calendar,
      href: `/${lang}/conferences`,
      gradient: "from-[#003D7F] to-[#0059B2]",
      iconBg: "bg-blue-100",
      iconColor: "text-[#003D7F]",
    },
  ]

  const handleVideoPlay = (youtubeId: string) => {
    setSelectedVideoId(youtubeId)
    setShowVideoModal(true)
  }

  const handleSubscriptionClick = (planType: string) => {
    router.push("/login")
  }

  // Helper function to get language-specific slug
  const getLangSpecificSlug = (yangilik: Yangilik, lang: "uz" | "ru" | "en"): string => {
    switch (lang) {
      case "uz":
        return yangilik.slug_uz || (yangilik.title ? createSlug(yangilik.title) : yangilik.id.toString())
      case "ru":
        return yangilik.slug_ru || (yangilik.title ? createSlug(yangilik.title) : yangilik.id.toString())
      case "en":
        return yangilik.slug_en || (yangilik.title ? createSlug(yangilik.title) : yangilik.id.toString())
      default:
        return yangilik.id.toString() // Fallback
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-6 lg:py-8 px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:h-[500px] w-full">
          {/* Chap Card - RASMIY E'LON - Mobile responsive */}
          <div className="lg:col-span-3 order-1 lg:order-1">
            <div className="h-[400px] sm:h-[450px] lg:h-[500px] bg-gradient-to-br from-white via-blue-50/50 to-indigo-100/60 backdrop-blur-xl border border-white/60 shadow-2xl rounded-t-2xl lg:rounded-l-2xl lg:rounded-t-none lg:rounded-r-none overflow-hidden relative group hover:shadow-3xl transition-all duration-500">
              {/* Enhanced modern header with responsive sizing */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#003D7F] via-[#0059B2] to-[#007ACC] backdrop-blur-md p-3 sm:p-4 z-10 shadow-lg">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-white tracking-wide">{t.rasmiyElon}</h3>
                </div>
              </div>

              {/* Enhanced content area with responsive padding */}
              <div className="pt-16 sm:pt-20 p-4 sm:p-6 h-full overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#003D7F] to-[#0059B2] rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse shadow-xl">
                        <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">{t.elonlarYuklanmoqda}</p>
                    </div>
                  </div>
                ) : apiData?.rasmiy_elon ? (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/70 hover:shadow-2xl transition-all duration-500 hover:bg-white group-inner">
                    {apiData.rasmiy_elon.media && (
                      <div className="relative mb-4 sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
                        {isVideoFile(apiData.rasmiy_elon.media) ? (
                          <video
                            src={`${API_BASE}${apiData.rasmiy_elon.media}`}
                            controls
                            className="w-full h-32 sm:h-40 object-contain p-2 sm:p-3"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={`${API_BASE}${apiData.rasmiy_elon.media}`}
                            alt={apiData.rasmiy_elon.title || "Rasmiy E'lon"}
                            className="w-full h-32 sm:h-40 object-contain p-2 sm:p-3 group-inner-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        )}
                      </div>
                    )}

                    <div className="space-y-4 sm:space-y-5">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#003D7F] to-[#0059B2] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base leading-tight mb-2 sm:mb-3">
                            {apiData.rasmiy_elon.title || t.rasmiyElonTitle}
                          </h4>
                          <div className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 sm:line-clamp-4">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: apiData.rasmiy_elon.homepage_content || apiData.rasmiy_elon.description || "",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-[#003D7F] via-[#0059B2] to-[#007ACC] hover:from-[#002B5A] hover:via-[#004494] hover:to-[#005A99] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold rounded-xl sm:rounded-2xl py-3 sm:py-4 group-button hover:scale-105 transform text-xs sm:text-sm"
                        onClick={() => handleRasmiyElonDetail(apiData.rasmiy_elon)}
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>{t.batafsil}</span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-button-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl text-center max-w-sm">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
                      </div>
                      <h4 className="font-bold text-gray-800 text-base mb-2 sm:mb-3">{t.rasmiyElonTitle}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6">{t.rasmiyElonEmpty}</p>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-xs sm:text-sm"
                        disabled
                      >
                        {t.batafsil}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* O'rta Swiper - Mobile responsive design */}
          <div className="lg:col-span-6 order-3 lg:order-2">
            <div className="relative bg-white shadow-2xl overflow-hidden border-y border-white/20 lg:border-none">
              <div className="relative h-[400px] sm:h-[450px] lg:h-[500px]">
                {conferencesLoading ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 flex items-center justify-center">
                    <div className="text-center text-slate-600 px-4">
                      <Calendar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 animate-pulse text-[#003D7F]" />
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 text-[#003D7F]">
                        {t.konferensiyalarYuklanmoqda}
                      </h2>
                      <p className="text-sm sm:text-base lg:text-lg text-slate-600">{t.iltimosKuting}</p>
                    </div>
                  </div>
                ) : (
                  slides &&
                  slides.length > 0 &&
                  slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row h-full">
                        {/* Image section - Full width on mobile, 70% on desktop */}
                        <div className="w-full lg:w-[70%] h-1/2 lg:h-full relative overflow-hidden">
                          <img
                            src={slide.image || "/placeholder.svg"}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/swiper_konferensiya.jpg"
                            }}
                          />
                          {/* Subtle overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-transparent to-blue-500/10"></div>
                        </div>

                        {/* Content section - Full width on mobile, 30% on desktop */}
                        <div className="w-full lg:w-[30%] h-1/2 lg:h-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-4 sm:p-6 flex flex-col justify-center relative overflow-hidden">
                          {/* Background pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full transform translate-x-8 sm:translate-x-10 -translate-y-8 sm:-translate-y-10"></div>
                            <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full transform -translate-x-6 sm:-translate-x-8 translate-y-6 sm:translate-y-8"></div>
                          </div>

                          <div className="relative z-10">
                            <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 text-white leading-tight">
                              {slide.title}
                            </h2>
                            <p className="text-xs sm:text-sm mb-3 sm:mb-4 lg:mb-6 text-white/95 leading-relaxed line-clamp-2 lg:line-clamp-none">
                              {slide.description}
                            </p>

                            {slide.date && (
                              <div className="flex flex-col gap-1 sm:gap-2 mb-3 sm:mb-4 lg:mb-6">
                                <div className="flex items-center gap-2 text-white/90">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="text-xs sm:text-sm font-medium">
                                    {new Date(slide.date).toLocaleDateString("uz-UZ")}
                                  </span>
                                </div>
                                {slide.location && (
                                  <div className="flex items-center gap-2 text-white/90">
                                    <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium line-clamp-1">
                                      {slide.location}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="space-y-4">
                              <Button
                                size="sm"
                                asChild
                                className="w-full bg-white hover:bg-gray-100 text-blue-600 hover:text-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:scale-105 transform text-xs sm:text-sm"
                              >
                                <Link href={slide.href} className="flex items-center justify-center gap-2">
                                  {slide.buttonText}
                                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Navigation buttons - Responsive positioning */}
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md text-blue-600 p-2 sm:p-3 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg border border-white/30"
                disabled={conferencesLoading}
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md text-blue-600 p-2 sm:p-3 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg border border-white/30"
                disabled={conferencesLoading}
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              {/* Dots indicator - Responsive sizing */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2">
                {slides &&
                  slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 border border-white/50 ${
                        index === currentSlide
                          ? "bg-white scale-125 shadow-md"
                          : "bg-white/60 hover:bg-white/80 hover:scale-110"
                      }`}
                      disabled={conferencesLoading}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* O'ng Card - REKLAMA - Mobile responsive */}
          <div className="lg:col-span-3 order-2 lg:order-3">
            <div className="h-[400px] sm:h-[450px] lg:h-[500px] bg-gradient-to-br from-white via-blue-50/50 to-indigo-100/60 backdrop-blur-xl border border-white/60 shadow-2xl rounded-b-2xl lg:rounded-r-2xl lg:rounded-b-none lg:rounded-l-none overflow-hidden relative group hover:shadow-3xl transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#003D7F] via-[#0059B2] to-[#007ACC] backdrop-blur-md p-3 sm:p-4 z-10 shadow-lg">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-white tracking-wide">{t.reklama}</h3>
                </div>
              </div>

              {/* Enhanced content area with responsive padding */}
              <div className="pt-16 sm:pt-20 p-4 sm:p-6 h-full overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#003D7F] to-[#0059B2] rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse shadow-xl">
                        <Megaphone className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">{t.reklamalarYuklanmoqda}</p>
                    </div>
                  </div>
                ) : apiData?.reklama && apiData.reklama.length > 0 ? (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/70 hover:shadow-2xl transition-all duration-500 hover:bg-white group-inner">
                    {apiData.reklama[0].media && (
                      <div className="relative mb-4 sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
                        {isVideoFile(apiData.reklama[0].media) ? (
                          <video
                            src={`${API_BASE}${apiData.reklama[0].media}`}
                            controls
                            className="w-full h-32 sm:h-40 object-contain p-2 sm:p-3"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={`${API_BASE}${apiData.reklama[0].media}`}
                            alt={apiData.reklama[0].title}
                            className="w-full h-32 sm:h-40 object-contain p-2 sm:p-3 group-inner-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                            }}
                          />
                        )}
                      </div>
                    )}

                    <div className="space-y-4 sm:space-y-5">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#003D7F] to-[#0059B2] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base leading-tight mb-2 sm:mb-3 line-clamp-2">
                            {apiData.reklama[0].title}
                          </h4>
                          <div className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 sm:line-clamp-4">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: apiData.reklama[0].homepage_content || apiData.reklama[0].description || "",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-[#003D7F] via-[#0059B2] to-[#007ACC] hover:from-[#002B5A] hover:via-[#004494] hover:to-[#005A99] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold rounded-xl sm:rounded-2xl py-3 sm:py-4 group-button hover:scale-105 transform text-xs sm:text-sm"
                        onClick={() => handleReklamaDetail(apiData.reklama[0])}
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>{t.batafsilKorish}</span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-button-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl text-center max-w-sm">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Megaphone className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
                      </div>
                      <h4 className="font-bold text-gray-800 text-base mb-2 sm:mb-3">{t.reklamalarTitle}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6">{t.reklamalarEmpty}</p>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-xs sm:text-sm"
                        disabled
                      >
                        {t.batafsilKorish}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asosiy bo'limlar section - Hidden on mobile */}
      <section className="py-8 sm:py-12 lg:py-16 hidden lg:block">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              {t.asosiyBolimlar}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">{t.asosiyBolimlarDesc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Card
                  key={section.title}
                  className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white"
                >
                  {/* Gradient background overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6 lg:p-8 relative z-10">
                    <div
                      className={`mx-auto mb-3 sm:mb-4 lg:mb-6 p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-3xl ${section.iconBg} group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                    >
                      <Icon className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 ${section.iconColor}`} />
                    </div>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center p-4 sm:p-6 lg:p-8 pt-0 relative z-10">
                    <Button
                      asChild
                      className={`w-full bg-gradient-to-r ${section.gradient} hover:shadow-xl text-white border-0 font-semibold text-sm sm:text-base py-5 sm:py-6 lg:py-7 rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105`}
                    >
                      <Link href={section.href} className="flex items-center justify-center gap-2">
                        {t.korish}
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">{t.nimaUchunBiz}</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">{t.nimaUchunBizDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-lg bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl order-4 sm:order-none">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#003D7F] to-[#0059B2] rounded-full flex items-center justify-center shadow-lg">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{t.sifatliKontent}</h3>
              <p className="text-sm sm:text-base text-gray-600">{t.sifatliKontentDesc}</p>
            </div>

            <div className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-lg bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl order-5 sm:order-none">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#003D7F] to-[#0059B2] rounded-full flex items-center justify-center shadow-lg">
                <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{t.globalKirish}</h3>
              <p className="text-sm sm:text-base text-gray-600">{t.globalKirishDesc}</p>
            </div>

            <div className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-lg bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl order-6 sm:order-none">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#003D7F] to-[#0059B2] rounded-full flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 sm:h-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{t.hamjamiyat}</h3>
              <p className="text-sm sm:text-base text-gray-600">{t.hamjamiyatDesc}</p>
            </div>

            <div className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-lg bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl order-7 sm:order-none">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#003D7F] to-[#0059B2] rounded-full flex items-center justify-center shadow-lg">
                <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{t.innovatsiya}</h3>
              <p className="text-sm sm:text-base text-gray-600">{t.innovatsiyaDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 order-8 sm:order-none">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-slate-800">
              {t.songgiYangiliklar}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto px-4">{t.songgiYangiliklarDesc}</p>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-xl max-w-md mx-auto">
                  <Bell className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4 sm:mb-6" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4">
                    {t.yangiliklarYuklanmoqda}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{t.iltimosKuting}</p>
                </div>
              </div>
            ) : apiData?.yangiliklar && apiData.yangiliklar.length > 0 ? (
              <>
                <div className="relative overflow-hidden h-[500px] sm:h-[600px] lg:h-[650px]">
                  <div className="flex items-center justify-center h-full">
                    {/* Mobile: Single card layout, Desktop: Three card layout */}
                    <div className="block lg:hidden w-full max-w-sm mx-auto">
                      <Card className="h-[450px] overflow-hidden shadow-2xl bg-white border-0 rounded-3xl group hover:shadow-3xl transition-all duration-500">
                        <CardContent className="p-0 h-full flex flex-col">
                          {apiData.yangiliklar[currentBookSlide]?.media && (
                            <div className="relative h-1/2 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                              <img
                                src={`${API_BASE}${apiData.yangiliklar[currentBookSlide].media}`}
                                alt={apiData.yangiliklar[currentBookSlide]?.title || "Yangilik"}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement
                                  target.style.display = "none"
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.classList.add("bg-gradient-to-br", "from-[#003D7F]", "to-[#0059B2]")
                                    parent.innerHTML = `
                                      <div class="flex items-center justify-center h-full">
                                        <div class="text-center text-white p-6">
                                          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                          </div>
                                          <p class="text-base font-semibold">Yangilik rasmi</p>
                                        </div>
                                      </div>
                                    `
                                  }
                                }}
                              />
                            </div>
                          )}

                          <div className="h-1/2 p-6 flex flex-col justify-between bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
                            <div>
                              <h3 className="text-lg font-bold mb-3 text-gray-800 leading-tight line-clamp-2">
                                {apiData.yangiliklar[currentBookSlide]?.title || "Yangilik"}
                              </h3>
                              <div className="text-gray-600 mb-4 leading-relaxed line-clamp-3 text-sm">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: apiData.yangiliklar[currentBookSlide]?.description || "",
                                  }}
                                />
                              </div>
                            </div>

                            <div className="flex justify-center">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-[#003D7F] via-[#0059B2] to-[#007ACC] hover:from-[#002B5A] hover:via-[#004494] hover:to-[#005A99] text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold px-6 py-3 rounded-full hover:scale-105 transform group text-sm"
                                onClick={() => {
                                  const yangilik = apiData.yangiliklar[currentBookSlide]
                                  const slugToUse =
                                    getLangSpecificSlug(yangilik, lang) || yangilik?.id?.toString() || "1"
                                  router.push(`/${lang}/yangiliklar/${slugToUse}`)
                                }}
                              >
                                <span className="flex items-center gap-2">
                                  {t.batafsilOqish}
                                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Desktop: Three card layout */}
                    <div className="hidden lg:flex items-center justify-center h-full w-full">
                      {/* Left slide (previous) */}
                      <div className="absolute left-0 w-1/4 h-[520px] z-10 opacity-70 transform scale-95 transition-all duration-500">
                        {apiData.yangiliklar.length > 1 && (
                          <Card className="h-full overflow-hidden shadow-xl bg-white/95 backdrop-blur-sm border-0 rounded-3xl">
                            <CardContent className="p-0 h-full flex flex-col">
                              {apiData.yangiliklar[
                                (currentBookSlide - 1 + apiData.yangiliklar.length) % apiData.yangiliklar.length
                              ]?.media && (
                                <div className="relative h-2/3 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                  <img
                                    src={`${API_BASE}${apiData.yangiliklar[(currentBookSlide - 1 + apiData.yangiliklar.length) % apiData.yangiliklar.length].media}`}
                                    alt={
                                      apiData.yangiliklar[
                                        (currentBookSlide - 1 + apiData.yangiliklar.length) % apiData.yangiliklar.length
                                      ]?.title || "Yangilik"
                                    }
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                              <div className="p-4 flex-1 flex flex-col justify-center">
                                <h3 className="text-base font-bold text-gray-800 line-clamp-2 text-center leading-tight">
                                  {apiData.yangiliklar[
                                    (currentBookSlide - 1 + apiData.yangiliklar.length) % apiData.yangiliklar.length
                                  ]?.title || "Yangilik"}
                                </h3>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Main slide (current) */}
                      <div className="w-1/2 h-[600px] z-20 transform scale-100 transition-all duration-500">
                        <Card className="h-full overflow-hidden shadow-2xl bg-white border-0 rounded-3xl group hover:shadow-3xl transition-all duration-500">
                          <CardContent className="p-0 h-full flex flex-col">
                            {apiData.yangiliklar[currentBookSlide]?.media && (
                              <div className="relative h-2/3 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                <img
                                  src={`${API_BASE}${apiData.yangiliklar[currentBookSlide].media}`}
                                  alt={apiData.yangiliklar[currentBookSlide]?.title || "Yangilik"}
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement
                                    target.style.display = "none"
                                    const parent = target.parentElement
                                    if (parent) {
                                      parent.classList.add("bg-gradient-to-br", "from-[#003D7F]", "to-[#0059B2]")
                                      parent.innerHTML = `
                                        <div class="flex items-center justify-center h-full">
                                          <div class="text-center text-white p-8">
                                            <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                              <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                            <p class="text-lg font-semibold">Yangilik rasmi</p>
                                          </div>
                                        </div>
                                      `
                                    }
                                  }}
                                />
                              </div>
                            )}

                            <div className="h-1/3 p-8 flex flex-col justify-between bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
                              <div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-800 leading-tight line-clamp-2">
                                  {apiData.yangiliklar[currentBookSlide]?.title || "Yangilik"}
                                </h3>
                                <div className="text-gray-600 leading-relaxed line-clamp-2 text-base">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: apiData.yangiliklar[currentBookSlide]?.description || "",
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="flex justify-center mt-4">
                                <Button
                                  size="lg"
                                  className="bg-gradient-to-r from-[#003D7F] via-[#0059B2] to-[#007ACC] hover:from-[#002B5A] hover:via-[#004494] hover:to-[#005A99] text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold px-10 py-4 rounded-full hover:scale-105 transform group"
                                  onClick={() => {
                                    const yangilik = apiData.yangiliklar[currentBookSlide]
                                    const slugToUse =
                                      getLangSpecificSlug(yangilik, lang) || yangilik?.id?.toString() || "1"
                                    router.push(`/${lang}/yangiliklar/${slugToUse}`)
                                  }}
                                >
                                  <span className="flex items-center gap-3 text-lg">
                                    {t.batafsilOqish}
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Right slide (next) */}
                      <div className="absolute right-0 w-1/4 h-[520px] z-10 opacity-70 transform scale-95 transition-all duration-500">
                        {apiData.yangiliklar.length > 1 && (
                          <Card className="h-full overflow-hidden shadow-xl bg-white/95 backdrop-blur-sm border-0 rounded-3xl">
                            <CardContent className="p-0 h-full flex flex-col">
                              {apiData.yangiliklar[(currentBookSlide + 1) % apiData.yangiliklar.length]?.media && (
                                <div className="relative h-2/3 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                  <img
                                    src={`${API_BASE}${apiData.yangiliklar[(currentBookSlide + 1) % apiData.yangiliklar.length].media}`}
                                    alt={
                                      apiData.yangiliklar[(currentBookSlide + 1) % apiData.yangiliklar.length]?.title ||
                                      "Yangilik"
                                    }
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                              <div className="p-4 flex-1 flex flex-col justify-center">
                                <h3 className="text-base font-bold text-gray-800 line-clamp-2 text-center leading-tight">
                                  {apiData.yangiliklar[(currentBookSlide + 1) % apiData.yangiliklar.length]?.title ||
                                    "Yangilik"}
                                </h3>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {apiData.yangiliklar.length > 1 && (
                  <>
                    <button
                      onClick={prevBookSlide}
                      className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md text-[#003D7F] p-3 sm:p-4 lg:p-5 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-2xl z-30 border border-white/50 hover:border-[#003D7F]/20 hover:shadow-3xl"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                    </button>
                    <button
                      onClick={nextBookSlide}
                      className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md text-[#003D7F] p-3 sm:p-4 lg:p-5 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-2xl z-30 border border-white/50 hover:border-[#003D7F]/20 hover:shadow-3xl"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                    </button>

                    <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 lg:space-x-4 z-30">
                      {apiData.yangiliklar.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentBookSlide(index)}
                          className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full transition-all duration-300 border-2 ${
                            index === currentBookSlide
                              ? "bg-[#003D7F] border-[#003D7F] scale-125 shadow-lg"
                              : "bg-white border-gray-300 hover:bg-gray-100 hover:border-[#003D7F]/50 hover:scale-110"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl max-w-md mx-auto">
                  <Bell className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">{t.yangiliklarMavjudEmas}</h3>
                  <p className="text-gray-500 leading-relaxed">{t.yangiliklarMavjudEmasDesc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscription section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-[#003D7F] to-[#0059B2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-white">{t.obunaBolish}</h2>
            <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto px-4">{t.obunaBolishDesc}</p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <input
                type="email"
                placeholder={t.emailKiriting}
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50 outline-none text-sm sm:text-base"
              />
              <Button
                onClick={() => handleSubscriptionClick("basic")} // Added a dummy parameter for planType as it's not used in the redirected route
                className="bg-white text-[#003D7F] hover:bg-gray-100 px-6 py-3 font-semibold text-sm sm:text-base whitespace-nowrap"
              >
                {t.obuna}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

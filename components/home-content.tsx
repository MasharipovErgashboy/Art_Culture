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
  Clock,
  CalendarDays,
  CalendarRange,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchConferences, fetchBooks, fetchJournals, type Conference, getSlugForLang } from "@/lib/api"
import Navbar from "@/components/navbar" // Changed to default import
import Footer from "@/components/footer"

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
  // Assuming subscriptions are also fetched from the API
  subscriptions?: {
    id: number
    name: string
    price: string
    duration_days: number
    books_count: number
    journals_count: number
    conferences_count: number
  }[]
}

const API_BASE = "https://artculture.pythonanywhere.com"

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
    konferensiyaKorish: "Batafsil",
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
    kunlikObuna: "1 kunlik obuna",
    haftalikObuna: "1 haftalik obuna",
    oylikObuna: "1 oylik obuna",
    kunlikDesc: "Barcha resurslarga 1 kunlik kirish",
    haftalikDesc: "Barcha resurslarga 1 haftalik kirish",
    oylikDesc: "Barcha resurslarga 1 oylik kirish",
    som: "so'm",
    tanlash: "Tanlash",
  },
  ru: {
    rasmiyElon: "ОФИЦИАЛЬНОЕ ОБЪЯВЛЕНИЕ",
    reklama: "РЕКЛАМА",
    batafsil: "Подробнее",
    batafsilKorish: "Посмотреть подробнее",
    konferensiyaKorish: "Подробнее",
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
    kunlikObuna: "1-дневная подписка",
    haftalikObuna: "1-недельная подписка",
    oylikObuna: "1-месячная подписка",
    kunlikDesc: "Доступ ко всем ресурсам на 1 день",
    haftalikDesc: "Доступ ко всем ресурсам на 1 неделю",
    oylikDesc: "Доступ ко всем ресурсам на 1 месяц",
    som: "сум",
    tanlash: "Выбрать",
  },
  en: {
    rasmiyElon: "OFFICIAL ANNOUNCEMENT",
    reklama: "ADVERTISEMENT",
    batafsil: "Details",
    batafsilKorish: "View details",
    konferensiyaKorish: "Details",
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
    kunlikObuna: "1-day subscription",
    haftalikObuna: "1-week subscription",
    oylikObuna: "1-month subscription",
    kunlikDesc: "Access to all resources for 1 day",
    haftalikDesc: "Access to all resources for 1 week",
    oylikDesc: "Access to all resources for 1 month",
    som: "sum",
    tanlash: "Choose",
  },
}

interface HomeContentProps {
  lang: "uz" | "ru" | "en"
}

export function HomeContent({ lang }: HomeContentProps) {
  console.log("[v0] HomeContent rendering, lang:", lang)

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

  const [latestContent, setLatestContent] = useState<
    Array<{
      type: "book" | "journal" | "conference"
      title: string
      description: string
      image: string
      href: string
      date?: string
    }>
  >([])
  const [latestContentLoading, setLatestContentLoading] = useState(true)

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

        let allConferences: Conference[] = []
        let currentPage = 1
        let hasMore = true

        while (hasMore) {
          const response = await fetchConferences(lang, currentPage)
          console.log(`[v0] Fetched conferences page ${currentPage}:`, response)

          if (response && response.results && Array.isArray(response.results)) {
            allConferences = [...allConferences, ...response.results]
          }

          hasMore = response.next !== null
          currentPage++
        }

        console.log("[v0] Total conferences for swiper:", allConferences.length)

        if (allConferences.length > 0) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const upcomingConferences = allConferences.filter((conference) => {
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
          console.log("[v0] Latest upcoming conferences for swiper:", latestConferences.length)
          setConferences(latestConferences)
        } else {
          setConferences([])
        }
      } catch (error) {
        console.error("[v0] Error fetching conferences:", error)
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

  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        setLatestContentLoading(true)
        console.log("[v0] ========== FETCHING LATEST CONTENT FOR SWIPER ==========")

        const content: Array<{
          type: "book" | "journal" | "conference"
          title: string
          description: string
          image: string
          href: string
          date?: string
        }> = []

        try {
          console.log("[v0] Fetching latest book from books-category...")
          const booksResponse = await fetchBooks(lang, 1)
          console.log("[v0] Books API response:", booksResponse)
          console.log("[v0] Books results:", booksResponse?.results)

          if (booksResponse?.results && Array.isArray(booksResponse.results) && booksResponse.results.length > 0) {
            const book = booksResponse.results[0]
            console.log("[v0] Latest book selected:", book)
            console.log("[v0] Book name:", book.name)
            console.log("[v0] Book image:", book.image)
            console.log("[v0] Book slug:", getSlugForLang(book, lang))

            content.push({
              type: "book",
              title: book.name || "Kitob",
              description: book.description || "Kitob haqida ma'lumot",
              image: book.image ? `${API_BASE}${book.image}` : "/placeholder.svg",
              href: `/${lang}/books/${getSlugForLang(book, lang)}`,
            })
            console.log("[v0] ✓ Book added to content successfully")
          } else {
            console.log("[v0] ✗ No books found in API response")
          }
        } catch (err) {
          console.error("[v0] ✗ Error fetching books for swiper:", err)
        }

        try {
          console.log("[v0] Fetching latest journal...")
          const journalsResponse = await fetchJournals(lang)
          console.log("[v0] Journals response:", journalsResponse)

          // Handle both array and paginated response formats
          const journals = Array.isArray(journalsResponse) ? journalsResponse : journalsResponse?.results || []

          if (journals.length > 0) {
            const journal = journals[0] // Get the first (latest) journal
            console.log("[v0] Latest journal selected:", journal)
            content.push({
              type: "journal",
              title: journal.name || "Jurnal",
              description:
                journal.description?.replace(/<[^>]*>/g, "").substring(0, 150) + "..." || "Jurnal haqida ma'lumot",
              image: journal.image ? `${API_BASE}${journal.image}` : "/placeholder.svg",
              href: `/${lang}/journals/${getSlugForLang(journal, lang)}`,
            })
            console.log("[v0] Journal added to content")
          } else {
            console.log("[v0] No journals found")
          }
        } catch (err) {
          console.error("[v0] Error fetching journals for swiper:", err)
        }

        try {
          console.log("[v0] Fetching latest upcoming conference...")
          const conferencesResponse = await fetchConferences(lang, 1) // Get first page
          console.log("[v0] Conferences response:", conferencesResponse)

          if (conferencesResponse?.results && conferencesResponse.results.length > 0) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const upcomingConferences = conferencesResponse.results.filter((conf) => {
              const confDate = new Date(conf.date)
              confDate.setHours(0, 0, 0, 0)
              return confDate >= today
            })

            console.log("[v0] Upcoming conferences:", upcomingConferences.length)

            if (upcomingConferences.length > 0) {
              const conference = upcomingConferences[0] // Get the first (latest) upcoming conference
              console.log("[v0] Latest upcoming conference selected:", conference)
              content.push({
                type: "conference",
                title: conference.name || "Konferensiya",
                description:
                  conference.description?.replace(/<[^>]*>/g, "").substring(0, 150) + "..." ||
                  "Konferensiya haqida ma'lumot",
                image: conference.image ? `${API_BASE}${conference.image}` : "/placeholder.svg",
                href: `/${lang}/conferences/${getSlugForLang(conference, lang)}`,
                date: conference.date,
              })
              console.log("[v0] Conference added to content")
            } else {
              console.log("[v0] No upcoming conferences found")
            }
          }
        } catch (err) {
          console.error("[v0] Error fetching conferences for swiper:", err)
        }

        console.log("[v0] Final content array:", content.length, "items")
        console.log(
          "[v0] Content items:",
          content.map((c) => ({ type: c.type, title: c.title })),
        )
        setLatestContent(content)
        console.log("[v0] ========== LATEST CONTENT FETCH COMPLETE ==========")
      } catch (error) {
        console.error("[v0] ========== ERROR FETCHING LATEST CONTENT ==========")
        console.error("[v0] Error:", error)
        setLatestContent([])
      } finally {
        setLatestContentLoading(false)
      }
    }

    fetchLatestContent()
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
      : [] // Return empty array instead of demo slides when no conferences

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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000) // Changed from 5000ms to 4000ms (4 seconds)
    return () => clearInterval(timer)
  }, [slides])

  useEffect(() => {
    const videoTimer = setInterval(() => {
      setCurrentVideoSlide((prev) => (prev + 1) % adSlides.length)
    }, 4000) // Changed from 5000ms to 4000ms (4 seconds)
    return () => clearInterval(videoTimer)
  }, [adSlides])

  useEffect(() => {
    if (latestContent.length > 1) {
      const bookTimer = setInterval(() => {
        setCurrentBookSlide((prev) => (prev + 1) % latestContent.length)
      }, 4000) // 4 seconds per slide
      return () => clearInterval(bookTimer)
    }
  }, [latestContent])

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
    if (latestContent.length > 0) {
      setCurrentBookSlide((prev) => (prev + 1) % latestContent.length)
    }
  }
  const prevBookSlide = () => {
    if (latestContent.length > 0) {
      setCurrentBookSlide((prev) => (prev - 1 + latestContent.length) % latestContent.length)
    }
  }

  const sections = [
    {
      title: t.jurnallar,
      description: t.jurnallarDesc,
      icon: FileText,
      href: `/${lang}/journals`,
      gradient: "from-[#003D7F] to-[#0059B2]",
      iconBg: "bg-blue-100",
      iconColor: "text-[#003D7F]",
    },
    {
      title: t.kitoblar,
      description: t.kitoblarDesc,
      icon: BookOpen,
      href: `/${lang}/books-category`,
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

  const handleSubscriptionClick = async (planId: number) => {
    router.push(`/${lang}/subscription/${planId}`)
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

  // Map API subscriptions to display format with icons based on duration
  const getSubscriptionIcon = (durationDays: number) => {
    if (durationDays <= 1) return Clock
    if (durationDays <= 7) return CalendarDays
    return CalendarRange
  }

  const getSubscriptionGradient = (index: number) => {
    const gradients = ["from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-orange-500 to-red-500"]
    return gradients[index % gradients.length]
  }

  const subscriptionPlans = apiData?.subscriptions
    ? apiData.subscriptions.map((sub) => ({
        id: sub.id,
        title: sub.name,
        description: `${sub.books_count} ${t.kitoblar}, ${sub.journals_count} ${t.jurnallar}, ${sub.conferences_count} ${t.konferensiya}`,
        price: Number.parseFloat(sub.price).toLocaleString("uz-UZ"),
        duration: sub.duration_days.toString(),
        icon: getSubscriptionIcon(sub.duration_days),
        gradient: getSubscriptionGradient(apiData.subscriptions.findIndex((s) => s.id === sub.id)), // Ensure correct gradient mapping
      }))
    : []

  return (
    <>

      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                {t.asosiyBolimlarDesc}
              </p>
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
                  <Globe className="h-6 w-6 sm:h-8 sm:h-8 text-white" />
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
              {latestContentLoading ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-xl max-w-md mx-auto">
                    <Bell className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4 sm:mb-6 animate-pulse" />
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4">
                      {t.yangiliklarYuklanmoqda}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{t.iltimosKuting}</p>
                  </div>
                </div>
              ) : latestContent && latestContent.length > 0 ? (
                <>
                  <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] lg:min-h-[700px]">
                    <div className="flex items-center justify-center h-full">
                      {/* Mobile: Single elegant card with full content */}
                      <div className="block lg:hidden w-full max-w-md mx-auto px-4">
                        <Card className="overflow-hidden shadow-2xl bg-white border-0 rounded-3xl group hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
                          <CardContent className="p-0 flex flex-col">
                            {/* Image section with elegant gradient */}
                            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                              <img
                                src={latestContent[currentBookSlide]?.image || "/placeholder.svg"}
                                alt={latestContent[currentBookSlide]?.title || "Content"}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg"
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                              {/* Type badge with refined styling */}
                              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-xl border border-white/50">
                                <span className="text-xs font-bold text-[#003D7F] uppercase tracking-wider">
                                  {latestContent[currentBookSlide]?.type === "book" && "📚 Kitob"}
                                  {latestContent[currentBookSlide]?.type === "journal" && "📰 Jurnal"}
                                  {latestContent[currentBookSlide]?.type === "conference" && "🎯 Konferensiya"}
                                </span>
                              </div>
                            </div>

                            {/* Content section with full visibility */}
                            <div className="p-6 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40">
                              <h3 className="text-xl font-bold mb-4 text-gray-900 leading-tight group-hover:text-[#003D7F] transition-colors duration-300">
                                {latestContent[currentBookSlide]?.title || "Content"}
                              </h3>
                              <div className="text-gray-600 mb-6 leading-relaxed text-sm max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                {latestContent[currentBookSlide]?.description || ""}
                              </div>

                              <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-[#003D7F] via-[#0059B2] to-[#007ACC] hover:from-[#002B5A] hover:via-[#004494] hover:to-[#005A99] text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold px-6 py-3.5 rounded-full hover:scale-105 transform group text-sm"
                                onClick={() => {
                                  router.push(latestContent[currentBookSlide]?.href || `/${lang}`)
                                }}
                              >
                                <span className="flex items-center justify-center gap-2">
                                  {t.batafsilOqish}
                                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Desktop: Three elegant cards with full content */}
                      <div className="hidden lg:flex items-center justify-center h-full w-full gap-6">
                        {/* Left preview card */}
                        <div className="w-1/4 opacity-70 transform scale-95 transition-all duration-500 hover:opacity-90 hover:scale-100">
                          {latestContent.length > 1 && (
                            <Card className="overflow-hidden shadow-xl bg-white/95 backdrop-blur-sm border-0 rounded-3xl h-[580px]">
                              <CardContent className="p-0 h-full flex flex-col">
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                  <img
                                    src={
                                      latestContent[
                                        (currentBookSlide - 1 + latestContent.length) % latestContent.length
                                      ]?.image || "/placeholder.svg"
                                    }
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-center bg-gradient-to-br from-white to-blue-50/20">
                                  <h3 className="text-base font-bold text-gray-800 text-center leading-tight mb-2">
                                    {latestContent[(currentBookSlide - 1 + latestContent.length) % latestContent.length]
                                      ?.title || "Content"}
                                  </h3>
                                  <p className="text-xs text-gray-600 text-center">
                                    {latestContent[(currentBookSlide - 1 + latestContent.length) % latestContent.length]
                                      ?.type === "book" && "📚 Kitob"}
                                    {latestContent[(currentBookSlide - 1 + latestContent.length) % latestContent.length]
                                      ?.type === "journal" && "📰 Jurnal"}
                                    {latestContent[(currentBookSlide - 1 + latestContent.length) % latestContent.length]
                                      ?.type === "conference" && "🎯 Konferensiya"}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>

                        {/* Main featured card with full content */}
                        <div className="w-1/2 transform scale-100 transition-all duration-500">
                          <Card className="overflow-hidden shadow-2xl bg-white border-0 rounded-3xl group hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] h-[650px]">
                            <CardContent className="p-0 h-full flex flex-col">
                              {/* Image section */}
                              <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                <img
                                  src={latestContent[currentBookSlide]?.image || "/placeholder.svg"}
                                  alt={latestContent[currentBookSlide]?.title || "Content"}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg"
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                {/* Type badge */}
                                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-white/50">
                                  <span className="text-sm font-bold text-[#003D7F] uppercase tracking-wider">
                                    {latestContent[currentBookSlide]?.type === "book" && "📚 Kitob"}
                                    {latestContent[currentBookSlide]?.type === "journal" && "📰 Jurnal"}
                                    {latestContent[currentBookSlide]?.type === "conference" && "🎯 Konferensiya"}
                                  </span>
                                </div>
                              </div>

                              {/* Content section with full visibility and scrolling */}
                              <div className="flex-1 p-8 flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 overflow-hidden">
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 leading-tight group-hover:text-[#003D7F] transition-colors duration-300">
                                  {latestContent[currentBookSlide]?.title || "Content"}
                                </h3>
                                <div className="text-gray-600 leading-relaxed text-base mb-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                  {latestContent[currentBookSlide]?.description || ""}
                                </div>

                                <Button
                                  size="lg"
                                  className="w-full bg-gradient-to-r from-[#003D7F] via-[#0059B2] to-[#007ACC] hover:from-[#002B5A] hover:via-[#004494] hover:to-[#005A99] text-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold px-10 py-4 rounded-full hover:scale-105 transform group"
                                  onClick={() => {
                                    router.push(latestContent[currentBookSlide]?.href || `/${lang}`)
                                  }}
                                >
                                  <span className="flex items-center justify-center gap-3 text-lg">
                                    {t.batafsilOqish}
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                  </span>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Right preview card */}
                        <div className="w-1/4 opacity-70 transform scale-95 transition-all duration-500 hover:opacity-90 hover:scale-100">
                          {latestContent.length > 1 && (
                            <Card className="overflow-hidden shadow-xl bg-white/95 backdrop-blur-sm border-0 rounded-3xl h-[580px]">
                              <CardContent className="p-0 h-full flex flex-col">
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                  <img
                                    src={
                                      latestContent[(currentBookSlide + 1) % latestContent.length]?.image ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-center bg-gradient-to-br from-white to-blue-50/20">
                                  <h3 className="text-base font-bold text-gray-800 text-center leading-tight mb-2">
                                    {latestContent[(currentBookSlide + 1) % latestContent.length]?.title || "Content"}
                                  </h3>
                                  <p className="text-xs text-gray-600 text-center">
                                    {latestContent[(currentBookSlide + 1) % latestContent.length]?.type === "book" &&
                                      "📚 Kitob"}
                                    {latestContent[(currentBookSlide + 1) % latestContent.length]?.type === "journal" &&
                                      "📰 Jurnal"}
                                    {latestContent[(currentBookSlide + 1) % latestContent.length]?.type ===
                                      "conference" && "🎯 Konferensiya"}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation controls with elegant styling */}
                  {latestContent.length > 1 && (
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

                      {/* Elegant pagination dots */}
                      <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 lg:space-x-4 z-30">
                        {latestContent.map((_, index) => (
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

        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-slate-800">{t.obunaBolish}</h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto px-4">{t.obunaBolishDesc}</p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-auto">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t.iltimosKuting}</p>
                </div>
              </div>
            ) : subscriptionPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {subscriptionPlans.map((plan) => {
                  const Icon = plan.icon
                  return (
                    <Card
                      key={plan.id}
                      className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white cursor-pointer"
                      onClick={() => handleSubscriptionClick(plan.id)}
                    >
                      {/* Gradient background overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      ></div>

                      <CardHeader className="text-center pb-3 sm:pb-4 p-4 sm:p-6 lg:p-8 relative z-10">
                        <div className="mx-auto mb-3 sm:mb-4 lg:mb-6 p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                          <Icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-[#003D7F]" />
                        </div>
                        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
                          {plan.title}
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                          {plan.description}
                        </CardDescription>
                        <div className="text-3xl sm:text-4xl font-bold text-[#003D7F] mb-2">
                          {plan.price} <span className="text-lg sm:text-xl font-normal text-gray-600">{t.som}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="text-center p-4 sm:p-6 lg:p-8 pt-0 relative z-10">
                        <Button
                          className="w-full bg-gradient-to-r from-[#003D7F] via-[#0059B2] to-[#007ACC] hover:shadow-xl text-white border-0 font-semibold text-sm sm:text-base py-5 sm:py-6 lg:py-7 rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSubscriptionClick(plan.id)
                          }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {t.tanlash}
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md mx-auto">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Obunalar mavjud emas</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default HomeContent
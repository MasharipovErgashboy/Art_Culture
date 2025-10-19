"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchConferences, getSlugForLang, type Conference } from "@/lib/api"
import { Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"

const API_BASE = "https://artculture.pythonanywhere.com"

const translations = {
  uz: {
    pageTitle: "Konferensiyalar",
    pageDescription:
      "Ilmiy konferensiyalar va tadbirlar haqida ma'lumotlar. Eng so'nggi tadbirlar va ularning natijalari.",
    loading: "Konferensiyalar yuklanmoqda...",
    apiError: "API xatolik:",
    staticDataShown: "Statik ma'lumotlar ko'rsatilmoqda",
    upcomingTab: "Kelayotgan tadbirlar",
    pastTab: "O'tgan tadbirlar",
    noUpcoming: "Kelayotgan konferensiyalar mavjud emas",
    noUpcomingDesc: "Tez orada yangi konferensiyalar qo'shiladi.",
    noPast: "O'tgan konferensiyalar mavjud emas",
    noPastDesc: "Hozircha o'tgan tadbirlar ro'yxati bo'sh.",
    international: "Xalqaro",
    registrationOpen: "Ro'yxatdan o'tish ochiq",
    completed: "Yakunlangan",
    detailsButton: "Batafsil ma'lumot",
    viewButton: "Ko'rish",
    materialsButton: "Materiallar",
    sidebarTitle: "Konferensiya ma'lumotlari",
    upcomingConferences: "Kelayotgan konferensiyalar",
    pastConferences: "O'tgan konferensiyalar",
    detailsShort: "Batafsil",
    organizeTitle: "Tadbir tashkil qilish",
    organizeDesc: "O'zingizning konferensiyangizni tashkil qiling va ilmiy hamjamiyat bilan bo'lishing.",
    submitProposal: "Taklif yuborish",
    downloadGuide: "Qo'llanma yuklab olish",
  },
  ru: {
    pageTitle: "Конференции",
    pageDescription: "Информация о научных конференциях и мероприятиях. Последние события и их результаты.",
    loading: "Загрузка конференций...",
    apiError: "Ошибка API:",
    staticDataShown: "Показаны статические данные",
    upcomingTab: "Предстоящие мероприятия",
    pastTab: "Прошедшие мероприятия",
    noUpcoming: "Нет предстоящих конференций",
    noUpcomingDesc: "Скоро будут добавлены новые конференции.",
    noPast: "Нет прошедших конференций",
    noPastDesc: "Пока список прошедших мероприятий пуст.",
    international: "Международная",
    registrationOpen: "Регистрация открыта",
    completed: "Завершена",
    detailsButton: "Подробная информация",
    viewButton: "Просмотр",
    materialsButton: "Материалы",
    sidebarTitle: "Информация о конференции",
    upcomingConferences: "Предстоящие конференции",
    pastConferences: "Прошедшие конференции",
    detailsShort: "Подробнее",
    organizeTitle: "Организация мероприятия",
    organizeDesc: "Организуйте свою конференцию и поделитесь с научным сообществом.",
    submitProposal: "Отправить предложение",
    downloadGuide: "Скачать руководство",
  },
  en: {
    pageTitle: "Conferences",
    pageDescription: "Information about scientific conferences and events. Latest events and their results.",
    loading: "Loading conferences...",
    apiError: "API error:",
    staticDataShown: "Showing static data",
    upcomingTab: "Upcoming Events",
    pastTab: "Past Events",
    noUpcoming: "No upcoming conferences",
    noUpcomingDesc: "New conferences will be added soon.",
    noPast: "No past conferences",
    noPastDesc: "The list of past events is currently empty.",
    international: "International",
    registrationOpen: "Registration Open",
    completed: "Completed",
    detailsButton: "More Details",
    viewButton: "View",
    materialsButton: "Materials",
    sidebarTitle: "Conference Information",
    upcomingConferences: "Upcoming Conferences",
    pastConferences: "Past Conferences",
    detailsShort: "Details",
    organizeTitle: "Organize an Event",
    organizeDesc: "Organize your own conference and share with the scientific community.",
    submitProposal: "Submit Proposal",
    downloadGuide: "Download Guide",
  },
}

export default function ConferencesPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const lang = (params.lang as string) || "en"
  const t = translations[lang as keyof typeof translations] || translations.en

  const [conferences, setConferences] = useState<Conference[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({})
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [pastPage, setPastPage] = useState(1)
  const [upcomingTotal, setUpcomingTotal] = useState(0)
  const [pastTotal, setPastTotal] = useState(0)
  const [upcomingConferences, setUpcomingConferences] = useState<Conference[]>([])
  const [pastConferences, setPastConferences] = useState<Conference[]>([])
  const ITEMS_PER_PAGE = 8

  const loadConferences = async () => {
    try {
      setIsLoading(true)
      setError(null)

      let allConferences: Conference[] = []
      let currentPage = 1
      let hasMore = true

      while (hasMore) {
        const data = await fetchConferences(lang, currentPage)
        console.log(`[v0] Fetched page ${currentPage}:`, data)

        if (data.results && data.results.length > 0) {
          allConferences = [...allConferences, ...data.results]
        }

        // Check if there are more pages
        hasMore = data.next !== null
        currentPage++
      }

      console.log("[v0] Total conferences fetched:", allConferences.length)

      if (allConferences.length > 0) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const upcoming = allConferences.filter((conf) => {
          const confDate = new Date(conf.date)
          confDate.setHours(0, 0, 0, 0)
          return confDate >= today
        })

        const past = allConferences
          .filter((conf) => {
            const confDate = new Date(conf.date)
            confDate.setHours(0, 0, 0, 0)
            return confDate < today
          })
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        console.log("[v0] Upcoming conferences:", upcoming.length)
        console.log("[v0] Past conferences:", past.length)

        setUpcomingConferences(upcoming)
        setPastConferences(past)
        setUpcomingTotal(upcoming.length)
        setPastTotal(past.length)
      }
    } catch (err) {
      console.error("[v0] Error loading conferences:", err)
      setError(err instanceof Error ? err.message : "Konferensiyalarni yuklashda xatolik yuz berdi")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadConferences()
  }, [lang])

  const handleImageError = (conference: Conference) => {
    const slug = getSlugForLang(conference, lang)
    const imageUrl = conference.image ? `${API_BASE}${conference.image}` : null
    console.error(`[v0] Image failed to load for conference: ${conference.name}`)
    console.error(`[v0] Failed image URL:`, imageUrl)
    console.error(`[v0] Conference slug:`, slug)
    setImageErrors((prev) => ({ ...prev, [slug]: true }))
  }

  const handleImageLoad = (conference: Conference) => {
    const slug = getSlugForLang(conference, lang)
    console.log(`[v0] Image successfully loaded for: ${conference.name}`)
    console.log(`[v0] Image URL: ${conference.image ? `${API_BASE}${conference.image}` : "none"}`)
    setImageLoaded((prev) => ({ ...prev, [slug]: true }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US", {
      year: "numeric",
      month: lang === "uz" ? "2-digit" : "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
                  <TabsTrigger value="upcoming">{t.upcomingTab}</TabsTrigger>
                  <TabsTrigger value="past">{t.pastTab}</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-6">
                  {upcomingConferences.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t.noUpcoming}</h3>
                      <p className="text-muted-foreground">{t.noUpcomingDesc}</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {upcomingConferences
                          .slice((upcomingPage - 1) * ITEMS_PER_PAGE, upcomingPage * ITEMS_PER_PAGE)
                          .map((conference, index) => {
                            const conferenceSlug = getSlugForLang(conference, lang)
                            const imageUrl = conference.image
                              ? `${API_BASE}${conference.image}`
                              : "/business-conference.png"
                            const hasImageError = imageErrors[conferenceSlug]
                            const isImageLoaded = imageLoaded[conferenceSlug]

                            return (
                              <Card
                                key={conferenceSlug}
                                className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-gradient-to-b from-background to-primary/2"
                              >
                                <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                                  {!hasImageError && conference.image ? (
                                    <>
                                      {!isImageLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                                          <Calendar className="h-12 w-12 text-muted-foreground/50" />
                                        </div>
                                      )}
                                      <Image
                                        src={imageUrl || "/placeholder.svg"}
                                        alt={conference.name}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        onError={() => handleImageError(conference)}
                                        onLoad={() => handleImageLoad(conference)}
                                        priority={index < 4}
                                      />
                                    </>
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                      <Calendar className="h-16 w-16 text-primary/40" />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                                    <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg">
                                      {t.international}
                                    </Badge>
                                    <Badge variant="outline" className="border-0 shadow-lg bg-green-500/90 text-white">
                                      {t.registrationOpen}
                                    </Badge>
                                  </div>
                                </div>

                                <CardHeader className="pb-3 space-y-2">
                                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                    {conference.name}
                                  </CardTitle>
                                  <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                                    <div dangerouslySetInnerHTML={{ __html: conference.description }} />
                                  </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                      <Calendar className="h-4 w-4 text-primary" />
                                      <span className="font-medium">{formatDate(conference.date)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                      <MapPin className="h-4 w-4 text-primary" />
                                      <span className="line-clamp-1">{conference.manzil}</span>
                                    </div>
                                    {conference.tashkilotchi_hamkorlar && (
                                      <div className="flex items-center space-x-2 text-muted-foreground">
                                        <Users className="h-4 w-4 text-primary" />
                                        <span className="line-clamp-1">{conference.tashkilotchi_hamkorlar}</span>
                                      </div>
                                    )}
                                  </div>

                                  <Button asChild className="w-full hover:shadow-lg transition-all duration-300">
                                    <Link href={`/${lang}/conferences/${conferenceSlug}`}>{t.detailsButton}</Link>
                                  </Button>
                                </CardContent>
                              </Card>
                            )
                          })}
                      </div>

                      {upcomingConferences.length > ITEMS_PER_PAGE && (
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-8 sm:pt-10 border-t border-border mt-8">
                          <Button
                            variant="outline"
                            disabled={upcomingPage === 1}
                            onClick={() => setUpcomingPage((prev) => Math.max(1, prev - 1))}
                            className="hover:bg-primary hover:text-primary-foreground w-full sm:w-auto text-sm sm:text-base px-6 py-2 transition-all"
                          >
                            ← {lang === "uz" ? "Oldingi" : lang === "ru" ? "Предыдущая" : "Previous"}
                          </Button>
                          <div className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-primary/10 rounded-lg border border-primary/20">
                            <span className="text-sm sm:text-base font-semibold text-primary">
                              {lang === "uz" ? "Sahifa" : lang === "ru" ? "Страница" : "Page"} {upcomingPage} /{" "}
                              {Math.ceil(upcomingConferences.length / ITEMS_PER_PAGE)}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            disabled={upcomingPage * ITEMS_PER_PAGE >= upcomingConferences.length}
                            onClick={() => setUpcomingPage((prev) => prev + 1)}
                            className="hover:bg-primary hover:text-primary-foreground w-full sm:w-auto text-sm sm:text-base px-6 py-2 transition-all"
                          >
                            {lang === "uz" ? "Keyingi" : lang === "ru" ? "Следующая" : "Next"} →
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-6">
                  {pastConferences.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t.noPast}</h3>
                      <p className="text-muted-foreground">{t.noPastDesc}</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {pastConferences
                          .slice((pastPage - 1) * ITEMS_PER_PAGE, pastPage * ITEMS_PER_PAGE)
                          .map((conference, index) => {
                            const conferenceSlug = getSlugForLang(conference, lang)
                            const imageUrl = conference.image
                              ? `${API_BASE}${conference.image}`
                              : "/past-conference.jpg"
                            const hasImageError = imageErrors[conferenceSlug]
                            const isImageLoaded = imageLoaded[conferenceSlug]

                            return (
                              <Card
                                key={conferenceSlug}
                                className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-gradient-to-b from-background to-muted/20"
                              >
                                <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                                  {!hasImageError && conference.image ? (
                                    <>
                                      {!isImageLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                                          <Calendar className="h-12 w-12 text-muted-foreground/50" />
                                        </div>
                                      )}
                                      <Image
                                        src={imageUrl || "/placeholder.svg"}
                                        alt={conference.name}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        onError={() => handleImageError(conference)}
                                        onLoad={() => handleImageLoad(conference)}
                                        priority={index < 4}
                                      />
                                    </>
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/20">
                                      <Calendar className="h-16 w-16 text-muted-foreground/40" />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                                    <Badge className="bg-muted/90 text-muted-foreground border-0 shadow-lg">
                                      {t.international}
                                    </Badge>
                                    <Badge variant="outline" className="bg-gray-500/90 text-white border-0 shadow-lg">
                                      {t.completed}
                                    </Badge>
                                  </div>
                                </div>

                                <CardHeader className="pb-3 space-y-2">
                                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                    {conference.name}
                                  </CardTitle>
                                  <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                                    <div dangerouslySetInnerHTML={{ __html: conference.description }} />
                                  </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                      <Calendar className="h-4 w-4 text-primary" />
                                      <span className="font-medium">{formatDate(conference.date)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                      <MapPin className="h-4 w-4 text-primary" />
                                      <span className="line-clamp-1">{conference.manzil}</span>
                                    </div>
                                    {conference.tashkilotchi_hamkorlar && (
                                      <div className="flex items-center space-x-2 text-muted-foreground">
                                        <Users className="h-4 w-4 text-primary" />
                                        <span className="line-clamp-1">{conference.tashkilotchi_hamkorlar}</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex space-x-2">
                                    <Button asChild className="flex-1 hover:shadow-lg transition-all duration-300">
                                      <Link href={`/${lang}/conferences/${conferenceSlug}`}>{t.viewButton}</Link>
                                    </Button>
                                    {conference.pdf && (
                                      <Button variant="outline" className="bg-transparent">
                                        {t.materialsButton}
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                      </div>

                      {pastConferences.length > ITEMS_PER_PAGE && (
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-8 sm:pt-10 border-t border-border mt-8">
                          <Button
                            variant="outline"
                            disabled={pastPage === 1}
                            onClick={() => setPastPage((prev) => Math.max(1, prev - 1))}
                            className="hover:bg-primary hover:text-primary-foreground w-full sm:w-auto text-sm sm:text-base px-6 py-2 transition-all"
                          >
                            ← {lang === "uz" ? "Oldingi" : lang === "ru" ? "Предыдущая" : "Previous"}
                          </Button>
                          <div className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-primary/10 rounded-lg border border-primary/20">
                            <span className="text-sm sm:text-base font-semibold text-primary">
                              {lang === "uz" ? "Sahifa" : lang === "ru" ? "Страница" : "Page"} {pastPage} /{" "}
                              {Math.ceil(pastConferences.length / ITEMS_PER_PAGE)}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            disabled={pastPage * ITEMS_PER_PAGE >= pastConferences.length}
                            onClick={() => setPastPage((prev) => prev + 1)}
                            className="hover:bg-primary hover:text-primary-foreground w-full sm:w-auto text-sm sm:text-base px-6 py-2 transition-all"
                          >
                            {lang === "uz" ? "Keyingi" : lang === "ru" ? "Следующая" : "Next"} →
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="sticky top-24">
                <aside className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      {t.sidebarTitle}
                    </h3>

                    {/* Upcoming Conferences Section */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-green-600" />
                        {t.upcomingConferences}
                      </h4>
                      <ul className="space-y-2">
                        {upcomingConferences.slice(0, 3).map((conference) => {
                          const conferenceSlug = getSlugForLang(conference, lang)

                          return (
                            <li key={conferenceSlug}>
                              <div className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                                      {conference.name}
                                    </h5>
                                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                      <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span className="line-clamp-1">{conference.manzil}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        <span>{formatDate(conference.date)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                                  asChild
                                >
                                  <Link href={`/${lang}/conferences/${conferenceSlug}`}>{t.detailsShort}</Link>
                                </Button>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    {/* Past Conferences Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-red-600" />
                        {t.pastConferences}
                      </h4>
                      <ul className="space-y-2">
                        {pastConferences.slice(0, 3).map((conference) => {
                          const conferenceSlug = getSlugForLang(conference, lang)

                          return (
                            <li key={conferenceSlug}>
                              <div className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                                      {conference.name}
                                    </h5>
                                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                      <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span className="line-clamp-1">{conference.manzil}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        <span>{formatDate(conference.date)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="w-full mt-2 bg-red-600 hover:bg-red-700 text-xs"
                                  asChild
                                >
                                  <Link href={`/${lang}/conferences/${conferenceSlug}`}>{t.viewButton}</Link>
                                </Button>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

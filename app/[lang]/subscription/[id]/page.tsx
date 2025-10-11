"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { fetchSubscriptionPlan } from "@/lib/api.tsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, FileText, Calendar, Clock, DollarSign, Megaphone } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface Book {
  category_name: string
  author_name: string
  image: string
  name: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  isbn: string
  year: number
  description: string
  page_count: number
}

interface Journal {
  slug_uz: string
  slug_en: string
  slug_ru: string
  name: string
  description: string
  issues_count: number
  image: string
  issn: string
}

interface Conference {
  name: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  image: string
  date: string
  manzil: string
  tashkilotchi_hamkorlar: string
  description: string
}

interface Reklama {
  id: number
  name: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  image: string
  description: string
  company_name: string
  contact_info: string
  created_at: string
}

interface SubscriptionPlanDetail {
  id: number
  name: string
  duration_days: number
  price: string
  books: Book[]
  journals: Journal[]
  conferences: Conference[]
  reklamas: Reklama[]
  books_count: number
  journals_count: number
  conferences_count: number
  reklamas_count: number
}

const API_BASE = "https://artculture.pythonanywhere.com"

const translations = {
  uz: {
    backToHome: "Bosh sahifaga qaytish",
    subscriptionDetails: "Obuna tafsilotlari",
    price: "Narx",
    duration: "Davomiyligi",
    days: "kun",
    includedContent: "Obunaga kiruvchi materiallar",
    books: "Kitoblar",
    journals: "Jurnallar",
    conferences: "Konferensiyalar",
    reklamas: "Reklamalar",
    noReklamas: "Reklamalar mavjud emas",
    company: "Kompaniya",
    contact: "Aloqa",
    noBooks: "Kitoblar mavjud emas",
    noJournals: "Jurnallar mavjud emas",
    noConferences: "Konferensiyalar mavjud emas",
    subscribe: "Obuna bo'lish",
    loading: "Yuklanmoqda...",
    error: "Xatolik yuz berdi",
    notFound: "Obuna topilmadi",
    goBack: "Orqaga qaytish",
    author: "Muallif",
    category: "Kategoriya",
    pages: "Sahifalar",
    year: "Yil",
    issues: "Sonlar",
    date: "Sana",
    location: "Manzil",
    organizer: "Tashkilotchi",
    alreadySubscribed: "Sizda allaqachon obuna mavjud!",
  },
  ru: {
    backToHome: "Вернуться на главную",
    subscriptionDetails: "Детали подписки",
    price: "Цена",
    duration: "Продолжительность",
    days: "дней",
    includedContent: "Материалы, включенные в подписку",
    books: "Книги",
    journals: "Журналы",
    conferences: "Конференции",
    reklamas: "Реклама",
    noReklamas: "Реклама недоступна",
    company: "Компания",
    contact: "Контакт",
    noBooks: "Книги недоступны",
    noJournals: "Журналы недоступны",
    noConferences: "Конференции недоступны",
    subscribe: "Подписаться",
    loading: "Загрузка...",
    error: "Произошла ошибка",
    notFound: "Подписка не найдена",
    goBack: "Назад",
    author: "Автор",
    category: "Категория",
    pages: "Страницы",
    year: "Год",
    issues: "Выпуски",
    date: "Дата",
    location: "Место",
    organizer: "Организатор",
    alreadySubscribed: "У вас уже есть подписка!",
  },
  en: {
    backToHome: "Back to Home",
    subscriptionDetails: "Subscription Details",
    price: "Price",
    duration: "Duration",
    days: "days",
    includedContent: "Included Content",
    books: "Books",
    journals: "Journals",
    conferences: "Conferences",
    reklamas: "Advertisements",
    noReklamas: "No advertisements available",
    company: "Company",
    contact: "Contact",
    noBooks: "No books available",
    noJournals: "No journals available",
    noConferences: "No conferences available",
    subscribe: "Subscribe",
    loading: "Loading...",
    error: "An error occurred",
    notFound: "Subscription not found",
    goBack: "Go Back",
    author: "Author",
    category: "Category",
    pages: "Pages",
    year: "Year",
    issues: "Issues",
    date: "Date",
    location: "Location",
    organizer: "Organizer",
    alreadySubscribed: "You already have a subscription!",
  },
}

export default function SubscriptionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lang = params.lang as string
  const id = params.id as string
  const t = translations[lang as keyof typeof translations] || translations.en

  const [subscription, setSubscription] = useState<SubscriptionPlanDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchSubscriptionPlan(Number(id), lang)
        setSubscription(data)
      } catch (err: any) {
        console.error("Error fetching subscription:", err)
        setError(err.message || t.error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, lang])

  const handleSubscribe = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

    if (!token) {
      const returnUrl = encodeURIComponent(`/${lang}/buy/?subscription_type_id=${id}`)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
      return
    }

    try {
      setIsSubscribing(true)
      const response = await fetch(`${API_BASE}/${lang}/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        console.log("[v0] User profile data:", userData)

        const hasSubscription = userData.subscriptions && userData.subscriptions.length > 0

        if (hasSubscription) {
          alert(t.alreadySubscribed || "Sizda allaqachon obuna mavjud!")
        } else {
          router.push(`/${lang}/buy/?subscription_type_id=${id}`)
        }
      } else {
        router.push(`/${lang}/buy/?subscription_type_id=${id}`)
      }
    } catch (error) {
      console.error("[v0] Error checking user subscription:", error)
      router.push(`/${lang}/buy/?subscription_type_id=${id}`)
    } finally {
      setIsSubscribing(false)
    }
  }

  const getSlugForLang = (item: any) => {
    if (lang === "uz") return item.slug_uz
    if (lang === "ru") return item.slug_ru
    return item.slug_en
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => router.push(`/${lang}`)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToHome}
          </Button>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{subscription?.name}</CardTitle>
              <CardDescription className="text-lg">{t.subscriptionDetails}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.price}</p>
                    <p className="text-2xl font-bold">{subscription?.price} UZS</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.duration}</p>
                    <p className="text-2xl font-bold">
                      {subscription?.duration_days} {t.days}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.includedContent}</p>
                    <p className="text-2xl font-bold">
                      {subscription?.books_count +
                        subscription?.journals_count +
                        subscription?.conferences_count +
                        (subscription?.reklamas_count || 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="w-full bg-gradient-to-r from-[#003D7F] via-[#0059B2] to-[#007ACC] hover:from-[#002B5A] hover:via-[#004494] hover:to-[#005A99] text-white font-semibold py-6 text-lg rounded-xl"
                >
                  {isSubscribing ? t.loading : t.subscribe}
                </Button>
              </div>
            </CardContent>
          </Card>

          {subscription?.books.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {t.books} ({subscription?.books_count})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subscription?.books.map((book, index) => (
                    <Link key={index} href={`/${lang}/books/${getSlugForLang(book)}`} className="block">
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                          <img
                            src={book.image || "/placeholder.svg"}
                            alt={book.name}
                            className="w-full h-48 object-cover rounded-md mb-3"
                          />
                          <h3 className="font-semibold mb-2 line-clamp-2">{book.name}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">{t.author}:</span> {book.author_name}
                            </p>
                            <p>
                              <span className="font-medium">{t.category}:</span> {book.category_name}
                            </p>
                            <p>
                              <span className="font-medium">{t.year}:</span> {book.year}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {subscription?.journals.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t.journals} ({subscription?.journals_count})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subscription?.journals.map((journal, index) => (
                    <Link key={index} href={`/${lang}/journals/${getSlugForLang(journal)}`} className="block">
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                          <img
                            src={journal.image || "/placeholder.svg"}
                            alt={journal.name}
                            className="w-full h-48 object-cover rounded-md mb-3"
                          />
                          <h3 className="font-semibold mb-2 line-clamp-2">{journal.name}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">ISSN:</span> {journal.issn}
                            </p>
                            <p>
                              <span className="font-medium">{t.issues}:</span> {journal.issues_count}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {subscription?.conferences.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t.conferences} ({subscription?.conferences_count})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subscription?.conferences.map((conference, index) => (
                    <Link key={index} href={`/${lang}/conferences/${getSlugForLang(conference)}`} className="block">
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                          <img
                            src={conference.image || "/placeholder.svg"}
                            alt={conference.name}
                            className="w-full h-48 object-cover rounded-md mb-3"
                          />
                          <h3 className="font-semibold mb-2 line-clamp-2">{conference.name}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">{t.date}:</span> {conference.date}
                            </p>
                            <p>
                              <span className="font-medium">{t.location}:</span> {conference.manzil}
                            </p>
                            <p>
                              <span className="font-medium">{t.organizer}:</span> {conference.tashkilotchi_hamkorlar}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {subscription?.reklamas && subscription?.reklamas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  {t.reklamas} ({subscription?.reklamas_count || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subscription?.reklamas.map((reklama) => (
                    <Link key={reklama.id} href={`/${lang}/reklama/${getSlugForLang(reklama)}`} className="block">
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                          <img
                            src={reklama.image || "/placeholder.svg"}
                            alt={reklama.name}
                            className="w-full h-48 object-cover rounded-md mb-3"
                          />
                          <h3 className="font-semibold mb-2 line-clamp-2">{reklama.name}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">{t.company}:</span> {reklama.company_name}
                            </p>
                            <p className="line-clamp-2">{reklama.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

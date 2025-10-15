"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface ContentItem {
  category_name?: string
  author_name?: string
  image: string
  name: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  isbn?: string
  issn?: string
  year?: number
  description?: string
  page_count?: number
  issues_count?: number
  date?: string
  manzil?: string
  tashkilotchi_hamkorlar?: string
}

interface ContentResponse {
  count: number
  next: string | null
  previous: string | null
  results: ContentItem[]
}

const API_BASE = "https://artculture.pythonanywhere.com"

const translations = {
  uz: {
    backToSubscription: "Obunaga qaytish",
    books: "Kitoblar",
    journals: "Jurnallar",
    conferences: "Konferensiyalar",
    loading: "Yuklanmoqda...",
    error: "Xatolik yuz berdi",
    noContent: "Ma'lumot topilmadi",
    previous: "Oldingi",
    next: "Keyingi",
    page: "Sahifa",
    of: "dan",
    author: "Muallif",
    category: "Kategoriya",
    year: "Yil",
    pages: "Sahifalar",
    issues: "Sonlar",
    date: "Sana",
    location: "Manzil",
    organizer: "Tashkilotchi",
  },
  ru: {
    backToSubscription: "Вернуться к подписке",
    books: "Книги",
    journals: "Журналы",
    conferences: "Конференции",
    loading: "Загрузка...",
    error: "Произошла ошибка",
    noContent: "Контент не найден",
    previous: "Предыдущая",
    next: "Следующая",
    page: "Страница",
    of: "из",
    author: "Автор",
    category: "Категория",
    year: "Год",
    pages: "Страницы",
    issues: "Выпуски",
    date: "Дата",
    location: "Место",
    organizer: "Организатор",
  },
  en: {
    backToSubscription: "Back to Subscription",
    books: "Books",
    journals: "Journals",
    conferences: "Conferences",
    loading: "Loading...",
    error: "An error occurred",
    noContent: "No content found",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    author: "Author",
    category: "Category",
    year: "Year",
    pages: "Pages",
    issues: "Issues",
    date: "Date",
    location: "Location",
    organizer: "Organizer",
  },
}

export default function SubscriptionContentPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = params.lang as string
  const id = params.id as string
  const type = searchParams.get("type") || "book"
  const currentPage = Number(searchParams.get("page")) || 1
  const t = translations[lang as keyof typeof translations] || translations.en

  const [content, setContent] = useState<ContentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${API_BASE}/subscriptions/${id}/content/?type=${type}&page=${currentPage}`)
        if (!response.ok) throw new Error("Failed to fetch content")
        const data = await response.json()
        setContent(data)
      } catch (err: any) {
        console.error("Error fetching content:", err)
        setError(err.message || t.error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [id, type, currentPage])

  const getSlugForLang = (item: ContentItem) => {
    if (lang === "uz") return item.slug_uz
    if (lang === "ru") return item.slug_ru
    return item.slug_en
  }

  const getContentTypeLabel = () => {
    if (type === "book") return t.books
    if (type === "journal") return t.journals
    if (type === "conference") return t.conferences
    return ""
  }

  const getContentLink = (item: ContentItem) => {
    if (type === "book") return `/${lang}/books/${getSlugForLang(item)}`
    if (type === "journal") return `/${lang}/journals/${getSlugForLang(item)}`
    if (type === "conference") return `/${lang}/conferences/${getSlugForLang(item)}`
    return "#"
  }

  const totalPages = content ? Math.ceil(content.count / 10) : 0

  const handlePageChange = (newPage: number) => {
    router.push(`/${lang}/subscription/${id}/content?type=${type}&page=${newPage}`)
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-lg">{t.loading}</p>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-lg text-red-600">{error}</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => router.push(`/${lang}/subscription/${id}`)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToSubscription}
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{getContentTypeLabel()}</h1>
            <p className="text-muted-foreground">
              {content?.count} {getContentTypeLabel().toLowerCase()}
            </p>
          </div>

          {content && content.results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {content.results.map((item, index) => (
                  <Link key={index} href={getContentLink(item)} className="block">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardContent className="p-4">
                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `${API_BASE}${item.image}` || "/placeholder.svg"
                          }
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-md mb-3"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                        <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {type === "book" && (
                            <>
                              {item.author_name && (
                                <p>
                                  <span className="font-medium">{t.author}:</span> {item.author_name}
                                </p>
                              )}
                              {item.category_name && (
                                <p>
                                  <span className="font-medium">{t.category}:</span> {item.category_name}
                                </p>
                              )}
                              {item.year && (
                                <p>
                                  <span className="font-medium">{t.year}:</span> {item.year}
                                </p>
                              )}
                            </>
                          )}
                          {type === "journal" && (
                            <>
                              {item.issn && (
                                <p>
                                  <span className="font-medium">ISSN:</span> {item.issn}
                                </p>
                              )}
                              {item.issues_count && (
                                <p>
                                  <span className="font-medium">{t.issues}:</span> {item.issues_count}
                                </p>
                              )}
                            </>
                          )}
                          {type === "conference" && (
                            <>
                              {item.date && (
                                <p>
                                  <span className="font-medium">{t.date}:</span> {item.date}
                                </p>
                              )}
                              {item.manzil && (
                                <p>
                                  <span className="font-medium">{t.location}:</span> {item.manzil}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t.previous}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {t.page} {currentPage} {t.of} {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    {t.next}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">{t.noContent}</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

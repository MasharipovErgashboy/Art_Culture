"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, BookOpen, FileText, User } from "lucide-react"
import type { Author } from "@/lib/api"

const API_BASE = "https://artculture.pythonanywhere.com"

const translations = {
  uz: {
    backToList: "Mualliflar ro'yxatiga qaytish",
    books: "Kitoblar",
    journals: "Jurnallar",
    aboutAuthor: "Muallif haqida",
    loading: "Yuklanmoqda...",
    goBack: "Orqaga qaytish",
    authorNotFound: "Muallif topilmadi",
  },
  ru: {
    backToList: "Вернуться к списку авторов",
    books: "Книги",
    journals: "Журналы",
    aboutAuthor: "Об авторе",
    loading: "Загрузка...",
    goBack: "Назад",
    authorNotFound: "Автор не найден",
  },
  en: {
    backToList: "Back to Authors List",
    books: "Books",
    journals: "Journals",
    aboutAuthor: "About the Author",
    loading: "Loading...",
    goBack: "Go Back",
    authorNotFound: "Author not found",
  },
}

const convertRelativeImageUrls = (html: string): string => {
  if (!html) return ""
  return html.replace(/(src|href)=["'](\/(media|static)[^"']+)["']/gi, (match, attr, path) => {
    return `${attr}="${API_BASE}${path}"`
  })
}

const cleanHtmlContent = (content: string) => {
  if (!content) return ""
  return convertRelativeImageUrls(content)
}

export default function AuthorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [author, setAuthor] = useState<Author | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentAuthorId, setCurrentAuthorId] = useState<number | null>(null)
  const prevLang = useRef<string>("")

  const lang = (params.lang as "uz" | "ru" | "en") || "uz"
  const slug = params.slug as string

  const t = translations[lang as keyof typeof translations] || translations.uz

  useEffect(() => {
    const fetchAuthorDetail = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const apiUrl = `${API_BASE}/${lang}/authors/${slug}/`
        console.log("[v0] Fetching author from:", apiUrl)

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Accept-Language": lang,
          },
          mode: "cors",
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
        }

        const authorData = await response.json()
        console.log("[v0] Author data received:", authorData)
        console.log("[v0] Books count:", authorData.books_count)
        console.log("[v0] Journals count:", authorData.journals_count)
        console.log("[v0] Full author object:", JSON.stringify(authorData, null, 2))

        setAuthor(authorData)

        if (authorData.id) {
          setCurrentAuthorId(authorData.id)
        }

        console.log("[v0] Author fetch completed successfully")
      } catch (err) {
        console.error("[v0] Author fetch error:", err)
        setError(err instanceof Error ? err.message : "Ma'lumot yuklanmadi")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchAuthorDetail()
    }
  }, [slug, lang])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => router.back()} variant="outline">
              {t.goBack}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p>{t.authorNotFound}</p>
            <Button onClick={() => router.back()} variant="outline">
              {t.goBack}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const imageUrl = author.image ? (author.image.startsWith("http") ? author.image : `${API_BASE}${author.image}`) : null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <Button
          onClick={() => router.push(`/${lang}/authors`)}
          variant="outline"
          className="mb-6 sm:mb-8 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.backToList}
        </Button>

        <Card className="overflow-hidden border-0 shadow-lg">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Author Image */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-muted">
                  {imageUrl ? (
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={author.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <User className="h-24 w-24 text-primary/30" />
                    </div>
                  )}
                </div>
              </div>

              {/* Author Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4">{author.name}</h1>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {t.books}: <span className="font-semibold text-foreground">{author.books_count}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {t.journals}: <span className="font-semibold text-foreground">{author.journals_count}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {author.description && (
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-primary">{t.aboutAuthor}</h2>
                    <div
                      className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:shadow-md"
                      dangerouslySetInnerHTML={{
                        __html: cleanHtmlContent(author.description),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

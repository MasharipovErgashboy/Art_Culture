"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader } from "@/components/Loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { fetchBook, type Book } from "@/lib/api"
import { BookOpen, AlertCircle, ArrowLeft, Download, Calendar, User, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const translations = {
  uz: {
    loading: "Kitob yuklanmoqda...",
    goBack: "Orqaga qaytish",
    author: "Muallif",
    year: "Yil",
    pages: "Sahifalar",
    isbn: "ISBN",
    description: "Tavsif",
    downloadPDF: "PDF ni ochish",
    error: "Kitobni yuklashda xatolik yuz berdi",
    notFound: "Kitob topilmadi",
    home: "Bosh sahifa",
    books: "Kitoblar",
  },
  ru: {
    loading: "Загрузка книги...",
    goBack: "Назад",
    author: "Автор",
    year: "Год",
    pages: "Страницы",
    isbn: "ISBN",
    description: "Описание",
    downloadPDF: "Открыть PDF",
    error: "Ошибка при загрузке книги",
    notFound: "Книга не найдена",
    home: "Главная",
    books: "Книги",
  },
  en: {
    loading: "Loading book...",
    goBack: "Go Back",
    author: "Author",
    year: "Year",
    pages: "Pages",
    isbn: "ISBN",
    description: "Description",
    downloadPDF: "Open PDF",
    error: "Error loading book",
    notFound: "Book not found",
    home: "Home",
    books: "Books",
  },
}

// Helper function to convert relative image URLs to absolute URLs
function convertRelativeImageUrls(html: string): string {
  if (!html) return ""
  return html.replace(/(src|href)=["'](\/media\/[^"']+|\/static\/[^"']+)["']/gi, (match, attr, url) => {
    return `${attr}="https://artculture.pythonanywhere.com${url}"`
  })
}

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as string) || "uz"
  const slug = params.slug as string
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const loadBook = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchBook(slug, lang)
        console.log("[v0] Book data:", data)
        console.log("[v0] Book image:", data.image)
        setBook(data)
      } catch (err) {
        console.error("[v0] Error loading book:", err)
        setError(err instanceof Error ? err.message : t.error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBook()
  }, [slug, lang])

  const handlePdfClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Check if user is logged in
    const token = localStorage.getItem("access_token")

    if (!token) {
      // Not logged in - redirect to login with return URL
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
      return
    }

    // User is logged in - try to fetch PDF directly
    // Backend will return 403 if user doesn't have access
    try {
      const pdfResponse = await fetch(`https://artculture.pythonanywhere.com/${lang}/book/${slug}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (pdfResponse.status === 401) {
        // Token invalid - redirect to login
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/${lang}/login?returnUrl=${returnUrl}`)
        return
      }

      if (pdfResponse.status === 403) {
        // No subscription - redirect to buy page
        router.push(`/${lang}/buy/?subscription_type_id=1`)
        return
      }

      if (!pdfResponse.ok) {
        alert("PDF yuklanishida xatolik yuz berdi")
        return
      }

      // Get the PDF blob
      const pdfBlob = await pdfResponse.blob()

      // Create a blob URL and open in new tab
      const blobUrl = URL.createObjectURL(pdfBlob)
      window.open(blobUrl, "_blank")

      // Clean up the blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl)
      }, 100)
    } catch (error) {
      console.error("Error fetching PDF:", error)
      alert("PDF yuklanishida xatolik yuz berdi")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Loader message={t.loading} />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-center">{error || t.error}</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    )
  }

  const imageUrl = book.image ? `https://artculture.pythonanywhere.com${book.image}` : null
  const pdfUrl = book.pdf_file ? `https://artculture.pythonanywhere.com${book.pdf_file}` : null

  console.log("[v0] Image URL:", imageUrl)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Breadcrumb */}
      <section className="py-6 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              {t.home}
            </Link>
            <span>/</span>
            <Link href={`/${lang}/books-category`} className="hover:text-primary">
              {t.books}
            </Link>
            <span>/</span>
            <span className="text-foreground">{book.name}</span>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="group hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t.goBack}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  {imageUrl && !imageError ? (
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg mb-6">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={book.name}
                        className="w-full h-full object-cover"
                        onError={() => {
                          console.log("[v0] Image failed to load:", imageUrl)
                          setImageError(true)
                        }}
                        onLoad={() => {
                          console.log("[v0] Image loaded successfully:", imageUrl)
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] relative mb-6 overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-primary/40" />
                    </div>
                  )}

                  {pdfUrl && (
                    <Button asChild className="w-full" size="lg">
                      <a href="#" onClick={handlePdfClick}>
                        <Download className="h-4 w-4 mr-2" />
                        {t.downloadPDF}
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Book Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-4">{book.name}</h1>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      <strong>{t.author}:</strong> {book.author_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      <strong>{t.year}:</strong> {book.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>
                      <strong>{t.pages}:</strong> {book.page_count}
                    </span>
                  </div>
                  {book.isbn && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>
                        <strong>{t.isbn}:</strong> {book.isbn}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">{t.description}</h2>
                  <div
                    className="prose prose-blue max-w-none text-gray-700 leading-relaxed [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:shadow-md [&_img]:block"
                    dangerouslySetInnerHTML={{ __html: convertRelativeImageUrls(book.description) }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

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
import { fetchWithAuth } from "@/lib/auth"
import { BookOpen, AlertCircle, ArrowLeft, Download, Calendar, User, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { PDFViewer } from "@/components/pdf-viewer"

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
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)

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

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [pdfBlobUrl])

  const handlePdfClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    console.log("[v0] ========== BOOK PDF OPEN DEBUG ==========")
    console.log("[v0] Book data:", book)
    console.log("[v0] URL slug parameter:", slug)
    console.log("[v0] Book slug from API:", book?.slug)
    console.log("[v0] Book ID from API:", book?.id)
    console.log("[v0] Book pdf_file from API:", book?.pdf_file)

    // Check if user is logged in
    const token = localStorage.getItem("access_token")
    console.log("[v0] Access token exists:", !!token)

    if (!token) {
      console.log("[v0] No token found, redirecting to login")
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
      return
    }

    try {
      const bookSlug = book?.slug || slug
      console.log("[v0] Using slug for PDF fetch:", bookSlug)
      console.log("[v0] Fetching PDF for book:", bookSlug)
      const pdfUrl = `https://artculture.pythonanywhere.com/${lang}/book/${bookSlug}/`
      console.log("[v0] PDF URL:", pdfUrl)

      const pdfResponse = await fetchWithAuth(pdfUrl, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      })

      console.log("[v0] PDF response status:", pdfResponse.status)
      console.log("[v0] PDF response ok:", pdfResponse.ok)
      console.log("[v0] PDF response content-type:", pdfResponse.headers.get("content-type"))

      if (pdfResponse.status === 403) {
        console.log("[v0] 403 Forbidden - User needs subscription")
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/${lang}/buy/?subscription_type_id=1&returnUrl=${returnUrl}`)
        return
      }

      if (!pdfResponse.ok) {
        const contentType = pdfResponse.headers.get("content-type")
        let errorMessage = `HTTP error! status: ${pdfResponse.status}`

        if (contentType?.includes("application/json")) {
          try {
            const errorData = await pdfResponse.json()
            console.error("[v0] API error response (JSON):", errorData)
            errorMessage = errorData.detail || errorData.message || errorMessage
          } catch (e) {
            console.error("[v0] Could not parse error response as JSON")
          }
        } else {
          const errorText = await pdfResponse.text()
          console.error("[v0] API error response (text):", errorText)
          if (errorText) {
            errorMessage = errorText
          }
        }

        console.error("[v0] PDF fetch failed:", errorMessage)
        alert(`PDF yuklanishida xatolik yuz berdi: ${errorMessage}`)
        return
      }

      const pdfBlob = await pdfResponse.blob()
      console.log("[v0] PDF blob size:", pdfBlob.size)
      console.log("[v0] PDF blob type:", pdfBlob.type)

      if (pdfBlob.size === 0) {
        console.error("[v0] PDF blob is empty")
        alert("PDF yuklanishida xatolik yuz berdi: Fayl bo'sh")
        return
      }

      const blobUrl = URL.createObjectURL(pdfBlob)
      console.log("[v0] PDF blob URL created:", blobUrl)
      setPdfBlobUrl(blobUrl)
      setShowPDFViewer(true)
      console.log("[v0] ========== BOOK PDF OPEN SUCCESS ==========")
    } catch (error) {
      console.error("[v0] ========== BOOK PDF OPEN ERROR ==========")
      console.error("[v0] Error:", error)
      if (error instanceof Error) {
        console.error("[v0] Error message:", error.message)
        console.error("[v0] Error stack:", error.stack)
        alert(`PDF yuklanishida xatolik yuz berdi: ${error.message}`)
      } else {
        alert("PDF yuklanishida xatolik yuz berdi")
      }
      console.error("[v0] ========== BOOK PDF OPEN ERROR END ==========")
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

      {showPDFViewer && pdfBlobUrl && (
        <PDFViewer
          pdfUrl={pdfBlobUrl}
          onClose={() => {
            setShowPDFViewer(false)
            if (pdfBlobUrl) {
              URL.revokeObjectURL(pdfBlobUrl)
              setPdfBlobUrl(null)
            }
          }}
          title={book?.name}
        />
      )}

      <Footer />
    </div>
  )
}

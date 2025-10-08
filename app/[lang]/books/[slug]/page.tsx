"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, PiIcon as PdfIcon, BookOpen, Calendar, Hash, FileText, User } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface Book {
  id?: number
  category_name: string
  author_name: string
  image: string | null
  name: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  isbn: string | null
  year: number | null
  description: string
  page_count: number
  tags: string | null
  pages: string | null
  pdf_file: string | null
}

// Helper function to convert relative image URLs to absolute URLs
function convertRelativeImageUrls(html: string): string {
  const API_BASE = "https://artculture.pythonanywhere.com"

  // Replace all img src attributes that start with /media/ or /static/
  return html.replace(/(<img[^>]+src=["'])(\/(media|static)\/[^"']+)(["'])/gi, `$1${API_BASE}$2$4`)
}

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lang = params?.lang as string
  const slug = params?.slug as string

  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBook = async () => {
      const token = localStorage.getItem("access_token")

      if (!token) {
        router.push(`/${lang}/login?returnUrl=${encodeURIComponent(`/${lang}/books/${slug}`)}`)
        return
      }

      try {
        setIsLoading(true)

        console.log("[v0] ===== BOOK FETCH STARTED =====")
        console.log("[v0] Current language:", lang)
        console.log("[v0] Current slug from URL:", slug)

        const apiUrl = `https://artculture.pythonanywhere.com/${lang}/books/${slug}/`
        console.log("[v0] Fetching book from:", apiUrl)

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Book data:", data)
        setBook(data)
      } catch (err) {
        console.error("[v0] Failed to fetch book:", err)
        setError("Kitob ma'lumotlarini yuklashda xatolik yuz berdi")
      } finally {
        setIsLoading(false)
      }
    }

    if (lang && slug) {
      fetchBook()
    }
  }, [lang, slug, router])

  const handleDownloadPDF = () => {
    if (book?.pdf_file) {
      const fullUrl = book.pdf_file.startsWith("http")
        ? book.pdf_file
        : `https://artculture.pythonanywhere.com${book.pdf_file}`
      window.open(fullUrl, "_blank")
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Yuklanmoqda...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !book) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error || "Kitob topilmadi"}</p>
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Orqaga
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button onClick={() => router.back()} variant="ghost" className="mb-6 hover:bg-blue-50 hover:text-blue-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga
          </Button>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Book Image */}
            <div className="md:col-span-1">
              <Card className="overflow-hidden shadow-lg sticky top-24">
                <CardContent className="p-0">
                  {book.image ? (
                    <div className="relative w-full aspect-[3/4]">
                      <img
                        src={
                          book.image.startsWith("http")
                            ? book.image
                            : `https://artculture.pythonanywhere.com${book.image}`
                        }
                        alt={book.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("[v0] Image failed to load:", book.image)
                          e.currentTarget.style.display = "none"
                          e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              <svg class="h-24 w-24 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13M0 16.5h.008v.008H0V16.5zm0 0h23.992v.008H24V16.5zm0 0a2.5 2.5 0 01-2.5 2.5H2.5A2.5 2.5 0 010 16.5zm2.5 0a2.5 2.5 0 002.5 2.5h18.992a2.5 2.5 0 002.5-2.5H2.5z" />
                              </svg>
                            </div>
                          `
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <BookOpen className="h-24 w-24 text-blue-300" />
                    </div>
                  )}
                </CardContent>

                {book.pdf_file && (
                  <div className="p-4">
                    <Button onClick={handleDownloadPDF} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      <PdfIcon className="mr-2 h-5 w-5" />
                      PDF ni ochish
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column - Book Details */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">{book.name}</h1>

                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <User className="mr-1 h-3 w-3" />
                    {book.author_name}
                  </Badge>

                  {book.year && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      <Calendar className="mr-1 h-3 w-3" />
                      {book.year}
                    </Badge>
                  )}

                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <FileText className="mr-1 h-3 w-3" />
                    {book.page_count} sahifa
                  </Badge>

                  {book.isbn && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      <Hash className="mr-1 h-3 w-3" />
                      ISBN: {book.isbn}
                    </Badge>
                  )}
                </div>

                <Link
                  href={`/${lang}/books-category/${book.category_name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-block"
                >
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer">
                    {book.category_name}
                  </Badge>
                </Link>
              </div>

              <Separator />

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">Kitob haqida</h2>
                  <div
                    className="prose prose-blue max-w-none text-gray-700 leading-relaxed 
                    [&_img]:!block [&_img]:!max-w-full [&_img]:!w-auto [&_img]:!h-auto 
                    [&_img]:!rounded-lg [&_img]:!my-4 [&_img]:!shadow-md [&_img]:!mx-auto
                    [&_img]:!object-contain"
                    dangerouslySetInnerHTML={{ __html: convertRelativeImageUrls(book.description) }}
                  />
                </CardContent>
              </Card>

              {book.tags && (
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Teglar</h3>
                    <div className="flex flex-wrap gap-2">
                      {book.tags.split(",").map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {book.pages && (
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Sahifalar</h3>
                    <p className="text-gray-700">{book.pages}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

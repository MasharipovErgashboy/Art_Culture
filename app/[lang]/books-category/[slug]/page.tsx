"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { BookCard } from "@/components/book-card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchBookCategory } from "@/lib/api"

const translations = {
  uz: {
    backToBooks: "Kitoblarga qaytish",
    booksInCategory: "ta kitob",
    author: "Muallif",
    year: "Yil",
    pages: "Sahifalar",
    isbn: "ISBN",
    downloadPDF: "PDF yuklab olish",
    viewDetails: "Batafsil",
    noBooksYet: "Hozircha kitoblar yo'q",
    noBooksDescription: "Bu kategoriyada hali kitoblar mavjud emas.",
    loading: "Yuklanmoqda...",
    loginRequired: "Kirish talab qilinadi",
    loginToView: "Kitoblarni ko'rish uchun tizimga kiring",
    previous: "Oldingi",
    next: "Keyingi",
    page: "Sahifa",
    of: "dan",
  },
  ru: {
    backToBooks: "Вернуться к книгам",
    booksInCategory: "книг",
    author: "Автор",
    year: "Год",
    pages: "Страницы",
    isbn: "ISBN",
    downloadPDF: "Скачать PDF",
    viewDetails: "Подробнее",
    noBooksYet: "Книг пока нет",
    noBooksDescription: "В этой категории пока нет книг.",
    loading: "Загрузка...",
    loginRequired: "Требуется вход",
    loginToView: "Войдите, чтобы просмотреть книги",
    previous: "Предыдущая",
    next: "Следующая",
    page: "Страница",
    of: "из",
  },
  en: {
    backToBooks: "Back to Books",
    booksInCategory: "books",
    author: "Author",
    year: "Year",
    pages: "Pages",
    isbn: "ISBN",
    downloadPDF: "Download PDF",
    viewDetails: "View Details",
    noBooksYet: "No books yet",
    noBooksDescription: "There are no books in this category yet.",
    loading: "Loading...",
    loginRequired: "Login Required",
    loginToView: "Please login to view books",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
}

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
  tags: string
  pages: string | null
  pdf_file: string
}

interface BookCategoryDetail {
  id?: number
  slug_uz: string
  slug_en: string
  slug_ru: string
  name: string
  books_count: number
  description: string
  latest_books: Book[]
}

const API_BASE = "https://artculture.pythonanywhere.com"

export default function BookCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = params.lang as string
  const slug = params.slug as string
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [category, setCategory] = useState<BookCategoryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get("page")
    return pageParam ? Number.parseInt(pageParam, 10) : 1
  })
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null)
  const prevLang = useRef<string>(lang)
  const booksPerPage = 8

  useEffect(() => {
    const pageParam = searchParams.get("page")
    const pageFromUrl = pageParam ? Number.parseInt(pageParam, 10) : 1
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[v0] ===== BOOK CATEGORY FETCH STARTED =====")
        console.log("[v0] Current language:", lang)
        console.log("[v0] Current slug from URL:", slug)
        console.log("[v0] Current page:", currentPage)
        console.log("[v0] Books per page:", booksPerPage)

        const data = await fetchBookCategory(slug, lang, currentPage, booksPerPage)

        console.log("[v0] ===== API RESPONSE RECEIVED =====")
        console.log("[v0] Full API response:", JSON.stringify(data, null, 2))
        console.log("[v0] Total count:", data.count)
        console.log("[v0] Has next:", !!data.next)
        console.log("[v0] Has previous:", !!data.previous)
        console.log("[v0] Results object:", data.results)

        if (data.results) {
          console.log("[v0] Category name:", data.results.name)
          console.log("[v0] Category description:", data.results.description)
          console.log("[v0] Books count:", data.results.books_count)
          console.log("[v0] Latest books array:", data.results.latest_books)
          console.log("[v0] Latest books length:", data.results.latest_books?.length || 0)

          if (data.results.latest_books && data.results.latest_books.length > 0) {
            console.log("[v0] First book:", data.results.latest_books[0])
          } else {
            console.log("[v0] WARNING: No books in latest_books array!")
          }
        } else {
          console.log("[v0] ERROR: No results object in API response!")
        }

        setCategory(data.results)
        setTotalCount(data.count)
        setHasNext(!!data.next)
        setHasPrevious(!!data.previous)

        if (data.results.id) {
          setCurrentCategoryId(data.results.id)
          console.log("[v0] Stored category ID:", data.results.id)
        }

        const currentSlugForLang =
          lang === "uz" ? data.results.slug_uz : lang === "ru" ? data.results.slug_ru : data.results.slug_en

        console.log("[v0] Current slug for lang:", currentSlugForLang)
        console.log("[v0] URL slug:", slug)

        if (currentSlugForLang && currentSlugForLang !== slug) {
          console.log("[v0] Slugs are different! Updating URL...")
          router.replace(`/${lang}/books-category/${currentSlugForLang}?page=${currentPage}`)
        }

        prevLang.current = lang

        console.log("[v0] ===== BOOK CATEGORY FETCH COMPLETED =====")
      } catch (err) {
        console.error("[v0] ===== BOOK CATEGORY FETCH ERROR =====")
        console.error("[v0] Error loading category:", err)
        console.error("[v0] Error type:", err instanceof Error ? err.constructor.name : typeof err)
        if (err instanceof Error) {
          console.error("[v0] Error message:", err.message)
          console.error("[v0] Error stack:", err.stack)
        }
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
        console.log("[v0] Loading state set to false")
      }
    }

    if (slug) {
      console.log("[v0] Slug exists, starting fetch...")
      fetchCategoryData()
    } else {
      console.log("[v0] No slug provided!")
    }
  }, [slug, lang, currentPage, router])

  const totalPages = Math.ceil(totalCount / booksPerPage)
  const currentBooks = category?.latest_books || []

  console.log("[v0] ===== RENDER STATE =====")
  console.log("[v0] Loading:", loading)
  console.log("[v0] Error:", error)
  console.log("[v0] Category:", category)
  console.log("[v0] Current books:", currentBooks)
  console.log("[v0] Current books length:", currentBooks.length)
  console.log("[v0] Total pages:", totalPages)

  const handlePageChange = (pageNumber: number) => {
    console.log("[v0] Page change requested:", pageNumber)
    router.push(`/${lang}/books-category/${slug}?page=${pageNumber}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg text-muted-foreground">{t.loading}</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              onClick={() => router.push(`/${lang}/books-category`)}
              className="mb-8 hover:bg-blue-50 hover:text-blue-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToBooks}
            </Button>
            <Card className="text-center py-12">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-red-100 rounded-full w-fit">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
                <CardTitle className="text-red-600">Error Loading Category</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!category) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              onClick={() => router.push(`/${lang}/books-category`)}
              className="mb-8 hover:bg-blue-50 hover:text-blue-600"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToBooks}
            </Button>
            <Card className="text-center py-12">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-muted rounded-full w-fit">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle>Category Not Found</CardTitle>
                <CardDescription>The requested category could not be found.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/${lang}/books-category`)}
            className="mb-8 hover:bg-blue-50 hover:text-blue-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToBooks}
          </Button>

          <div className="mb-12 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-primary/20 rounded-2xl shadow-lg">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {category.name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="text-base px-4 py-1.5">
                    {totalCount} {t.booksInCategory}
                  </Badge>
                </div>
                {category.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{category.description}</p>
                )}
              </div>
            </div>
          </div>

          {currentBooks && currentBooks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {currentBooks.map((book) => (
                  <BookCard key={book.slug_uz} book={book} lang={lang} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-6 pt-12 mt-12 border-t-2 border-primary/20">
                  {/* Pagination controls */}
                  <div className="flex flex-wrap justify-center items-center gap-2">
                    {/* Previous button */}
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevious}
                      className="gap-2 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span className="hidden sm:inline font-semibold">{t.previous}</span>
                    </Button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {getPageNumbers().map((page, index) => {
                        if (page === "...") {
                          return (
                            <div key={`ellipsis-${index}`} className="px-3 py-2 text-muted-foreground">
                              ...
                            </div>
                          )
                        }
                        const pageNum = page as number
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="lg"
                            onClick={() => handlePageChange(pageNum)}
                            className={`min-w-[44px] transition-all ${
                              currentPage === pageNum
                                ? "bg-primary text-white shadow-lg scale-110"
                                : "hover:bg-primary/10"
                            }`}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>

                    {/* Next button */}
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNext}
                      className="gap-2 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="hidden sm:inline font-semibold">{t.next}</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="text-center py-12">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-muted rounded-full w-fit">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle>{t.noBooksYet}</CardTitle>
                <CardDescription>{t.noBooksDescription}</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

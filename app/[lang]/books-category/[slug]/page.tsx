"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, BookOpen, Lock, ChevronLeft, ChevronRight } from "lucide-react"
import { isAuthenticated } from "@/lib/auth"
import { BookCard } from "@/components/book-card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

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

export default function BookCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const lang = params.lang as string
  const slug = params.slug as string
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [category, setCategory] = useState<BookCategoryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 9

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated()
      setIsLoggedIn(authStatus)

      if (!authStatus) {
        router.push(`/${lang}/login?returnUrl=${encodeURIComponent(`/${lang}/books/${slug}`)}`)
      }
    }

    checkAuth()
  }, [lang, slug, router])

  useEffect(() => {
    const fetchCategory = async () => {
      if (!isLoggedIn) return

      try {
        setLoading(true)
        const token = localStorage.getItem("access_token")

        console.log("[v0] ===== BOOK CATEGORY FETCH STARTED =====")
        console.log("[v0] Current language:", lang)
        console.log("[v0] Current slug from URL:", slug)

        const apiUrl = `https://artculture.pythonanywhere.com/${lang}/book-categories/${slug}/`
        console.log("[v0] Fetching category from:", apiUrl)

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch category")
        }

        const data = await response.json()
        console.log("[v0] Category data:", data)
        setCategory(data)
      } catch (err) {
        console.error("[v0] Category fetch error:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [lang, slug, isLoggedIn])

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                <Lock className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">{t.loginRequired}</CardTitle>
              <CardDescription className="text-base">{t.loginToView}</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </>
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-10 w-48 mb-8" />
            <Skeleton className="h-12 w-96 mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !category) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "Category not found"}</p>
            <Button onClick={() => router.push(`/${lang}/books-category`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToBooks}
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = category?.latest_books?.slice(indexOfFirstBook, indexOfLastBook) || []
  const totalPages = Math.ceil((category?.latest_books?.length || 0) / booksPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
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
                    {category.books_count} {t.booksInCategory}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{category.description}</p>
              </div>
            </div>
          </div>

          {category.latest_books && category.latest_books.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentBooks.map((book) => (
                  <BookCard key={book.slug_uz} book={book} lang={lang} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t.previous}
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="min-w-[40px]"
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    {t.next}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
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

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader } from "@/components/Loader"
import { BookOpen, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookCard } from "@/components/book-card"

const translations = {
  uz: {
    pageTitle: "Kitoblar",
    pageDescription: "Ilmiy kitoblar va darsliklar to'plami. Turli sohalardagi eng so'nggi nashrlar.",
    loading: "Kitoblar yuklanmoqda...",
    noBooks: "Hozircha kitoblar mavjud emas",
    noBooksDesc: "Tez orada yangi kitoblar qo'shiladi.",
    booksCount: "kitob",
    viewBooks: "Kitoblarni ko'rish",
  },
  ru: {
    pageTitle: "Книги",
    pageDescription: "Сборник научных книг и учебников. Последние публикации из различных областей.",
    loading: "Загрузка книг...",
    noBooks: "Пока нет доступных книг",
    noBooksDesc: "Скоро будут добавлены новые книги.",
    booksCount: "книг",
    viewBooks: "Посмотреть книги",
  },
  en: {
    pageTitle: "Books",
    pageDescription: "Collection of scientific books and textbooks. Latest publications from various fields.",
    loading: "Loading books...",
    noBooks: "No books available yet",
    noBooksDesc: "New books will be added soon.",
    booksCount: "books",
    viewBooks: "View Books",
  },
}

interface BookCategory {
  slug_uz: string
  slug_en: string
  slug_ru: string
  name: string
  books_count: number
  description: string
}

export default function BooksPage() {
  const params = useParams()
  const lang = (params.lang as string) || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [bookCategories, setBookCategories] = useState<BookCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBookCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const token = localStorage.getItem("access_token")

        const response = await fetch(`https://artculture.pythonanywhere.com/${lang}/book-categories/`, {
          method: "GET",
          headers: {
            accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          mode: "cors",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setBookCategories(data)
      } catch (err) {
        console.error("[v0] Error loading book categories:", err)
        if (err instanceof TypeError && err.message.includes("fetch")) {
          setError("Django server bilan bog'lanish xatoligi. Server ishlamayapti yoki CORS sozlamalari noto'g'ri.")
        } else {
          setError(err instanceof Error ? err.message : "Kitoblarni yuklashda xatolik yuz berdi")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadBookCategories()
  }, [lang])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{t.pageTitle}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t.pageDescription}</p>
        </div>

        {isLoading ? (
          <Loader message={t.loading} />
        ) : error ? (
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-center">{error}</AlertDescription>
          </Alert>
        ) : bookCategories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t.noBooks}</h3>
            <p className="text-muted-foreground">{t.noBooksDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookCategories.map((category) => (
              <BookCard key={category.slug_uz} category={category} lang={lang} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

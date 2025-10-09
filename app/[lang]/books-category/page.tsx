"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader } from "@/components/Loader"
import { BookOpen, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookCategoryCard } from "@/components/book-category-card"

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

        const url = `https://artculture.pythonanywhere.com/${lang}/book-categories/`

        const response = await fetch(url, {
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
        console.error("Error loading book categories:", err)
        if (err instanceof TypeError && err.message.includes("fetch")) {
          setError(`Serverga ulanishda xatolik. Iltimos, internet aloqangizni tekshiring yoki keyinroq urinib ko'ring.`)
        } else if (err instanceof Error && err.message.includes("401")) {
          setError(`Autentifikatsiya xatoligi. Iltimos, qaytadan tizimga kiring.`)
        } else if (err instanceof Error && err.message.includes("403")) {
          setError(`Ruxsat yo'q. Bu sahifaga kirish uchun huquqingiz yo'q.`)
        } else if (err instanceof Error && err.message.includes("404")) {
          setError(`Ma'lumot topilmadi. API endpoint mavjud emas.`)
        } else {
          setError(err instanceof Error ? `Xatolik: ${err.message}` : "Kitoblarni yuklashda xatolik yuz berdi")
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
              <BookCategoryCard key={category.slug_uz} category={category} lang={lang} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

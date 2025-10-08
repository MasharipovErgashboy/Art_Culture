"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, FileText, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const translations = {
  uz: {
    author: "Muallif",
    year: "Yil",
    pages: "Sahifalar",
    isbn: "ISBN",
    readBook: "Kitobni o'qish",
  },
  ru: {
    author: "Автор",
    year: "Год",
    pages: "Страницы",
    isbn: "ISBN",
    readBook: "Читать книгу",
  },
  en: {
    author: "Author",
    year: "Year",
    pages: "Pages",
    isbn: "ISBN",
    readBook: "Read Book",
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

interface BookCardProps {
  book: Book
  lang: string
}

export function BookCard({ book, lang }: BookCardProps) {
  const t = translations[lang as keyof typeof translations] || translations.uz
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  const getBookSlug = () => {
    if (lang === "uz") return book.slug_uz
    if (lang === "ru") return book.slug_ru
    if (lang === "en") return book.slug_en
    return book.slug_uz
  }

  const handleReadBook = () => {
    const slug = getBookSlug()
    router.push(`/${lang}/books/${slug}`)
  }

  const getImageUrl = () => {
    if (!book.image) return null
    if (book.image.startsWith("http")) return book.image
    const url = `https://artculture.pythonanywhere.com${book.image}`
    console.log("[v0] Book image URL:", url)
    return url
  }

  const imageUrl = getImageUrl()

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={book.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.log("[v0] Image failed to load:", imageUrl)
              setImageError(true)
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <BookOpen className="h-20 w-20 text-primary/40" />
          </div>
        )}
      </div>

      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {book.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          <User className="h-3 w-3" />
          <span className="line-clamp-1">{book.author_name}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2 pt-0 flex-1 flex flex-col pb-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{book.year}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>
              {book.page_count} {t.pages}
            </span>
          </div>
        </div>

        {book.isbn && (
          <div className="text-xs text-muted-foreground line-clamp-1">
            <span className="font-semibold">{t.isbn}:</span> {book.isbn}
          </div>
        )}

        <Button variant="default" size="sm" className="w-full mt-auto" onClick={handleReadBook}>
          <BookOpen className="mr-2 h-3.5 w-3.5" />
          {t.readBook}
        </Button>
      </CardContent>
    </Card>
  )
}

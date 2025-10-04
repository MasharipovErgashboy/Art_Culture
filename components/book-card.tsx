"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Library, BookOpen, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

const translations = {
  uz: {
    booksCount: "kitob",
    viewBooks: "Kitoblarni ko'rish",
  },
  ru: {
    booksCount: "книг",
    viewBooks: "Посмотреть книги",
  },
  en: {
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

interface BookCardProps {
  category: BookCategory
  lang: string
}

export function BookCard({ category, lang }: BookCardProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const t = translations[lang as keyof typeof translations] || translations.uz

  const categorySlug = lang === "uz" ? category.slug_uz : lang === "ru" ? category.slug_ru : category.slug_en

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated()
      setIsLoggedIn(authStatus)
    }

    checkAuth()

    window.addEventListener("focus", checkAuth)
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("focus", checkAuth)
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const handleBookAccess = (e: React.MouseEvent) => {
    e.preventDefault()

    const authenticated = isAuthenticated()

    if (!authenticated) {
      router.push(`/${lang}/login?returnUrl=${encodeURIComponent(`/${lang}/books/${categorySlug}`)}`)
      return
    }

    router.push(`/${lang}/books/${categorySlug}`)
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-primary/30 hover:scale-[1.02] bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 flex items-center justify-center">
        <div className="text-center">
          <Library className="h-16 w-16 text-primary/40 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
          <Badge variant="secondary" className="text-sm font-semibold">
            {category.books_count} {t.booksCount}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Library className="h-4 w-4" />
            <span>
              {category.books_count} {t.booksCount}
            </span>
          </div>
        </div>
        <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {category.name}
        </CardTitle>
        <CardDescription className="line-clamp-3">{category.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleBookAccess}
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 group"
        >
          <span className="flex items-center gap-2">
            {!isLoggedIn && <Lock className="h-4 w-4" />}
            {t.viewBooks}
          </span>
        </Button>
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Library, Lock, ArrowRight } from "lucide-react"
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

interface BookCategoryCardProps {
  category: BookCategory
  lang: string
}

export function BookCategoryCard({ category, lang }: BookCategoryCardProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const t = translations[lang as keyof typeof translations] || translations.uz

  const categorySlug = lang === "uz" ? category.slug_uz : lang === "ru" ? category.slug_ru : category.slug_en

  const gradientColors = [
    "from-blue-100 to-indigo-200",
    "from-purple-100 to-pink-200",
    "from-orange-100 to-amber-200",
    "from-green-100 to-emerald-200",
    "from-indigo-100 to-violet-200",
    "from-red-100 to-rose-200",
  ]

  const iconColors = [
    "text-blue-600",
    "text-purple-600",
    "text-orange-600",
    "text-green-600",
    "text-indigo-600",
    "text-red-600",
  ]

  const badgeColors = ["bg-blue-600", "bg-purple-600", "bg-orange-600", "bg-green-600", "bg-indigo-600", "bg-red-600"]

  const colorIndex = category.name.length % gradientColors.length
  const gradientClass = gradientColors[colorIndex]
  const iconColorClass = iconColors[colorIndex]
  const badgeColorClass = badgeColors[colorIndex]

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
      router.push(`/${lang}/login?returnUrl=${encodeURIComponent(`/${lang}/books-category/${categorySlug}`)}`)
      return
    }

    router.push(`/${lang}/books-category/${categorySlug}`)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
      <div className={`relative h-48 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
        <div className="text-center">
          <Library className={`h-20 w-20 ${iconColorClass} mx-auto mb-3`} />
          <Badge className={`${badgeColorClass} text-white`}>
            {category.books_count} {t.booksCount}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">{category.name}</h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{category.description}</p>

        <Button onClick={handleBookAccess} className="w-full" size="sm">
          {!isLoggedIn && <Lock className="h-4 w-4 mr-1" />}
          {t.viewBooks}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  )
}

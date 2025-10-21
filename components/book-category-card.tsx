"use client"
import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { BookCategory } from "@/lib/api"

interface BookCategoryCardProps {
  category: BookCategory & { image?: string | null }
  lang: string
}

export function BookCategoryCard({ category, lang }: BookCategoryCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const slug = lang === "uz" ? category.slug_uz : lang === "ru" ? category.slug_ru : category.slug_en

  const translations = {
    uz: { books: "kitob", viewBooks: "Kitoblarni ko'rish", noImage: "Rasm mavjud emas" },
    ru: { books: "книг", viewBooks: "Посмотреть книги", noImage: "Изображение недоступно" },
    en: { books: "books", viewBooks: "View Books", noImage: "No image available" },
  }

  const t = translations[lang as keyof typeof translations] || translations.en

  const imageUrl = category.image ? `https://artculture.pythonanywhere.com${category.image}` : null

  return (
    <Link href={`/${lang}/books-category/${slug}`} className="block group">
      <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-primary/30 hover:scale-[1.02] bg-white/80 backdrop-blur-sm overflow-hidden h-full flex flex-col">
        {imageUrl && !imageError ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse">
                  <BookOpen className="h-12 w-12 text-primary/30" />
                </div>
              </div>
            )}
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={category.name}
              fill
              className={`object-cover group-hover:scale-105 transition-all duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              onLoad={() => setImageLoaded(true)}
              unoptimized
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-primary/40 mx-auto mb-4" />
              <p className="text-primary/60 font-medium">{t.noImage}</p>
            </div>
          </div>
        )}

        <CardHeader className="pb-4 flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/15 to-primary/10 group-hover:from-primary/25 group-hover:to-primary/15 transition-all duration-300">
              <span className="text-sm font-bold text-primary">
                {category.books_count} {t.books}
              </span>
            </div>
          </div>

          <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {category.name}
          </CardTitle>

          <CardDescription className="line-clamp-3 leading-relaxed">{category.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300">
            <span className="flex items-center justify-between w-full">
              <span>{t.viewBooks}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

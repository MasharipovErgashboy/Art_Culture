import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BookCategory } from "@/lib/api"

interface BookCategoryCardProps {
  category: BookCategory
  lang: string
}

export function BookCategoryCard({ category, lang }: BookCategoryCardProps) {
  const slug = lang === "uz" ? category.slug_uz : lang === "ru" ? category.slug_ru : category.slug_en

  const translations = {
    uz: { books: "kitob", viewBooks: "Kitoblarni ko'rish" },
    ru: { books: "книг", viewBooks: "Посмотреть книги" },
    en: { books: "books", viewBooks: "View Books" },
  }

  const t = translations[lang as keyof typeof translations] || translations.en

  return (
    <Link href={`/${lang}/books-category/${slug}`} className="block group">
      <Card className="relative h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] bg-white">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="relative pb-4 space-y-4">
          {/* Icon with animated background */}
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Sparkle icon for visual interest */}
            <Sparkles className="h-5 w-5 text-primary/40 group-hover:text-primary group-hover:scale-125 transition-all duration-500" />
          </div>

          {/* Title with better typography */}
          <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
            {category.name}
          </CardTitle>

          {/* Books count badge with modern design */}
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-primary/10 group-hover:from-primary/25 group-hover:to-primary/15 transition-all duration-300 shadow-sm">
              <span className="text-sm font-bold text-primary flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {category.books_count} {t.books}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Description with better readability */}
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 leading-relaxed min-h-[4.5rem]">
            {category.description}
          </CardDescription>

          {/* Modern button with gradient and animation */}
          <Button className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary text-white shadow-md hover:shadow-xl transition-all duration-300 group-hover:translate-y-[-2px] font-semibold">
            <span className="flex items-center justify-between w-full">
              <span>{t.viewBooks}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Button>
        </CardContent>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Card>
    </Link>
  )
}

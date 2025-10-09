import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BookCategory } from "@/lib/api"

interface BookCategoryCardProps {
  category: BookCategory
  lang: string
}

export function BookCategoryCard({ category, lang }: BookCategoryCardProps) {
  // Get the correct slug for the current language
  const slug = lang === "uz" ? category.slug_uz : lang === "ru" ? category.slug_ru : category.slug_en

  const translations = {
    uz: { books: "kitob", viewBooks: "Kitoblarni ko'rish" },
    ru: { books: "книг", viewBooks: "Посмотреть книги" },
    en: { books: "books", viewBooks: "View Books" },
  }

  const t = translations[lang as keyof typeof translations] || translations.en

  return (
    <Link href={`/${lang}/books-category/${slug}`} className="block group">
      <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                {category.name}
              </CardTitle>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <span className="text-sm font-semibold text-primary">
                {category.books_count} {t.books}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {category.description}
          </CardDescription>

          <Button
            variant="ghost"
            className="w-full justify-between group-hover:bg-primary/10 transition-all duration-300 group-hover:translate-x-1"
          >
            <span className="font-medium">{t.viewBooks}</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </CardContent>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Card>
    </Link>
  )
}
  
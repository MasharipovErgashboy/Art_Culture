import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import type { BookCategory } from "@/lib/api"

interface BookCategoryCardProps {
  category: BookCategory
  lang: string
}

export function BookCategoryCard({ category, lang }: BookCategoryCardProps) {
  // Get the correct slug for the current language
  const slug = lang === "uz" ? category.slug_uz : lang === "ru" ? category.slug_ru : category.slug_en

  return (
    <Link href={`/${lang}/books-category/${slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">{category.name}</CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {category.books_count} {lang === "uz" ? "kitob" : lang === "ru" ? "книг" : "books"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{category.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, User } from "lucide-react"
import Image from "next/image"
import type { Author } from "@/lib/api"

const translations = {
  uz: {
    books: "kitob",
    journals: "jurnal",
    noImage: "Rasm mavjud emas",
  },
  ru: {
    books: "книг",
    journals: "журналов",
    noImage: "Изображение недоступно",
  },
  en: {
    books: "books",
    journals: "journals",
    noImage: "No image available",
  },
}

interface AuthorCardProps {
  author: Author
  lang: string
}

export function AuthorCard({ author, lang }: AuthorCardProps) {
  const t = translations[lang as keyof typeof translations] || translations.uz
  const imageUrl = author.image ? `https://artculture.pythonanywhere.com${author.image}` : null

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-primary/30 hover:scale-[1.02] bg-white/80 backdrop-blur-sm overflow-hidden">
      {imageUrl ? (
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={author.name}
            fill
            className="object-cover group-hover:scale-105 transition-all duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 flex items-center justify-center">
          <div className="text-center">
            <User className="h-20 w-20 text-primary/40 mx-auto mb-4" />
            <p className="text-primary/60 font-medium">{t.noImage}</p>
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>
                {author.books_count} {t.books}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>
                {author.journals_count} {t.journals}
              </span>
            </div>
          </div>
        </div>
        <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {author.name}
        </CardTitle>
        <CardDescription className="line-clamp-3" dangerouslySetInnerHTML={{ __html: author.description }} />
      </CardHeader>
    </Card>
  )
}

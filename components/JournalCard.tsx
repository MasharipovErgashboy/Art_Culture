"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText } from "lucide-react"
import Image from "next/image"
import type { Journal } from "@/lib/api"
import { getSlugForLang } from "@/lib/api"
import Link from "next/link"

const translations = {
  uz: {
    issues: "son",
    noImage: "Rasm mavjud emas",
    viewJournal: "Jurnalni ko'rish",
  },
  ru: {
    issues: "выпуск",
    noImage: "Изображение недоступно",
    viewJournal: "Просмотреть журнал",
  },
  en: {
    issues: "issues",
    noImage: "No image available",
    viewJournal: "View Journal",
  },
}

interface JournalCardProps {
  journal: Journal
  lang: string
}

export function JournalCard({ journal, lang }: JournalCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const t = translations[lang as keyof typeof translations] || translations.uz

  const imageUrl = journal.image ? `https://artculture.pythonanywhere.com${journal.image}` : null
  const journalSlug = getSlugForLang(journal, lang)

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-primary/30 hover:scale-[1.02] bg-white/80 backdrop-blur-sm overflow-hidden">
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
            alt={journal.name}
            fill
            className={`object-cover group-hover:scale-105 transition-all duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              setImageError(true)
            }}
            onLoad={() => {
              setImageLoaded(true)
            }}
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

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>
              {journal.issues_count} {t.issues}
            </span>
          </div>
        </div>
        <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {journal.name}
        </CardTitle>
        <CardDescription className="line-clamp-3" dangerouslySetInnerHTML={{ __html: journal.description }} />
      </CardHeader>
      <CardContent>
        <Button
          asChild
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Link href={`/${lang}/journals/${journalSlug}`}>{t.viewJournal}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

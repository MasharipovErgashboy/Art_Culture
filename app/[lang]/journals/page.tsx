"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JournalCard } from "@/components/JournalCard"
import { Loader } from "@/components/Loader"
import { fetchJournals, type Journal } from "@/lib/api"
import { BookOpen, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const translations = {
  uz: {
    pageTitle: "Ilmiy Jurnallar",
    pageDescription:
      "Eng so'nggi ilmiy tadqiqotlar va maqolalar to'plami. Turli sohalardagi ekspert fikrlari va yangiliklar.",
    loading: "Jurnallar yuklanmoqda...",
    noJournals: "Hozircha jurnallar mavjud emas",
    noJournalsDesc: "Tez orada yangi jurnallar qo'shiladi.",
  },
  ru: {
    pageTitle: "Научные Журналы",
    pageDescription:
      "Сборник последних научных исследований и статей. Экспертные мнения и новости из различных областей.",
    loading: "Загрузка журналов...",
    noJournals: "Пока нет доступных журналов",
    noJournalsDesc: "Скоро будут добавлены новые журналы.",
  },
  en: {
    pageTitle: "Scientific Journals",
    pageDescription:
      "Collection of the latest scientific research and articles. Expert opinions and news from various fields.",
    loading: "Loading journals...",
    noJournals: "No journals available yet",
    noJournalsDesc: "New journals will be added soon.",
  },
}

export default function JournalsPage() {
  const params = useParams()
  const lang = (params.lang as string) || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [journals, setJournals] = useState<Journal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadJournals = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchJournals(lang)
        setJournals(data)
      } catch (err) {
        console.error("[v0] Error loading journals:", err)
        if (err instanceof TypeError && err.message.includes("fetch")) {
          setError("Django server bilan bog'lanish xatoligi. Server ishlamayapti yoki CORS sozlamalari noto'g'ri.")
        } else {
          setError(err instanceof Error ? err.message : "Jurnallarni yuklashda xatolik yuz berdi")
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadJournals()
  }, [lang])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Content */}
        {isLoading ? (
          <Loader message={t.loading} />
        ) : error ? (
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-center">{error}</AlertDescription>
          </Alert>
        ) : journals.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t.noJournals}</h3>
            <p className="text-muted-foreground">{t.noJournalsDesc}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journals.map((journal) => (
              <JournalCard key={journal.slug_uz} journal={journal} lang={lang} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

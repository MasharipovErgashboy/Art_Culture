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

export default function JournalsPage() {
  const params = useParams()
  const lang = (params.lang as string) || "en"

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
        console.error("Error loading journals:", err)
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
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Ilmiy Jurnallar</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Eng so'nggi ilmiy tadqiqotlar va maqolalar to'plami. Turli sohalardagi ekspert fikrlari va yangiliklar.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <Loader message="Jurnallar yuklanmoqda..." />
        ) : error ? (
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-center">{error}</AlertDescription>
          </Alert>
        ) : journals.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">Hozircha jurnallar mavjud emas</h3>
            <p className="text-muted-foreground">Tez orada yangi jurnallar qo'shiladi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journals.map((journal) => (
              <JournalCard key={journal.id} journal={journal} lang={lang} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
} 

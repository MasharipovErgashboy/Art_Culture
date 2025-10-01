"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SectionList } from "@/components/SectionList"
import { Loader } from "@/components/Loader"
import { fetchJournalIssue, fetchJournalSections, type JournalIssue, type JournalSection } from "@/lib/api"
import { Calendar, AlertCircle, ArrowLeft, Download, FileText, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { decodeHtmlEntities } from "@/lib/utils"

export default function JournalIssueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as string) || "en"
  const slug = params.slug as string

  const [issue, setIssue] = useState<JournalIssue | null>(null)
  const [sections, setSections] = useState<JournalSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE = "http://127.0.0.1:8000"

  useEffect(() => {
    const loadIssueData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load issue details, then use issue name to fetch sections
        const issueData = await fetchJournalIssue(slug, lang)
        setIssue(issueData)

        const sectionsData = await fetchJournalSections(issueData.name, lang)
        setSections(sectionsData)
      } catch (err) {
        console.error("Error loading issue data:", err)
        if (err instanceof TypeError && err.message.includes("fetch")) {
          setError("Django server bilan bog'lanish xatoligi. Server ishlamayapti yoki CORS sozlamalari noto'g'ri.")
        } else {
          setError(err instanceof Error ? err.message : "Jurnal soni ma'lumotlarini yuklashda xatolik yuz berdi")
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      loadIssueData()
    }
  }, [slug, lang])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Loader message="Jurnal soni ma'lumotlari yuklanmoqda..." />
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-center">{error}</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">Jurnal soni topilmadi</h3>
            <p className="text-muted-foreground mb-4">So'ralgan jurnal soni mavjud emas yoki o'chirilgan.</p>
            <Button asChild>
              <Link href={`/${lang}/journals`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Jurnallar ro'yxatiga qaytish
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="group hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Orqaga qaytish
          </Button>
        </div>

        {/* Issue Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{issue.sections_count} bo'lim</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{sections.length} muallif</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">{issue.name}</CardTitle>
            <CardDescription className="text-lg">
              {issue.description
                ? decodeHtmlEntities(
                    issue.description
                      .replace(/<[^>]*>/g, "") // Remove HTML tags
                      .replace(/\s+/g, " ") // Replace multiple spaces with single space
                      .trim(),
                  )
                : "Tavsif mavjud emas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {issue.pdf_file && (
              <Button asChild className="w-full sm:w-auto">
                <a href={`${API_BASE}${issue.pdf_file}`} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  To'liq PDF ni yuklab olish
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Bo'limlar va mualliflar</h2>
          <SectionList sections={sections} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

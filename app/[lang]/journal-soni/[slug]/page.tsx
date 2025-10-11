"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader } from "@/components/Loader"
import { fetchJournalIssue, fetchJournalSections, type JournalIssue, type JournalSection } from "@/lib/api"
import { Calendar, AlertCircle, ArrowLeft, Download, FileText, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { decodeHtmlEntities } from "@/lib/utils"
import { PDFViewer } from "@/components/pdf-viewer"

const translations = {
  uz: {
    loading: "Jurnal soni ma'lumotlari yuklanmoqda...",
    goBack: "Orqaga qaytish",
    sections: "bo'lim",
    authors: "muallif",
    downloadPdf: "PDF ni ochish",
    sectionsAndAuthors: "Bo'limlar va mualliflar",
    noDescription: "Tavsif mavjud emas",
    notFound: "Jurnal soni topilmadi",
    notFoundDesc: "So'ralgan jurnal soni mavjud emas yoki o'chirilgan.",
    returnToJournals: "Jurnallar ro'yxatiga qaytish",
  },
  ru: {
    loading: "Загрузка информации о выпуске журнала...",
    goBack: "Назад",
    sections: "разделов",
    authors: "авторов",
    downloadPdf: "Открыть PDF",
    sectionsAndAuthors: "Разделы и авторы",
    noDescription: "Описание недоступно",
    notFound: "Выпуск журнала не найден",
    notFoundDesc: "Запрашиваемый выпуск не существует или был удален.",
    returnToJournals: "Вернуться к списку журналов",
  },
  en: {
    loading: "Loading journal issue information...",
    goBack: "Go Back",
    sections: "sections",
    authors: "authors",
    downloadPdf: "Open PDF",
    sectionsAndAuthors: "Sections and Authors",
    noDescription: "No description available",
    notFound: "Journal issue not found",
    notFoundDesc: "The requested journal issue does not exist or has been deleted.",
    returnToJournals: "Return to Journals List",
  },
}

function SectionList({ sections, lang }: { sections: JournalSection[]; lang: string }) {
  if (sections.length === 0) {
    return null
  }

  const getSlugForLang = (section: JournalSection, lang: string): string => {
    if (lang === "uz") return section.slug_uz
    if (lang === "ru") return section.slug_ru
    if (lang === "en") return section.slug_en
    return section.slug_uz
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const sectionSlug = getSlugForLang(section, lang)
        return (
          <Link key={section.id || index} href={`/${lang}/section/${sectionSlug}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{section.author_name}</h3>
                    {section.pdf && (
                      <p className="text-sm text-muted-foreground">
                        <FileText className="inline h-4 w-4 mr-1" />
                        PDF mavjud
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

export default function JournalIssueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as string) || "en"
  const slug = params.slug as string
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [issue, setIssue] = useState<JournalIssue | null>(null)
  const [sections, setSections] = useState<JournalSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)

  const API_BASE = "https://artculture.pythonanywhere.com"

  useEffect(() => {
    const loadIssueData = async () => {
      try {
        setIsLoading(true)
        setError(null)

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

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [pdfBlobUrl])

  const handlePdfClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const token = localStorage.getItem("access_token")

    if (!token) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
      return
    }

    try {
      const response = await fetch(`${API_BASE}/${lang}/journal-issue/${slug}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/${lang}/login?returnUrl=${returnUrl}`)
        return
      }

      if (response.status === 403) {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/${lang}/buy/?subscription_type_id=1&returnUrl=${returnUrl}`)
        return
      }

      if (!response.ok) {
        alert("PDF yuklanishida xatolik yuz berdi")
        return
      }

      const pdfBlob = await response.blob()
      const blobUrl = URL.createObjectURL(pdfBlob)
      setPdfBlobUrl(blobUrl)
      setShowPDFViewer(true)
    } catch (error) {
      console.error("[v0] Error fetching PDF:", error)
      alert("PDF yuklanishida xatolik yuz berdi")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Loader message={t.loading} />
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
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t.notFound}</h3>
            <p className="text-muted-foreground mb-4">{t.notFoundDesc}</p>
            <Button asChild>
              <Link href={`/${lang}/journals`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.returnToJournals}
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
            {t.goBack}
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>
                    {issue.sections_count} {t.sections}
                  </span>
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">{issue.name}</CardTitle>
            <CardDescription className="text-lg">
              {issue.description
                ? decodeHtmlEntities(
                    issue.description
                      .replace(/<[^>]*>/g, "")
                      .replace(/\s+/g, " ")
                      .trim(),
                  )
                : t.noDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {issue.pdf_file && (
              <Button asChild className="w-full sm:w-auto">
                <a href="#" onClick={handlePdfClick}>
                  <Download className="h-4 w-4 mr-2" />
                  {t.downloadPdf}
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        {sections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                {t.sectionsAndAuthors}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SectionList sections={sections} lang={lang} />
            </CardContent>
          </Card>
        )}
      </main>

      {showPDFViewer && pdfBlobUrl && (
        <PDFViewer
          pdfUrl={pdfBlobUrl}
          onClose={() => {
            setShowPDFViewer(false)
            if (pdfBlobUrl) {
              URL.revokeObjectURL(pdfBlobUrl)
              setPdfBlobUrl(null)
            }
          }}
          title={issue?.name}
        />
      )}

      <Footer />
    </div>
  )
}

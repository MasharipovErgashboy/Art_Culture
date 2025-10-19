"use client"

import Link from "next/link"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader } from "@/components/Loader"
import { fetchJournalIssue, fetchJournalSections, type JournalIssue, type JournalSection } from "@/lib/api"
import { fetchWithAuth } from "@/lib/auth"
import { Calendar, AlertCircle, ArrowLeft, Download, FileText, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)
  const [loadingPdfId, setLoadingPdfId] = useState<number | null>(null)
  const [currentPdfTitle, setCurrentPdfTitle] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [pdfBlobUrl])

  if (sections.length === 0) {
    return null
  }

  const API_BASE = "https://artculture.pythonanywhere.com"

  const handlePdfClick = async (section: JournalSection) => {
    if (!section.pdf) {
      alert("PDF mavjud emas")
      return
    }

    // Check authentication
    const token = localStorage.getItem("access_token")
    if (!token) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
      return
    }

    // The section data might have a different slug than what's in the URL
    const sectionSlug = section.slug_uz || section.slug_en || section.slug_ru

    if (!sectionSlug) {
      alert("PDF slug mavjud emas")
      return
    }

    setLoadingPdfId(section.id)
    setCurrentPdfTitle(section.author_name || "PDF")

    try {
      console.log("[v0] ========== SECTION PDF OPEN DEBUG ==========")
      console.log("[v0] Section data:", section)
      console.log("[v0] Section slug_uz:", section.slug_uz)
      console.log("[v0] Section slug_en:", section.slug_en)
      console.log("[v0] Section slug_ru:", section.slug_ru)
      console.log("[v0] Using slug:", sectionSlug)
      console.log("[v0] Fetching PDF from section API:", `${API_BASE}/${lang}/section/${sectionSlug}/`)

      const response = await fetch(`${API_BASE}/${lang}/section/${sectionSlug}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      // Handle authentication errors
      if (response.status === 401) {
        console.log("[v0] 401 Unauthorized - redirecting to login")
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/${lang}/login?returnUrl=${returnUrl}`)
        return
      }

      // Handle subscription errors
      if (response.status === 403) {
        console.log("[v0] 403 Forbidden - redirecting to buy page")
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/${lang}/buy?subscription_type_id=3&returnUrl=${returnUrl}`)
        return
      }

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorMessage = `HTTP error! status: ${response.status}`

        if (contentType?.includes("application/json")) {
          try {
            const errorData = await response.json()
            console.error("[v0] API error response (JSON):", errorData)
            errorMessage = errorData.detail || errorData.message || errorMessage
          } catch (e) {
            console.error("[v0] Could not parse error response as JSON")
          }
        }

        console.error("[v0] ========== ERROR OPENING PDF ==========")
        console.error("[v0] Error message:", errorMessage)
        throw new Error(errorMessage)
      }

      const pdfBlob = await response.blob()
      console.log("[v0] PDF blob received, size:", pdfBlob.size, "type:", pdfBlob.type)

      if (pdfBlob.size === 0) {
        console.error("[v0] PDF blob is empty")
        alert("PDF yuklanishida xatolik yuz berdi: Fayl bo'sh")
        return
      }

      // Clean up previous blob URL if exists
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }

      const blobUrl = URL.createObjectURL(pdfBlob)
      setPdfBlobUrl(blobUrl)
      setShowPDFViewer(true)
      console.log("[v0] ========== SECTION PDF OPEN SUCCESS ==========")
    } catch (error) {
      console.error("[v0] ========== ERROR OPENING PDF ==========")
      console.error("[v0] Error:", error)
      alert(`PDF ochishda xatolik: ${error instanceof Error ? error.message : "Noma'lum xatolik"}`)
    } finally {
      setLoadingPdfId(null)
    }
  }

  const handleClosePDF = () => {
    setShowPDFViewer(false)
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl)
      setPdfBlobUrl(null)
    }
  }

  return (
    <>
      <div className="space-y-4">
        {sections.map((section, index) => {
          const isLoading = loadingPdfId === section.id

          return (
            <Card
              key={section.id || index}
              className={`transition-shadow ${section.pdf ? "hover:shadow-md cursor-pointer hover:border-primary" : ""}`}
              onClick={() => !isLoading && section.pdf && handlePdfClick(section)}
            >
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
                        {isLoading ? "PDF yuklanmoqda..." : "PDF mavjud"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {showPDFViewer && pdfBlobUrl && (
        <PDFViewer pdfUrl={pdfBlobUrl} onClose={handleClosePDF} title={currentPdfTitle} />
      )}
    </>
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

    console.log("[v0] ========== JOURNAL ISSUE PDF OPEN DEBUG ==========")
    console.log("[v0] Journal issue data:", issue)
    console.log("[v0] URL slug parameter:", slug)
    console.log("[v0] Journal issue pdf_file from API:", issue?.pdf_file)
    console.log("[v0] Current language:", lang)

    const token = localStorage.getItem("access_token")
    console.log("[v0] Access token exists:", !!token)

    if (!token) {
      console.log("[v0] No token found, redirecting to login")
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
      return
    }

    if (!issue) {
      console.error("[v0] No journal issue data available")
      return
    }

    try {
      if (issue.pdf_file) {
        console.log("[v0] Attempting to fetch PDF directly from pdf_file path")
        const directPdfUrl = `${API_BASE}${issue.pdf_file}`
        console.log("[v0] Direct PDF URL:", directPdfUrl)

        try {
          const pdfResponse = await fetchWithAuth(directPdfUrl, {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          })

          console.log("[v0] Direct PDF response status:", pdfResponse.status)
          console.log("[v0] Direct PDF response ok:", pdfResponse.ok)

          if (pdfResponse.ok) {
            const pdfBlob = await pdfResponse.blob()
            console.log("[v0] PDF blob size:", pdfBlob.size)
            console.log("[v0] PDF blob type:", pdfBlob.type)

            if (pdfBlob.size > 0) {
              const blobUrl = URL.createObjectURL(pdfBlob)
              console.log("[v0] PDF blob URL created:", blobUrl)
              setPdfBlobUrl(blobUrl)
              setShowPDFViewer(true)
              console.log("[v0] ========== JOURNAL ISSUE PDF OPEN SUCCESS (DIRECT) ==========")
              return
            }
          }
        } catch (directError) {
          console.log("[v0] Direct PDF fetch failed, trying slug-based API:", directError)
        }
      }

      console.log("[v0] Attempting slug-based PDF API")
      const issueSlug = slug // Use URL slug directly
      console.log("[v0] Using URL slug for PDF:", issueSlug)

      const pdfUrl = `${API_BASE}/${lang}/journal-issue/${issueSlug}/`
      console.log("[v0] PDF URL:", pdfUrl)

      const pdfResponse = await fetchWithAuth(pdfUrl, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      })

      console.log("[v0] PDF response status:", pdfResponse.status)
      console.log("[v0] PDF response ok:", pdfResponse.ok)

      if (pdfResponse.status === 403) {
        console.log("[v0] 403 Forbidden - User needs subscription")
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/${lang}/buy/?subscription_type_id=1&returnUrl=${returnUrl}`)
        return
      }

      if (!pdfResponse.ok) {
        const contentType = pdfResponse.headers.get("content-type")
        let errorMessage = `HTTP error! status: ${pdfResponse.status}`

        if (contentType?.includes("application/json")) {
          try {
            const errorData = await pdfResponse.json()
            console.error("[v0] API error response (JSON):", errorData)
            errorMessage = errorData.detail || errorData.message || errorMessage
          } catch (e) {
            console.error("[v0] Could not parse error response as JSON")
          }
        }

        throw new Error(errorMessage)
      }

      const pdfBlob = await pdfResponse.blob()
      console.log("[v0] PDF blob size:", pdfBlob.size)

      if (pdfBlob.size === 0) {
        throw new Error("PDF fayli bo'sh")
      }

      const blobUrl = URL.createObjectURL(pdfBlob)
      console.log("[v0] PDF blob URL created:", blobUrl)
      setPdfBlobUrl(blobUrl)
      setShowPDFViewer(true)
      console.log("[v0] ========== JOURNAL ISSUE PDF OPEN SUCCESS ==========")
    } catch (error) {
      console.error("[v0] ========== JOURNAL ISSUE PDF OPEN ERROR ==========")
      console.error("[v0] Error:", error)
      if (error instanceof Error) {
        console.error("[v0] Error message:", error.message)
        alert(`PDF yuklanishida xatolik yuz berdi: ${error.message}`)
      } else {
        alert("PDF yuklanishida xatolik yuz berdi")
      }
      console.error("[v0] ========== JOURNAL ISSUE PDF OPEN ERROR END ==========")
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
              <SectionList sections={sections.slice(0, 5)} lang={lang} />
              {/* Always show "View All" button */}
              <div className="mt-6 text-center">
                <Button asChild variant="outline" size="lg">
                  <Link href={`/${lang}/journal-sections`}>
                    Barchasini ko'rish ({sections.length} {t.sections})
                  </Link>
                </Button>
              </div>
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

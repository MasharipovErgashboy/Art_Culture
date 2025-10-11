"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Calendar, AlertCircle, ArrowLeft, Download, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PDFViewer } from "@/components/pdf-viewer"

const translations = {
  uz: {
    loading: "Bo'lim ma'lumotlari yuklanmoqda...",
    goBack: "Orqaga qaytish",
    author: "Muallif",
    pages: "Sahifalar",
    downloadPdf: "PDF ni ochish",
    notFound: "Bo'lim topilmadi",
    notFoundDesc: "So'ralgan bo'lim mavjud emas yoki o'chirilgan.",
    returnToJournals: "Jurnallar ro'yxatiga qaytish",
    journalIssue: "Jurnal soni",
  },
  ru: {
    loading: "Загрузка информации о разделе...",
    goBack: "Назад",
    author: "Автор",
    pages: "Страницы",
    downloadPdf: "Открыть PDF",
    notFound: "Раздел не найден",
    notFoundDesc: "Запрашиваемый раздел не существует или был удален.",
    returnToJournals: "Вернуться к списку журналов",
    journalIssue: "Выпуск журнала",
  },
  en: {
    loading: "Loading section information...",
    goBack: "Go Back",
    author: "Author",
    pages: "Pages",
    downloadPdf: "Open PDF",
    notFound: "Section not found",
    notFoundDesc: "The requested section does not exist or has been deleted.",
    returnToJournals: "Return to Journals List",
    journalIssue: "Journal Issue",
  },
}

export default function SectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = (params.lang as string) || "uz"
  const slug = params.slug as string
  const t = translations[lang as keyof typeof translations] || translations.uz

  const authorName = searchParams.get("author") || ""
  const journalIssueName = searchParams.get("issue") || ""

  console.log("[v0] Section page loaded:", {
    lang,
    slug,
    authorName,
    journalIssueName,
    fullUrl: typeof window !== "undefined" ? window.location.href : "SSR",
  })
  // </CHANGE>

  const [isLoading, setIsLoading] = useState(false)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)

  const API_BASE = "https://artculture.pythonanywhere.com"

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [pdfBlobUrl])

  const handlePdfClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    console.log("[v0] PDF click handler called")

    const token = localStorage.getItem("access_token")

    if (!token) {
      console.log("[v0] No token found, redirecting to login")
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
      return
    }

    try {
      setIsLoading(true)
      console.log("[v0] Fetching PDF from:", `${API_BASE}/${lang}/section/${slug}/`)

      const response = await fetch(`${API_BASE}/${lang}/section/${slug}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("[v0] PDF fetch response:", {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get("content-type"),
      })

      if (response.status === 401) {
        console.log("[v0] 401 Unauthorized, clearing tokens and redirecting to login")
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/${lang}/login?returnUrl=${returnUrl}`)
        return
      }

      if (response.status === 403) {
        console.log("[v0] 403 Forbidden, redirecting to buy page")
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/${lang}/buy/?subscription_type_id=1&returnUrl=${returnUrl}`)
        return
      }

      if (!response.ok) {
        console.error("[v0] PDF fetch failed:", response.status, response.statusText)
        alert("PDF yuklanishida xatolik yuz berdi")
        return
      }

      console.log("[v0] PDF fetch successful, creating blob URL")
      const pdfBlob = await response.blob()
      const blobUrl = URL.createObjectURL(pdfBlob)
      console.log("[v0] Blob URL created:", blobUrl)
      setPdfBlobUrl(blobUrl)
      setShowPDFViewer(true)
    } catch (error) {
      console.error("[v0] Error fetching PDF:", error)
      alert("PDF yuklanishida xatolik yuz berdi")
    } finally {
      setIsLoading(false)
    }
  }

  if (!authorName) {
    console.log("[v0] No author name found in query params, showing not found message")
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t.notFound}</h3>
            <p className="text-muted-foreground mb-4">{t.notFoundDesc}</p>
            <Button asChild>
              <a href="#" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.goBack}
              </a>
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
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>
                    {t.author}: {authorName}
                  </span>
                </div>
                {journalIssueName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {t.journalIssue}: {journalIssueName}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">{authorName}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full sm:w-auto" disabled={isLoading}>
              <a href="#" onClick={handlePdfClick}>
                <Download className="h-4 w-4 mr-2" />
                {isLoading ? t.loading : t.downloadPdf}
              </a>
            </Button>
          </CardContent>
        </Card>
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
          title={authorName}
        />
      )}

      <Footer />
    </div>
  )
}

"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Loader } from "@/components/Loader"
import { PDFViewer } from "@/components/pdf-viewer"
import { fetchAllJournalSections, type JournalSection } from "@/lib/api"
import { getUser } from "@/lib/auth"
import { fetchWithAuth } from "@/lib/auth"
import { FileText, AlertCircle, Search, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const translations = {
  uz: {
    title: "Barcha jurnal bo'limlari",
    description: "Barcha jurnallarning barcha bo'limlari ro'yxati",
    loading: "Bo'limlar yuklanmoqda...",
    search: "Bo'limlarni qidirish...",
    noSections: "Hech qanday bo'lim topilmadi",
    noSectionsDesc: "Hozircha hech qanday jurnal bo'limi mavjud emas.",
    journalIssue: "Jurnal soni",
    author: "Muallif",
    pages: "Sahifalar",
    openPdf: "PDF ochish",
    sections: "bo'lim",
    loadingPdf: "PDF yuklanmoqda...",
    loginRequired: "Tizimga kirish talab qilinadi",
    subscriptionRequired: "Obuna talab qilinadi",
  },
  ru: {
    title: "Все разделы журналов",
    description: "Список всех разделов всех журналов",
    loading: "Загрузка разделов...",
    search: "Поиск разделов...",
    noSections: "Разделы не найдены",
    noSectionsDesc: "На данный момент нет доступных разделов журналов.",
    journalIssue: "Выпуск журнала",
    author: "Автор",
    pages: "Страницы",
    openPdf: "Открыть PDF",
    sections: "разделов",
    loadingPdf: "Загрузка PDF...",
    loginRequired: "Требуется вход в систему",
    subscriptionRequired: "Требуется подписка",
  },
  en: {
    title: "All Journal Sections",
    description: "List of all sections from all journals",
    loading: "Loading sections...",
    search: "Search sections...",
    noSections: "No sections found",
    noSectionsDesc: "There are no journal sections available at the moment.",
    journalIssue: "Journal Issue",
    author: "Author",
    pages: "Pages",
    openPdf: "Open PDF",
    sections: "sections",
    loadingPdf: "Loading PDF...",
    loginRequired: "Login required",
    subscriptionRequired: "Subscription required",
  },
}

export default function JournalSectionsPage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as string) || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [sections, setSections] = useState<JournalSection[]>([])
  const [filteredSections, setFilteredSections] = useState<JournalSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loadingPdfSlug, setLoadingPdfSlug] = useState<string | null>(null)
  const [pdfViewerUrl, setPdfViewerUrl] = useState<string | null>(null)
  const [pdfViewerTitle, setPdfViewerTitle] = useState<string>("")

  useEffect(() => {
    const loadSections = async () => {
      try {
        console.log("[v0] Loading journal sections for lang:", lang)
        setIsLoading(true)
        setError(null)

        const sectionsData = await fetchAllJournalSections(lang)
        console.log("[v0] Sections loaded:", sectionsData.length)
        setSections(sectionsData)
        setFilteredSections(sectionsData)
      } catch (err) {
        console.error("[v0] Error loading sections:", err)
        setError(err instanceof Error ? err.message : "Bo'limlarni yuklashda xatolik yuz berdi")
      } finally {
        setIsLoading(false)
      }
    }

    loadSections()
  }, [lang])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSections(sections)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = sections.filter(
        (section) =>
          section.journal_issue_name.toLowerCase().includes(query) ||
          section.author_name.toLowerCase().includes(query) ||
          section.name.toLowerCase().includes(query),
      )
      setFilteredSections(filtered)
    }
  }, [searchQuery, sections])

  const handleOpenPdf = async (section: JournalSection) => {
    try {
      const slug = lang === "uz" ? section.slug_uz : lang === "en" ? section.slug_en : section.slug_ru

      if (!slug) {
        console.error("[v0] No slug found for section:", section)
        alert("PDF ochishda xatolik: slug topilmadi")
        return
      }

      console.log("[v0] ========== OPENING PDF ==========")
      console.log("[v0] Section:", section)
      console.log("[v0] Selected slug:", slug)
      console.log("[v0] Language:", lang)
      setLoadingPdfSlug(slug)

      const token = localStorage.getItem("access_token")
      console.log("[v0] Token exists:", !!token)

      if (!token) {
        console.log("[v0] User not logged in, redirecting to login")
        const currentUrl = `/${lang}/journal-sections`
        router.push(`/${lang}/login?returnUrl=${encodeURIComponent(currentUrl)}`)
        setLoadingPdfSlug(null)
        return
      }

      console.log("[v0] Checking user subscription status...")
      const user = await getUser()
      console.log("[v0] User data:", user)

      if (!user) {
        console.log("[v0] Could not fetch user data, redirecting to login")
        const currentUrl = `/${lang}/journal-sections`
        router.push(`/${lang}/login?returnUrl=${encodeURIComponent(currentUrl)}`)
        setLoadingPdfSlug(null)
        return
      }

      const hasActiveSubscription = user.subscription?.active && user.subscription.active.length > 0
      console.log("[v0] Has active subscription:", hasActiveSubscription)

      if (!hasActiveSubscription) {
        console.log("[v0] User has no active subscription, redirecting to buy page")
        const currentUrl = `/${lang}/journal-sections`
        router.push(`/${lang}/buy?subscription_type_id=3&returnUrl=${encodeURIComponent(currentUrl)}`)
        setLoadingPdfSlug(null)
        return
      }

      const API_BASE = "https://artculture.pythonanywhere.com"
      const url = `${API_BASE}/${lang}/section/${slug}/`
      console.log("[v0] Fetching PDF from URL:", url)

      console.log("[v0] Starting fetch request...")
      const response = await fetchWithAuth(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      })

      console.log("[v0] Response received:")
      console.log("[v0] - Status:", response.status)
      console.log("[v0] - Status text:", response.statusText)
      console.log("[v0] - OK:", response.ok)
      console.log("[v0] - Content-Type:", response.headers.get("content-type"))

      if (response.status === 403) {
        console.log("[v0] 403 Forbidden - User needs subscription, redirecting to buy page")
        const currentUrl = `/${lang}/journal-sections`
        router.push(`/${lang}/buy?subscription_type_id=3&returnUrl=${encodeURIComponent(currentUrl)}`)
        setLoadingPdfSlug(null)
        return
      }

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        let errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`

        if (contentType?.includes("application/json")) {
          try {
            const errorData = await response.json()
            console.error("[v0] API error response (JSON):", errorData)
            errorMessage = errorData.detail || errorData.message || errorMessage
          } catch (e) {
            console.error("[v0] Could not parse error response as JSON")
          }
        } else {
          const errorText = await response.text()
          console.error("[v0] API error response (text):", errorText)
          if (errorText) {
            errorMessage = errorText
          }
        }

        throw new Error(errorMessage)
      }

      console.log("[v0] Converting response to blob...")
      const pdfBlob = await response.blob()
      console.log("[v0] PDF blob received:")
      console.log("[v0] - Size:", pdfBlob.size, "bytes")
      console.log("[v0] - Type:", pdfBlob.type)

      if (pdfBlob.size === 0) {
        throw new Error("PDF fayli bo'sh")
      }

      console.log("[v0] Creating blob URL...")
      const blobUrl = URL.createObjectURL(pdfBlob)
      console.log("[v0] Blob URL created:", blobUrl)

      console.log("[v0] Opening PDF in viewer...")
      setPdfViewerUrl(blobUrl)
      setPdfViewerTitle(`${section.journal_issue_name} - ${section.author_name}`)
      console.log("[v0] ========== PDF OPENED SUCCESSFULLY ==========")
    } catch (err) {
      console.error("[v0] ========== ERROR OPENING PDF ==========")
      console.error("[v0] Error type:", err instanceof Error ? err.constructor.name : typeof err)
      console.error("[v0] Error message:", err instanceof Error ? err.message : String(err))
      console.error("[v0] Full error:", err)

      const errorMessage = err instanceof Error ? err.message : "PDF ochishda xatolik yuz berdi"
      alert(`PDF ochishda xatolik: ${errorMessage}\n\nBatafsil ma'lumot uchun browser console'ni tekshiring (F12).`)
    } finally {
      setLoadingPdfSlug(null)
    }
  }

  const handleClosePdfViewer = () => {
    if (pdfViewerUrl) {
      URL.revokeObjectURL(pdfViewerUrl)
    }
    setPdfViewerUrl(null)
    setPdfViewerTitle("")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground text-lg">
            {t.description} ({sections.length} {t.sections})
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredSections.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t.noSections}</h3>
            <p className="text-muted-foreground">{t.noSectionsDesc}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>{t.journalIssue}</TableHead>
                  <TableHead>{t.author}</TableHead>
                  <TableHead className="w-[100px]">{t.pages}</TableHead>
                  <TableHead className="text-right w-[150px]">PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSections.map((section, index) => {
                  const key = `${section.slug_uz || section.slug_en || section.slug_ru}-${index}`
                  const slug = lang === "uz" ? section.slug_uz : lang === "en" ? section.slug_en : section.slug_ru
                  const isLoadingThisPdf = loadingPdfSlug === slug

                  return (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{section.journal_issue_name}</TableCell>
                      <TableCell>{section.author_name}</TableCell>
                      <TableCell>{section.pages}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenPdf(section)}
                          disabled={isLoadingThisPdf}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {isLoadingThisPdf ? t.loadingPdf : t.openPdf}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <Footer />

      {pdfViewerUrl && <PDFViewer pdfUrl={pdfViewerUrl} onClose={handleClosePdfViewer} title={pdfViewerTitle} />}
    </div>
  )
}

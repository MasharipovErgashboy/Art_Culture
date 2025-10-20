"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader } from "@/components/Loader"
import { fetchConference, type Conference } from "@/lib/api"
import { fetchWithAuth } from "@/lib/auth"
import { fetchUserProfile } from "@/lib/userProfile" // Assuming this function exists
import { Calendar, MapPin, Users, FileText, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { PDFViewer } from "@/components/pdf-viewer"

const API_BASE = "https://artculture.pythonanywhere.com"

const translations = {
  uz: {
    loading: "Konferensiya ma'lumotlari yuklanmoqda...",
    notFound: "Konferensiya topilmadi",
    notFoundDesc: "Ushbu konferensiya mavjud emas yoki o'chirilgan.",
    date: "Sana",
    address: "Manzil",
    organizer: "Tashkilotchi va hamkorlar",
    description: "Tavsif",
    materials: "Konferensiya materiallari",
    pdfDownload: "PDF formatida ko'rish",
    openPdf: "PDF ni ochish",
    imageNotLoaded: "Rasm yuklanmadi",
    pdfError: "PDF yuklanishida xatolik yuz berdi",
  },
  ru: {
    loading: "Загрузка информации о конференции...",
    notFound: "Конференция не найдена",
    notFoundDesc: "Эта конференция не существует или была удалена.",
    date: "Дата",
    address: "Адрес",
    organizer: "Организатор и партнеры",
    description: "Описание",
    materials: "Материалы конференции",
    pdfDownload: "Просмотр в формате PDF",
    openPdf: "Открыть PDF",
    imageNotLoaded: "Изображение не загружено",
    pdfError: "Ошибка при загрузке PDF",
  },
  en: {
    loading: "Loading conference information...",
    notFound: "Conference not found",
    notFoundDesc: "This conference does not exist or has been deleted.",
    date: "Date",
    address: "Address",
    organizer: "Organizer and Partners",
    description: "Description",
    materials: "Conference Materials",
    pdfDownload: "View in PDF format",
    openPdf: "Open PDF",
    imageNotLoaded: "Image not loaded",
    pdfError: "Error loading PDF",
  },
}

export default function ConferenceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as string) || "en"
  const slug = params.slug as string
  const t = translations[lang as keyof typeof translations] || translations.en

  const [conference, setConference] = useState<Conference | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [pdfBlobUrl])

  useEffect(() => {
    const loadConference = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await fetchConference(slug, lang)
        setConference(data)
      } catch (err) {
        console.error("[v0] Error loading conference:", err)
        if (err instanceof TypeError && err.message.includes("fetch")) {
          setError("Django server bilan bog'lanish xatoligi. Server ishlamayapti yoki CORS sozlamalari noto'g'ri.")
        } else {
          setError(err instanceof Error ? err.message : "Konferensiyani yuklashda xatolik yuz berdi")
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      loadConference()
    }
  }, [slug, lang])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US", {
      year: "numeric",
      month: lang === "uz" ? "2-digit" : "long",
      day: "numeric",
    })
  }

  const handlePdfDownload = async () => {
    console.log("[v0] ========== CONFERENCE PDF OPEN DEBUG ==========")
    console.log("[v0] Conference data:", conference)
    console.log("[v0] URL slug parameter:", slug)

    const token = localStorage.getItem("access_token")
    console.log("[v0] Access token exists:", !!token)

    if (!token) {
      console.log("[v0] User not logged in, redirecting to login page")
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
      return
    }

    try {
      console.log("[v0] Checking user subscription status...")
      const userProfile = await fetchUserProfile(token)
      console.log("[v0] User profile:", userProfile)

      const hasActiveSubscription = userProfile.subscription?.active && userProfile.subscription.active.length > 0
      console.log("[v0] Has active subscription:", hasActiveSubscription)

      if (!hasActiveSubscription) {
        console.log("[v0] User has no active subscription, redirecting to buy page")
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
        router.push(`/${lang}/buy/?subscription_type_id=3&returnUrl=${returnUrl}`)
        return
      }

      console.log("[v0] User has active subscription, proceeding to fetch PDF")
    } catch (profileError) {
      console.error("[v0] Error fetching user profile:", profileError)
      // If profile fetch fails, redirect to login (token might be invalid)
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search)
      router.push(`/${lang}/login?returnUrl=${returnUrl}`)
      return
    }

    if (!conference) {
      console.error("[v0] No conference data available")
      return
    }

    try {
      // Try direct PDF path first if available
      if (conference.pdf) {
        console.log("[v0] Attempting to fetch PDF directly from pdf path")
        const directPdfUrl = `${API_BASE}${conference.pdf}`
        console.log("[v0] Direct PDF URL:", directPdfUrl)

        try {
          const pdfResponse = await fetchWithAuth(directPdfUrl, {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          })

          console.log("[v0] Direct PDF response status:", pdfResponse.status)

          if (pdfResponse.ok) {
            const pdfBlob = await pdfResponse.blob()
            console.log("[v0] PDF blob size:", pdfBlob.size)

            if (pdfBlob.size > 0) {
              const blobUrl = URL.createObjectURL(pdfBlob)
              setPdfBlobUrl(blobUrl)
              setShowPDFViewer(true)
              console.log("[v0] ========== CONFERENCE PDF OPEN SUCCESS (DIRECT) ==========")
              return
            }
          }
        } catch (directError) {
          console.log("[v0] Direct PDF fetch failed, trying slug-based API:", directError)
        }
      }

      // Try slug-based API
      console.log("[v0] Attempting slug-based PDF API")
      const pdfUrl = `${API_BASE}/${lang}/conference/${slug}/`
      console.log("[v0] PDF URL:", pdfUrl)

      const pdfResponse = await fetchWithAuth(pdfUrl, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      })

      console.log("[v0] PDF response status:", pdfResponse.status)

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
      setPdfBlobUrl(blobUrl)
      setShowPDFViewer(true)
      console.log("[v0] ========== CONFERENCE PDF OPEN SUCCESS ==========")
    } catch (error) {
      console.error("[v0] ========== CONFERENCE PDF OPEN ERROR ==========")
      console.error("[v0] Error:", error)
      if (error instanceof Error) {
        setError(`${t.pdfError}: ${error.message}`)
        alert(`PDF yuklanishida xatolik yuz berdi: ${error.message}`)
      } else {
        setError(t.pdfError)
        alert("PDF yuklanishida xatolik yuz berdi")
      }
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
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

  if (!conference) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t.notFound}</h3>
            <p className="text-muted-foreground">{t.notFoundDesc}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const imageUrl = conference.image ? `${API_BASE}${conference.image}` : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{conference.name}</h1>
          </div>

          {/* Image */}
          {imageUrl && !imageError ? (
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  )}
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={conference.name}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    priority
                  />
                </div>
              </CardContent>
            </Card>
          ) : imageUrl && imageError ? (
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="h-16 w-16 text-primary/40 mx-auto mb-4" />
                    <p className="text-primary/60 font-medium">{t.imageNotLoaded}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Conference Details */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.date}</p>
                    <p className="font-semibold">{formatDate(conference.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.address}</p>
                    <p className="font-semibold">{conference.manzil}</p>
                  </div>
                </div>

                {conference.tashkilotchi_hamkorlar && (
                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t.organizer}</p>
                      <p className="font-semibold">{conference.tashkilotchi_hamkorlar}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">{t.description}</h2>
              <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: conference.description }}
              />
            </CardContent>
          </Card>

          {/* PDF Download */}
          {conference.pdf && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{t.materials}</p>
                      <p className="text-sm text-muted-foreground">{t.pdfDownload}</p>
                    </div>
                  </div>
                  <Button onClick={handlePdfDownload} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t.openPdf}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
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
          title={conference?.name}
        />
      )}

      <Footer />
    </div>
  )
}

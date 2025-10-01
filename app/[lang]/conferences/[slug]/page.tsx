"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader } from "@/components/Loader"
import { fetchConference, type Conference } from "@/lib/api"
import { Calendar, MapPin, Users, FileText, AlertCircle, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function ConferenceDetailPage() {
  const params = useParams()
  const lang = (params.lang as string) || "en"
  const slug = params.slug as string

  const [conference, setConference] = useState<Conference | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadConference = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchConference(slug, lang)
        setConference(data)
      } catch (err) {
        console.error("Error loading conference:", err)
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
    return date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handlePdfDownload = () => {
    if (conference?.pdf) {
      const pdfUrl = `http://127.0.0.1:8000${conference.pdf}`
      window.open(pdfUrl, "_blank")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Loader message="Konferensiya ma'lumotlari yuklanmoqda..." />
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
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">Konferensiya topilmadi</h3>
            <p className="text-muted-foreground">Ushbu konferensiya mavjud emas yoki o'chirilgan.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const imageUrl = conference.image ? `http://127.0.0.1:8000${conference.image}` : null

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
          {imageUrl && (
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={conference.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conference Details */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sana</p>
                    <p className="font-semibold">{formatDate(conference.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Manzil</p>
                    <p className="font-semibold">{conference.manzil}</p>
                  </div>
                </div>

                {conference.tashkilotchi_hamkorlar && (
                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tashkilotchi va hamkorlar</p>
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
              <h2 className="text-2xl font-bold mb-4">Tavsif</h2>
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
                      <p className="font-semibold">Konferensiya materiallari</p>
                      <p className="text-sm text-muted-foreground">PDF formatida yuklab olish</p>
                    </div>
                  </div>
                  <Button onClick={handlePdfDownload} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Yuklab olish
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, Calendar, Phone, Mail, User } from "lucide-react"

interface ReklamaDetail {
  title: string
  slug: string
  media: string | null
  homepage_content: string | null
  description: string | null
  price?: string
  location?: string
  date?: string
  contact_name?: string
  contact_phone?: string
  contact_email?: string
}

const API_BASE = "https://artculture.pythonanywhere.com"

export default function ReklamaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [reklama, setReklama] = useState<ReklamaDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lang, setLang] = useState<"uz" | "ru" | "en">("uz")

  useEffect(() => {
    const storedLang = (localStorage.getItem("language") as "uz" | "ru" | "en") || "uz"
    setLang(storedLang)
  }, [])

  useEffect(() => {
    const fetchReklamaDetail = async () => {
      try {
        setIsLoading(true)
        const slug = params.slug as string
        console.log("[v0] Fetching reklama detail with params:", { slug, lang })

        let apiUrl = `${API_BASE}/${lang}/reklama/${slug}/`
        console.log("[v0] API URL:", apiUrl)

        let response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Accept-Language": lang,
          },
          mode: "cors",
        })

        if (!response.ok && /^\d+$/.test(slug)) {
          console.log("[v0] Slug failed, trying ID-based endpoint")
          apiUrl = `${API_BASE}/${lang}/reklama/id/${slug}/`
          response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Accept-Language": lang,
            },
            mode: "cors",
          })
        }

        console.log("[v0] Response status:", response.status)
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        setReklama(data)
      } catch (err) {
        console.error("[v0] Reklama detail fetch error:", err)
        setError(err instanceof Error ? err.message : "Ma'lumot yuklanmadi")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      fetchReklamaDetail()
    }
  }, [params.slug, lang])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Ma'lumot yuklanmoqda...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !reklama) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Xatolik yuz berdi</h1>
              <p className="text-muted-foreground mb-6">{error || "Reklama topilmadi"}</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Orqaga qaytish
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Reklama</h1>
        </div>

        {/* Main content card */}
        <Card className="overflow-hidden mb-6">
          {/* Product image */}
          {reklama.media && (
            <div className="relative aspect-video bg-muted">
              <img src={`${API_BASE}${reklama.media}`} alt={reklama.title} className="w-full h-full object-contain" />
            </div>
          )}

          <CardContent className="p-6 space-y-6">
            {/* Title and basic info */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-balance">{reklama.title}</h2>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {reklama.price && <div className="text-2xl font-bold text-primary">{reklama.price}</div>}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {reklama.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{reklama.location}</span>
                  </div>
                )}
                {reklama.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{reklama.date}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description section */}
            {(reklama.description || reklama.homepage_content) && (
              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-semibold text-lg">Tavsif</h3>
                <div className="text-muted-foreground leading-relaxed">
                  {reklama.description ? (
                    <div dangerouslySetInnerHTML={{ __html: reklama.description }} />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: reklama.homepage_content || "" }} />
                  )}
                </div>
              </div>
            )}

            {/* Contact information */}
            {(reklama.contact_name || reklama.contact_phone || reklama.contact_email) && (
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold text-lg">Aloqa ma'lumotlari</h3>
                <div className="space-y-2">
                  {reklama.contact_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{reklama.contact_name}</span>
                    </div>
                  )}
                  {reklama.contact_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{reklama.contact_phone}</span>
                    </div>
                  )}
                  {reklama.contact_email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{reklama.contact_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action buttons - fixed at bottom on mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:relative md:border-0 md:p-0">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                if (reklama.contact_phone) {
                  window.location.href = `tel:${reklama.contact_phone}`
                }
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Zavolať
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                if (reklama.contact_email) {
                  window.location.href = `mailto:${reklama.contact_email}`
                }
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Napísať správu
            </Button>
          </div>
        </div>

        {/* Spacer for fixed buttons on mobile */}
        <div className="h-20 md:hidden" />
      </div>

      <Footer />
    </div>
  )
}

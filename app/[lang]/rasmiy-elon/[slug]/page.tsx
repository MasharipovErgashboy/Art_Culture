"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, User } from "lucide-react"
import Image from "next/image"

interface RasmiyElon {
  id?: number
  title: string
  slug: string
  media: string | null
  homepage_content: string | null
  description: string | null
  author?: string
}

const API_BASE = "http://127.0.0.1:8000"

const decodeHtmlEntities = (text: string) => {
  const textarea = document.createElement("textarea")
  textarea.innerHTML = text
  return textarea.value
}

const cleanHtmlContent = (content: string) => {
  if (!content) return ""

  // Decode HTML entities
  const decoded = decodeHtmlEntities(content)

  // Remove unwanted text patterns
  const cleaned = decoded
    .replace(/Admin\s*O'qish\s*/gi, "") // Remove "AdminO'qish" text
    .replace(/\.{6,}/g, "") // Remove multiple dots
    .trim()

  return cleaned
}

const stripHtmlTags = (content: string) => {
  if (!content) return ""

  // First clean the content
  const cleaned = cleanHtmlContent(content)

  // Create a temporary div to strip HTML tags
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = cleaned

  // Get plain text and clean up extra whitespace
  const plainText = tempDiv.textContent || tempDiv.innerText || ""

  return plainText
    .replace(/\s+/g, " ") // Replace multiple whitespace with single space
    .trim()
}

export default function RasmiyElonDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [rasmiyElon, setRasmiyElon] = useState<RasmiyElon | null>(null)
  const [otherElonlar, setOtherElonlar] = useState<RasmiyElon[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const lang = (params.lang as "uz" | "ru" | "en") || "en"
  const ITEMS_PER_PAGE = 9

  useEffect(() => {
    const fetchRasmiyElonDetail = async () => {
      try {
        setIsLoading(true)
        const slug = params.slug as string

        let apiUrl = `${API_BASE}/${lang}/rasmiy-elonlar/${slug}/`

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
          apiUrl = `${API_BASE}/${lang}/rasmiy-elonlar/id/${slug}/`
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

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        setRasmiyElon(data.detail || data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ma'lumot yuklanmadi")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchOtherElonlar = async () => {
      try {
        const response = await fetch(`${API_BASE}/${lang}/rasmiy-elonlar/?page=${page}`, {
          headers: { "Accept-Language": lang },
        })

        if (!response.ok) throw new Error("Ma'lumot yuklab bo'lmadi")

        const data: RasmiyElon[] = await response.json()
        // Filter out the current rasmiy-elon from the list
        const currentSlug = params.slug as string
        const filtered = data.filter((item) => item.slug !== currentSlug)
        setOtherElonlar(filtered)
      } catch (err) {
        console.error("Other elonlar fetch error:", err)
      }
    }

    if (params.slug) {
      fetchRasmiyElonDetail()
      fetchOtherElonlar()
    }
  }, [params.slug, lang, page])

  const handleSelectElon = (elon: RasmiyElon) => {
    if (elon.slug) {
      router.push(`/${lang}/rasmiy-elon/${elon.slug}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">Yuklanmoqda...</div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>
        <Footer />
      </div>
    )
  }

  if (!rasmiyElon) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">Rasmiy e'lon not found</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 sm:py-16">
        {/* Orqaga qaytish */}
        <Button onClick={() => router.back()} variant="outline" className="mb-8 hover-primary bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Orqaga qaytish
        </Button>

        <Card className="overflow-hidden border-0 shadow-lg mb-12">
          {/* Rasm to'liq ko'rinishi uchun */}
          {rasmiyElon.media && (
            <div className="relative w-full h-[400px] sm:h-[500px]">
              <Image
                src={rasmiyElon.media.startsWith("http") ? rasmiyElon.media : `${API_BASE}${rasmiyElon.media}`}
                alt={rasmiyElon.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-balance">{rasmiyElon.title}</h1>

            {/* Description section - alohida ko'rsatish */}
            {rasmiyElon.description && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-primary">Tavsif</h2>
                <div
                  className="prose max-w-none text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: cleanHtmlContent(rasmiyElon.description),
                  }}
                />
              </div>
            )}

            {/* Homepage content section */}
            {rasmiyElon.homepage_content && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-primary">Batafsil ma'lumot</h2>
                <div
                  className="prose max-w-none text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: cleanHtmlContent(rasmiyElon.homepage_content),
                  }}
                />
              </div>
            )}

            {/* Author info */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <User className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Muallif: {rasmiyElon.author || "Admin"}</span>
            </div>
          </CardContent>
        </Card>

        {otherElonlar.length > 0 && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-balance">So'nggi rasmiy e'lonlar</h2>
              <p className="text-muted-foreground">Boshqa muhim e'lonlar bilan tanishing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherElonlar.slice(0, ITEMS_PER_PAGE).map((item, idx) => (
                <Card
                  key={idx}
                  className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleSelectElon(item)}
                >
                  <div className="relative w-full h-[220px]">
                    {item.media ? (
                      <Image
                        src={item.media.startsWith("http") ? item.media : `${API_BASE}${item.media}`}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <User className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 text-balance">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                      {stripHtmlTags(item.description || item.homepage_content || "")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between pt-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4 text-primary" />
                      <span className="line-clamp-1">{item.author || "Admin"}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent hover-primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectElon(item)
                      }}
                    >
                      O'qish
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 pt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="hover-primary"
              >
                Oldingi
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <span className="text-sm font-medium">Sahifa {page}</span>
              </div>
              <Button
                variant="outline"
                disabled={otherElonlar.length < ITEMS_PER_PAGE}
                onClick={() => setPage((prev) => prev + 1)}
                className="hover-primary"
              >
                Keyingi
              </Button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, User } from "lucide-react"
import Image from "next/image"

interface Reklama {
  id?: number
  title: string
  slug: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  media: string | null
  homepage_content: string | null
  description: string | null
  author?: string
}

const API_BASE = "https://artculture.pythonanywhere.com"

const convertRelativeImageUrls = (html: string): string => {
  if (!html) return ""

  return html.replace(/(src|href)=["'](\/(media|static)[^"']+)["']/gi, (match, attr, path) => {
    return `${attr}="${API_BASE}${path}"`
  })
}

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
    .replace(/Admin\s*O'qish\s*/gi, "")
    .replace(/\.{6,}/g, "")
    .trim()

  return convertRelativeImageUrls(cleaned)
}

const stripHtmlTags = (content: string) => {
  if (!content) return ""

  const cleaned = cleanHtmlContent(content)
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = cleaned

  const plainText = tempDiv.textContent || tempDiv.innerText || ""

  return plainText.replace(/\s+/g, " ").trim()
}

const isVideoFile = (url: string): boolean => {
  if (!url) return false
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"]
  const lowerUrl = url.toLowerCase()
  return videoExtensions.some((ext) => lowerUrl.endsWith(ext))
}

export default function ReklamaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [reklama, setReklama] = useState<Reklama | null>(null)
  const [otherReklamalar, setOtherReklamalar] = useState<Reklama[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentReklamaId, setCurrentReklamaId] = useState<number | null>(null)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const prevLang = useRef<string>("en")

  const lang = (params.lang as "uz" | "ru" | "en") || "en"
  const ITEMS_PER_PAGE = 9

  useEffect(() => {
    const fetchReklamaDetail = async () => {
      try {
        setIsLoading(true)
        const slug = params.slug as string

        console.log("[v0] ===== REKLAMA FETCH STARTED =====")
        console.log("[v0] Current language:", lang)
        console.log("[v0] Previous language:", prevLang.current)
        console.log("[v0] Current slug from URL:", slug)
        console.log("[v0] Stored reklama ID:", currentReklamaId)

        let apiUrl: string
        let response: Response

        const languageChanged = prevLang.current !== lang
        console.log("[v0] Language changed?", languageChanged)

        if (currentReklamaId && languageChanged) {
          console.log("[v0] Language changed! Fetching by ID:", currentReklamaId)
          apiUrl = `${API_BASE}/${lang}/reklama/id/${currentReklamaId}/`
          console.log("[v0] Fetching from:", apiUrl)

          response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Accept-Language": lang,
            },
            mode: "cors",
          })
        } else {
          console.log("[v0] Fetching by slug:", slug)
          apiUrl = `${API_BASE}/${lang}/reklama/${slug}/`
          console.log("[v0] Fetching from:", apiUrl)

          response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Accept-Language": lang,
            },
            mode: "cors",
          })

          if (!response.ok && /^\d+$/.test(slug)) {
            console.log("[v0] First fetch failed, trying with ID endpoint")
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
        }

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log("[v0] API Response:", data)

        const reklamaData = data.detail || data
        console.log("[v0] Reklama data:", reklamaData)
        console.log("[v0] Reklama slug from API:", reklamaData.slug)
        console.log("[v0] Reklama ID from API:", reklamaData.id)

        if (reklamaData.id) {
          setCurrentReklamaId(reklamaData.id)
          console.log("[v0] Stored reklama ID:", reklamaData.id)
        }

        setReklama(reklamaData)

        if (reklamaData.slug && reklamaData.slug !== slug) {
          console.log("[v0] Slugs are different! Updating URL...")
          console.log("[v0]   URL slug:", slug)
          console.log("[v0]   API slug:", reklamaData.slug)
          console.log("[v0] New URL will be:", `/${lang}/reklama/${reklamaData.slug}`)

          router.replace(`/${lang}/reklama/${reklamaData.slug}`)
        }

        prevLang.current = lang

        console.log("[v0] ===== REKLAMA FETCH COMPLETED =====")
      } catch (err) {
        console.error("[v0] Reklama fetch error:", err)
        setError(err instanceof Error ? err.message : "Ma'lumot yuklanmadi")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchOtherReklamalar = async () => {
      try {
        console.log("[v0] Fetching other reklamalar from:", `${API_BASE}/${lang}/reklama/?page=${page}`)

        const response = await fetch(`${API_BASE}/${lang}/reklama/?page=${page}`, {
          headers: { "Accept-Language": lang },
        })

        if (!response.ok) throw new Error("Ma'lumot yuklab bo'lmadi")

        const data: Reklama[] = await response.json()

        console.log("[v0] Other reklamalar data:", data)

        const currentSlug = params.slug as string
        const filtered = data.filter((item) => item.slug !== currentSlug)

        console.log("[v0] Filtered reklamalar count:", filtered.length)

        setOtherReklamalar(filtered)
      } catch (err) {
        console.error("[v0] Other reklamalar fetch error:", err)
      }
    }

    if (params.slug) {
      fetchReklamaDetail()
      fetchOtherReklamalar()
    }
  }, [params.slug, lang, page, router, currentReklamaId])

  const handleSelectReklama = (reklama: Reklama) => {
    const slugToUse = reklama.slug || reklama.title

    if (slugToUse) {
      const properSlug = slugToUse
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .trim()

      router.push(`/${lang}/reklama/${properSlug}`)
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

  if (!reklama) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">Reklama topilmadi</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 xl:py-16">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6 sm:mb-8 hover-primary bg-transparent text-sm sm:text-base"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Orqaga qaytish
        </Button>

        <Card className="overflow-hidden border-0 shadow-lg mb-8 sm:mb-12">
          {reklama.media && (
            <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[400px] xl:h-[500px] bg-muted">
              {isVideoFile(reklama.media) ? (
                <video
                  src={reklama.media.startsWith("http") ? reklama.media : `${API_BASE}${reklama.media}`}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Brauzeringiz video formatini qo'llab-quvvatlamaydi.
                </video>
              ) : (
                <Image
                  src={reklama.media.startsWith("http") ? reklama.media : `${API_BASE}${reklama.media}`}
                  alt={reklama.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                  onError={(e) => {
                    console.error("[v0] Image load error:", reklama.media)
                    e.currentTarget.style.display = "none"
                  }}
                />
              )}
            </div>
          )}

          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight text-balance">
              {reklama.title}
            </h1>

            {reklama.description && (
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold text-primary">Tavsif</h2>
                <div
                  className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:shadow-md"
                  dangerouslySetInnerHTML={{
                    __html: cleanHtmlContent(reklama.description),
                  }}
                />
              </div>
            )}

            {reklama.homepage_content && (
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-lg sm:text-xl font-semibold text-primary">Batafsil ma'lumot</h2>
                <div
                  className="prose prose-sm sm:prose-base max-w-none text-foreground leading-relaxed [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:shadow-md"
                  dangerouslySetInnerHTML={{
                    __html: cleanHtmlContent(reklama.homepage_content),
                  }}
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">Muallif: {reklama.author || "Admin"}</span>
            </div>
          </CardContent>
        </Card>

        {otherReklamalar.length > 0 && (
          <section className="space-y-6 sm:space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-balance">So'nggi reklamalar</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Boshqa muhim reklamalar bilan tanishing</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {otherReklamalar.slice(0, ITEMS_PER_PAGE).map((item, idx) => (
                <Card
                  key={idx}
                  className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleSelectReklama(item)}
                >
                  <div className="relative w-full h-[180px] sm:h-[200px] lg:h-[220px] bg-muted overflow-hidden">
                    {item.media && !failedImages.has(idx) ? (
                      isVideoFile(item.media) ? (
                        <video
                          src={item.media.startsWith("http") ? item.media : `${API_BASE}${item.media}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          preload="metadata"
                          muted
                        />
                      ) : (
                        <img
                          src={item.media.startsWith("http") ? item.media : `${API_BASE}${item.media}`}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            console.error("[v0] Card image load error:", item.media)
                            e.currentTarget.style.display = "none"
                            setFailedImages((prev) => new Set(prev).add(idx))
                          }}
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary/30" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="space-y-2 sm:space-y-3 p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 text-balance">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-xs sm:text-sm leading-relaxed">
                      {stripHtmlTags(item.description || item.homepage_content || "")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between pt-0 p-4 sm:p-6">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      <span className="line-clamp-1">{item.author || "Admin"}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent hover-primary text-xs sm:text-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectReklama(item)
                      }}
                    >
                      O'qish
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-6 sm:pt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="hover-primary w-full sm:w-auto text-sm sm:text-base"
              >
                Oldingi
              </Button>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-muted rounded-lg">
                <span className="text-xs sm:text-sm font-medium">Sahifa {page}</span>
              </div>
              <Button
                variant="outline"
                disabled={otherReklamalar.length < ITEMS_PER_PAGE}
                onClick={() => setPage((prev) => prev + 1)}
                className="hover-primary w-full sm:w-auto text-sm sm:text-base"
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

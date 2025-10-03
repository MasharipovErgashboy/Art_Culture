"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, ChevronLeft, ChevronRight } from "lucide-react"

interface Yangilik {
  id?: number
  title: string
  slug_uz?: string
  slug_en?: string
  slug_ru?: string
  slug?: string
  media?: string
  homepage_content?: string
  description?: string
}

interface YangiliklarAPIResponse {
  detail: Yangilik
  "10_data": Yangilik[]
}

const API_BASE = "https://artculture.pythonanywhere.com"
const API_TIMEOUT = 15000 // 15 seconds timeout

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = API_TIMEOUT) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Server bilan bog'lanish vaqti tugadi. Iltimos, qaytadan urinib ko'ring.")
    }
    throw error
  }
}

export default function YangiliklarPage() {
  const params = useParams()
  const router = useRouter()
  const lang = params.lang as string
  const slug = params.slug as string

  const [allNews, setAllNews] = useState<Yangilik[]>([])
  const [featuredNews, setFeaturedNews] = useState<Yangilik | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [detailYangilik, setDetailYangilik] = useState<Yangilik | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const perPage = 9
  const isListView = slug === "all" || slug === "list"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (isListView) {
          console.log("[v0] Fetching yangiliklar list from:", `${API_BASE}/${lang}/yangiliklar/`)
          const response = await fetchWithTimeout(`${API_BASE}/${lang}/yangiliklar/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Accept-Language": lang,
            },
            mode: "cors",
          })

          if (!response.ok) {
            throw new Error(`Ma'lumot yuklanmadi (Status: ${response.status})`)
          }

          const data: Yangilik[] = await response.json()
          console.log("[v0] Yangiliklar list response:", data)
          setAllNews(data)
          if (!featuredNews && data.length > 0) {
            setFeaturedNews(data[0])
          }
        } else {
          const url = `${API_BASE}/${lang}/yangiliklar/${slug}/`
          console.log("[v0] Fetching yangilik detail from:", url)
          console.log("[v0] Request params - lang:", lang, "slug:", slug)

          const response = await fetchWithTimeout(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Accept-Language": lang,
            },
            mode: "cors",
          })

          console.log("[v0] Response status:", response.status, response.statusText)

          if (!response.ok) {
            throw new Error(`Server xatosi: ${response.status} ${response.statusText}`)
          }

          const data: YangiliklarAPIResponse = await response.json()
          console.log("[v0] Yangilik detail response:", data)

          if (data.detail) {
            console.log("[v0] Setting detail yangilik:", data.detail)
            setDetailYangilik(data.detail)
            if (data["10_data"] && data["10_data"].length > 0) {
              console.log("[v0] Setting related news:", data["10_data"].length, "items")
              setAllNews(data["10_data"])
            }
          } else {
            console.error("[v0] API response missing detail field:", data)
            throw new Error("Yangilik topilmadi")
          }
        }
      } catch (err) {
        console.error("[v0] Error fetching yangiliklar:", err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (lang && slug) {
      fetchData()
    }
  }, [lang, slug, isListView])

  const getImageUrl = (media?: string) => {
    if (!media) {
      return "/news-collage.png"
    }

    if (media.startsWith("http://") || media.startsWith("https://")) {
      return media
    }

    return `${API_BASE}${media}`
  }

  const getSlugForLang = (yangilik: Yangilik, currentLang: string) => {
    if (currentLang === "uz" && yangilik.slug_uz) return yangilik.slug_uz
    if (currentLang === "en" && yangilik.slug_en) return yangilik.slug_en
    if (currentLang === "ru" && yangilik.slug_ru) return yangilik.slug_ru
    return yangilik.slug_uz || yangilik.slug_en || yangilik.slug_ru || yangilik.slug || yangilik.id?.toString() || ""
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {isListView ? "Yangiliklar yuklanmoqda..." : "Yangilik yuklanmoqda..."}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Bell className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Xatolik yuz berdi</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => router.back()} variant="outline">
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

  if (isListView) {
    const totalPages = Math.ceil(allNews.length / perPage)
    const startIndex = (currentPage - 1) * perPage
    const paginatedNews = allNews.slice(startIndex, startIndex + perPage)

    if (!featuredNews) {
      return (
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16">Yangilik topilmadi</div>
          </div>
          <Footer />
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2 mb-8 rounded-xl">
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </Button>

          <Card className="overflow-hidden shadow-lg mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={getImageUrl(featuredNews.media) || "/placeholder.svg"}
                  alt={featuredNews.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/news-collage.png"
                  }}
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-3 mb-4 text-sm text-muted-foreground">
                  <Badge variant="outline">Yangilik</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-4">{featuredNews.title}</h2>
                <p
                  className="text-muted-foreground mb-6 line-clamp-4"
                  dangerouslySetInnerHTML={{
                    __html: featuredNews.homepage_content || featuredNews.description || "",
                  }}
                />
              </div>
            </div>
          </Card>

          <h3 className="text-2xl font-bold mb-8">So'nggi yangiliklar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedNews.map((yangilik, index) => (
              <Card
                key={yangilik.id || index}
                className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <img
                    src={getImageUrl(yangilik.media) || "/placeholder.svg"}
                    alt={yangilik.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/news-collage.png"
                    }}
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold line-clamp-2">{yangilik.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p
                    className="text-muted-foreground text-sm line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: yangilik.homepage_content || yangilik.description || "",
                    }}
                  />
                  <Button
                    className="mt-auto"
                    onClick={() => router.push(`/${lang}/yangiliklar/${getSlugForLang(yangilik, lang)}`)}
                  >
                    O'qish
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Oldingi
              </Button>
              <span className="font-medium">
                Sahifa {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Keyingi
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </main>

        <Footer />
      </div>
    )
  }

  if (!detailYangilik) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Yangilik topilmadi</h2>
              <p className="text-muted-foreground mb-4">Kechirasiz, bu yangilik mavjud emas yoki o'chirilgan.</p>
              <Button onClick={() => router.back()} variant="outline">
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => router.back()} variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Orqaga qaytish
          </Button>

          <Card className="overflow-hidden shadow-xl">
            {detailYangilik.media && (
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={getImageUrl(detailYangilik.media) || "/placeholder.svg"}
                  alt={detailYangilik.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/news-collage.png"
                  }}
                />
              </div>
            )}

            <CardContent className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{detailYangilik.title}</h1>
                <Badge variant="outline" className="mb-4">
                  Yangilik
                </Badge>
              </div>

              {detailYangilik.homepage_content && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-lg font-medium text-foreground">{detailYangilik.homepage_content}</p>
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <div
                  className="text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: detailYangilik.description || "Ma'lumot topilmadi",
                  }}
                />
              </div>

              {allNews.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h3 className="text-2xl font-bold mb-6">Boshqa yangiliklar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allNews.slice(0, 4).map((news, index) => (
                      <Card
                        key={news.id || index}
                        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => router.push(`/${lang}/yangiliklar/${getSlugForLang(news, lang)}`)}
                      >
                        <div className="flex gap-4 p-4">
                          {news.media && (
                            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded bg-gradient-to-br from-gray-50 to-gray-100">
                              <img
                                src={getImageUrl(news.media) || "/placeholder.svg"}
                                alt={news.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/news-collage.png"
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold line-clamp-2 mb-2">{news.title}</h4>
                            {news.homepage_content && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{news.homepage_content}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Eye } from "lucide-react"

interface ReklamaDetail {
  title: string
  slug: string
  media: string | null
  homepage_content: string | null
  description: string | null
}

const API_BASE = "http://127.0.0.1:8000"

export default function ReklamaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [reklama, setReklama] = useState<ReklamaDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const lang = params.lang as "uz" | "ru" | "en"

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003D7F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Ma'lumot yuklanmoqda...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !reklama) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Xatolik yuz berdi</h1>
              <p className="text-gray-600 mb-6">{error || "Reklama topilmadi"}</p>
              <Button onClick={() => router.back()} className="bg-[#003D7F] hover:bg-[#002B5A]">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => router.back()} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Orqaga qaytish
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-xl">
            {reklama.media && (
              <div className="relative h-64 md:h-96">
                <img src={`${API_BASE}${reklama.media}`} alt={reklama.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{reklama.title}</h1>
                </div>
              </div>
            )}

            <CardContent className="p-6 md:p-8">
              {!reklama.media && (
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl md:text-4xl font-bold text-[#003D7F]">{reklama.title}</CardTitle>
                </CardHeader>
              )}

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date().toLocaleDateString("uz-UZ")}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Ko'rildi
                </div>
              </div>

              {reklama.homepage_content && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 text-[#003D7F]">Qisqacha ma'lumot</h2>
                  <div
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: reklama.homepage_content }}
                  />
                </div>
              )}

              {reklama.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-[#003D7F]">Batafsil ma'lumot</h2>
                  <div
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: reklama.description }}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#003D7F] hover:bg-[#002B5A]">Bog'lanish</Button>
                <Button variant="outline">Ulashish</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

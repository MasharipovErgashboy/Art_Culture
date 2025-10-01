// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Navbar } from "@/components/navbar"
// import { Footer } from "@/components/footer"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ArrowLeft, Calendar, User, Bell } from "lucide-react"

// interface Yangilik {
//   id: number
//   title: string
//   description: string
//   media?: string // Changed from image to media to match API response
//   date: string
//   author?: string
//   content?: string
//   slug?: string
// }

// interface YangiliklarApiResponse {
//   detail: Yangilik
//   "10_data": Yangilik[]
// }

// const API_BASE = "http://127.0.0.1:8000"

// export default function YangiliklarDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const [apiResponse, setApiResponse] = useState<YangiliklarApiResponse | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const lang = params.lang as string
//   const slug = params.slug as string

//   useEffect(() => {
//     const fetchYangiliklarDetail = async () => {
//       try {
//         setIsLoading(true)
//         console.log("[v0] Fetching yangilik detail:", { lang, slug })

//         const response = await fetch(`${API_BASE}/${lang}/yangiliklar/${slug}/`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             "Accept-Language": lang,
//           },
//           mode: "cors",
//         })

//         console.log("[v0] Response status:", response.status)

//         if (!response.ok) {
//           const errorData = await response.json().catch(() => ({}))
//           throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(errorData)}`)
//         }

//         const data = await response.json()
//         console.log("[v0] Yangilik data received:", data)
//         setApiResponse(data)
//         setError(null)
//       } catch (error) {
//         console.error("[v0] Error fetching yangilik detail:", error)
//         setError(error instanceof Error ? error.message : "Yangilik ma'lumotlarini yuklashda xatolik")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (lang && slug) {
//       fetchYangiliklarDetail()
//     }
//   }, [lang, slug])

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//         <Navbar />
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center py-16">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003D7F] mx-auto mb-4"></div>
//             <p className="text-gray-600">Yangilik yuklanmoqda...</p>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//         <Navbar />
//         <div className="container mx-auto px-4 py-8">
//           <Card className="max-w-2xl mx-auto">
//             <CardContent className="p-8 text-center">
//               <Bell className="w-16 h-16 text-red-400 mx-auto mb-4" />
//               <h2 className="text-xl font-semibold text-gray-800 mb-2">Xatolik yuz berdi</h2>
//               <p className="text-gray-600 mb-4">{error}</p>
//               <Button onClick={() => router.back()} variant="outline">
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Orqaga qaytish
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//         <Footer />
//       </div>
//     )
//   }

//   if (!apiResponse || !apiResponse.detail) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//         <Navbar />
//         <div className="container mx-auto px-4 py-8">
//           <Card className="max-w-2xl mx-auto">
//             <CardContent className="p-8 text-center">
//               <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h2 className="text-xl font-semibold text-gray-800 mb-2">Yangilik topilmadi</h2>
//               <p className="text-gray-600 mb-4">Kechirasiz, bu yangilik mavjud emas yoki o'chirilgan.</p>
//               <Button onClick={() => router.back()} variant="outline">
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Orqaga qaytish
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//         <Footer />
//       </div>
//     )
//   }

//   const yangilik = apiResponse.detail
//   const recentYangiliklar = apiResponse["10_data"] || []

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       <Navbar />

//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           <Button
//             onClick={() => router.back()}
//             variant="outline"
//             className="mb-6 hover:bg-[#003D7F] hover:text-white transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Orqaga qaytish
//           </Button>

//           <Card className="overflow-hidden shadow-xl mb-8">
//             {yangilik.media && (
//               <div className="relative h-64 md:h-96 overflow-hidden">
//                 <img
//                   src={`${API_BASE}${yangilik.media}`}
//                   alt={yangilik.title}
//                   className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                   onError={(e) => {
//                     console.log("[v0] Image failed to load:", yangilik.media)
//                     const target = e.currentTarget as HTMLImageElement
//                     target.style.display = "none"
//                     // Show fallback background with content
//                     const parent = target.parentElement
//                     if (parent) {
//                       parent.classList.add("bg-gradient-to-br", "from-[#003D7F]", "to-[#0059B2]")
//                       parent.innerHTML = `
//                         <div class="flex items-center justify-center h-full">
//                           <div class="text-center text-white p-8">
//                             <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                               <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
//                               </svg>
//                             </div>
//                             <p class="text-sm opacity-90">Rasm yuklanmadi</p>
//                           </div>
//                         </div>
//                       `
//                     }
//                   }}
//                   onLoad={() => {
//                     console.log("[v0] Image loaded successfully:", yangilik.media)
//                   }}
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
//                 <div className="absolute bottom-4 left-4 z-10">
//                   <span className="inline-block px-3 py-1 bg-[#003D7F]/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20">
//                     YANGILIK
//                   </span>
//                 </div>
//               </div>
//             )}

//             <CardContent className="p-8">
//               <div className="mb-6">
//                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{yangilik.title}</h1>

//                 <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
//                   <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
//                     <Calendar className="w-4 h-4 mr-1" />
//                     {new Date(yangilik.date).toLocaleDateString("uz-UZ")}
//                   </div>
//                   {yangilik.author && (
//                     <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
//                       <User className="w-4 h-4 mr-1" />
//                       {yangilik.author}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="prose prose-lg max-w-none">
//                 <div
//                   className="text-gray-700 leading-relaxed text-base md:text-lg space-y-4"
//                   dangerouslySetInnerHTML={{
//                     __html: yangilik.content || yangilik.description || "",
//                   }}
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {recentYangiliklar.length > 0 && (
//             <Card className="shadow-lg rounded-2xl overflow-hidden border">
//               <CardHeader className="p-6 border-b bg-gradient-to-r from-[#003D7F] to-[#0059B2]">
//                 <CardTitle className="text-2xl font-bold text-white">So'nggi yangiliklar</CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 <div className="grid gap-4">
//                   {recentYangiliklar.map((item, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                     >
//                       <div className="flex items-center gap-4">
//                         {item.media && (
//                           <img
//                             src={item.media.startsWith("http") ? item.media : `${API_BASE}${item.media}`}
//                             alt={item.title}
//                             className="w-16 h-16 object-cover rounded-lg"
//                             onError={(e) => {
//                               e.currentTarget.style.display = "none"
//                             }}
//                           />
//                         )}
//                         <div>
//                           <h4 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h4>
//                           <div className="text-sm text-gray-600 line-clamp-2">
//                             <div
//                               dangerouslySetInnerHTML={{
//                                 __html: item.content || item.description || "",
//                               }}
//                             />
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             {new Date(item.date).toLocaleDateString("uz-UZ")}
//                           </div>
//                         </div>
//                       </div>
//                       <Button
//                         size="sm"
//                         className="bg-gradient-to-r from-[#003D7F] to-[#0059B2] hover:from-[#002B5A] hover:to-[#004494] text-white"
//                         onClick={() => {
//                           const slugToUse = item.slug || item.id.toString()
//                           router.push(`/${lang}/yangiliklar/${slugToUse}`)
//                         }}
//                       >
//                         Batafsil ko'rish
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   )
// }
"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Yangilik {
  id: number
  title: string
  slug: string
  media?: string
  homepage_content?: string
  description?: string
  date?: string
  views?: number
}

const API_BASE = "http://127.0.0.1:8000"

export default function YangiliklarPage() {
  const [allNews, setAllNews] = useState<Yangilik[]>([])
  const [featuredNews, setFeaturedNews] = useState<Yangilik | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const perPage = 9
  const lang = "uz"
  const router = useRouter()

  useEffect(() => {
    const fetchYangiliklar = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_BASE}/${lang}/yangiliklar/`)
        if (!response.ok) throw new Error("Ma'lumot yuklanmadi")
        const data: Yangilik[] = await response.json()

        setAllNews(data)
        if (!featuredNews && data.length > 0) {
          setFeaturedNews(data[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Xatolik yuz berdi")
      } finally {
        setIsLoading(false)
      }
    }
    fetchYangiliklar()
  }, [])

  // --- Pagination ---
  const totalPages = Math.ceil(allNews.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const paginatedNews = allNews.slice(startIndex, startIndex + perPage)

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Yuklanmoqda...</div>
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>
  if (!featuredNews) return <div className="flex items-center justify-center min-h-screen">Yangilik topilmadi</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto py-12 sm:py-16">
        {/* Orqaga qaytish tugmasi */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Orqaga
        </Button>

        {/* --- Asosiy yangilik --- */}
        <Card className="overflow-hidden shadow-lg mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-[16/9]">
              {featuredNews.media ? (
                <Image
                  src={featuredNews.media.startsWith("http") ? featuredNews.media : `${API_BASE}${featuredNews.media}`}
                  alt={featuredNews.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <Image src="/placeholder.svg" alt="placeholder" fill className="object-cover" />
              )}
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex items-center space-x-3 mb-4 text-sm text-muted-foreground">
                <Badge variant="outline">Yangilik</Badge>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{featuredNews.date || "2025-09-24"}</span>
                </div>
                {featuredNews.views && (
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-primary" />
                    <span>{featuredNews.views}</span>
                  </div>
                )}
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

        {/* --- So‘nggi yangiliklar --- */}
        <h3 className="text-2xl font-bold mb-8">So‘nggi yangiliklar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedNews.map((yangilik) => (
            <Card
              key={yangilik.id}
              className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[16/9]">
                {yangilik.media ? (
                  <Image
                    src={yangilik.media.startsWith("http") ? yangilik.media : `${API_BASE}${yangilik.media}`}
                    alt={yangilik.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Image src="/placeholder.svg" alt="placeholder" fill className="object-cover" />
                )}
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
                  onClick={() => setFeaturedNews(yangilik)}
                >
                  O‘qish
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- Pagination --- */}
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
            <span className="font-medium">Sahifa {currentPage} / {totalPages}</span>
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

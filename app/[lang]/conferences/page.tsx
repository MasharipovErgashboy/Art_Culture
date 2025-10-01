"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { fetchConferences, type Conference } from "@/lib/api"
import { Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"

export default function ConferencesPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const lang = (params.lang as string) || "en"

  const [conferences, setConferences] = useState<Conference[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadConferences = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchConferences(lang, 1, 100) // Load more conferences
      setConferences(data.results)
    } catch (err) {
      console.error("Error loading conferences:", err)
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Django server bilan bog'lanish xatoligi. Server ishlamayapti yoki CORS sozlamalari noto'g'ri.")
      } else {
        setError(err instanceof Error ? err.message : "Konferensiyalarni yuklashda xatolik yuz berdi")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadConferences()
  }, [lang])

  const currentDate = new Date()
  const upcomingConferences = conferences.filter((conf) => new Date(conf.date) >= currentDate)
  const pastConferences = conferences.filter((conf) => new Date(conf.date) < currentDate)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Konferensiyalar yuklanmoqda...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
            Konferensiyalar
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Ilmiy konferensiyalar va tadbirlar haqida ma'lumotlar. Eng so'nggi tadbirlar va ularning natijalari.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg max-w-md mx-auto">
              <p className="text-sm">API xatolik: {error}</p>
              <p className="text-xs mt-1">Statik ma'lumotlar ko'rsatilmoqda</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Content - Conference Tabs */}
            <div className="col-span-12 lg:col-span-8">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
                  <TabsTrigger value="upcoming">Kelayotgan tadbirlar</TabsTrigger>
                  <TabsTrigger value="past">O'tgan tadbirlar</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-6">
                  {upcomingConferences.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                        Kelayotgan konferensiyalar mavjud emas
                      </h3>
                      <p className="text-muted-foreground">Tez orada yangi konferensiyalar qo'shiladi.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {upcomingConferences.map((conference) => (
                        <Card
                          key={conference.slug}
                          className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-gradient-to-b from-background to-primary/2"
                        >
                          <div className="aspect-[16/9] relative overflow-hidden">
                            <Image
                              src={
                                conference.image
                                  ? `http://127.0.0.1:8000${conference.image}`
                                  : "/business-conference.png"
                              }
                              alt={conference.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="absolute top-4 left-4 right-4 flex justify-between">
                              <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg">
                                Xalqaro
                              </Badge>
                              <Badge variant="outline" className="border-0 shadow-lg bg-green-500/90 text-white">
                                Ro'yxatdan o'tish ochiq
                              </Badge>
                            </div>
                          </div>

                          <CardHeader className="pb-3 space-y-2">
                            <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                              {conference.name}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                              <div dangerouslySetInnerHTML={{ __html: conference.description }} />
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="font-medium">{formatDate(conference.date)}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="line-clamp-1">{conference.manzil}</span>
                              </div>
                              {conference.tashkilotchi_hamkorlar && (
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                  <Users className="h-4 w-4 text-primary" />
                                  <span className="line-clamp-1">{conference.tashkilotchi_hamkorlar}</span>
                                </div>
                              )}
                            </div>

                            <Button asChild className="w-full hover:shadow-lg transition-all duration-300">
                              <Link href={`/${lang}/conferences/${conference.slug}`}>Batafsil ma'lumot</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-6">
                  {pastConferences.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                        O'tgan konferensiyalar mavjud emas
                      </h3>
                      <p className="text-muted-foreground">Hozircha o'tgan tadbirlar ro'yxati bo'sh.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {pastConferences.map((conference) => (
                        <Card
                          key={conference.slug}
                          className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-gradient-to-b from-background to-muted/20"
                        >
                          <div className="aspect-[16/9] relative overflow-hidden">
                            <Image
                              src={
                                conference.image
                                  ? `http://127.0.0.1:8000${conference.image}`
                                  : "/past-conference.jpg"
                              }
                              alt={conference.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="absolute top-4 left-4 right-4 flex justify-between">
                              <Badge className="bg-muted/90 text-muted-foreground border-0 shadow-lg">Xalqaro</Badge>
                              <Badge variant="outline" className="bg-gray-500/90 text-white border-0 shadow-lg">
                                Yakunlangan
                              </Badge>
                            </div>
                          </div>

                          <CardHeader className="pb-3 space-y-2">
                            <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                              {conference.name}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                              <div dangerouslySetInnerHTML={{ __html: conference.description }} />
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="font-medium">{formatDate(conference.date)}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="line-clamp-1">{conference.manzil}</span>
                              </div>
                              {conference.tashkilotchi_hamkorlar && (
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                  <Users className="h-4 w-4 text-primary" />
                                  <span className="line-clamp-1">{conference.tashkilotchi_hamkorlar}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex space-x-2">
                              <Button asChild className="flex-1 hover:shadow-lg transition-all duration-300">
                                <Link href={`/${lang}/conferences/${conference.slug}`}>Ko'rish</Link>
                              </Button>
                              {conference.pdf && (
                                <Button variant="outline" className="bg-transparent">
                                  Materiallar
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="sticky top-24">
                <aside className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Konferensiya ma'lumotlari
                    </h3>

                    {/* Upcoming Conferences Section */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-green-600" />
                        Kelayotgan konferensiyalar
                      </h4>
                      <ul className="space-y-2">
                        {upcomingConferences.slice(0, 3).map((conference) => (
                          <li key={conference.slug}>
                            <div className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                                    {conference.name}
                                  </h5>
                                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span className="line-clamp-1">{conference.manzil}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>{formatDate(conference.date)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                                asChild
                              >
                                <Link href={`/${lang}/conferences/${conference.slug}`}>Batafsil</Link>
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Past Conferences Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-red-600" />
                        O'tgan konferensiyalar
                      </h4>
                      <ul className="space-y-2">
                        {pastConferences.slice(0, 3).map((conference) => (
                          <li key={conference.slug}>
                            <div className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                                    {conference.name}
                                  </h5>
                                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span className="line-clamp-1">{conference.manzil}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>{formatDate(conference.date)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-xs"
                                asChild
                              >
                                <Link href={`/${lang}/conferences/${conference.slug}`}>Ko'rish</Link>
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
            Tadbir tashkil qilish
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto text-pretty">
            O'zingizning konferensiyangizni tashkil qiling va ilmiy hamjamiyat bilan bo'lishing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button size="lg">Taklif yuborish</Button>
            <Button variant="outline" size="lg" className="bg-transparent">
              Qo'llanma yuklab olish
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

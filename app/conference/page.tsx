"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// TypeScript interfaces for API data
interface Conference {
  id: number
  name: string
  slug: string
  date: string
  manzil: string
  tashkilotchi_hamkorlar?: string
  description?: string
}

interface ApiData {
  conferences: Conference[]
}

export default function ConferencePage() {
  // State for API data, loading, and error handling
  const [apiData, setApiData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API fetch function
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://127.0.0.1:8000/{lang}/conferences/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFTOKEN": "ge5LPjKk38e4pNY1WTpudaWQXJWCqrdOWLzZbu7ZWp0pjL3NwXE0L5XmY3u59VK1",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const conferences = await response.json()
        setApiData({ conferences })
        setError(null)
      } catch (err) {
        console.error("API xatolik:", err)
        setError(err instanceof Error ? err.message : "Ma'lumotlarni yuklashda xatolik")
      } finally {
        setLoading(false)
      }
    }

    fetchApiData()
  }, [])

  const apiConferences = apiData?.conferences || []

  // Separate upcoming and past conferences based on date
  const currentDate = new Date()
  const upcomingApiConferences = apiConferences.filter((conf) => new Date(conf.date) >= currentDate)
  const pastApiConferences = apiConferences.filter((conf) => new Date(conf.date) < currentDate)

  const upcomingConferences = [
    ...upcomingApiConferences.map((conf) => ({
      id: conf.slug || conf.id.toString(),
      title: conf.name,
      date: conf.date,
      endDate: conf.date, // Using same date as API doesn't provide end date
      location: conf.manzil,
      description: conf.description || "Konferensiya haqida qo'shimcha ma'lumot mavjud emas.",
      participants: "100+", // Default value as API doesn't provide this
      status: "Ro'yxatdan o'tish ochiq",
      category: "Xalqaro",
      organizer: conf.tashkilotchi_hamkorlar || "O'zbekiston Madaniyat va San'at Instituti",
      image: "/academic-conference-hall-with-people-presenting-cu.png",
    })),
    // Static fallback data when API is empty
    ...(apiConferences.length === 0
      ? [
          {
            id: "art-culture-2024",
            title: "O'zbekiston madaniyati va san'ati: zamonaviy muammolar va yechimlar",
            date: "2024-05-15",
            endDate: "2024-05-17",
            location: "Toshkent, O'zbekiston Madaniyat va San'at Instituti",
            description:
              "O'zbekiston madaniyati va san'atining zamonaviy holatini o'rganish, muammolarni aniqlash va yechim yo'llarini topishga bag'ishlangan xalqaro ilmiy-amaliy konferensiya.",
            participants: "200+",
            status: "Ro'yxatdan o'tish ochiq",
            category: "Xalqaro",
            organizer: "O'zbekiston Madaniyat va San'at Instituti",
            image: "/academic-conference-hall-with-people-presenting-cu.png",
          },
          {
            id: "digital-heritage-2024",
            title: "Raqamli meros: madaniy boyliklarni saqlash va tarqatish",
            date: "2024-06-20",
            endDate: "2024-06-22",
            location: "O'zbekiston Madaniyat va San'at Instituti",
            description:
              "Madaniy merosni raqamlashtirish, saqlash va keng jamoatchilikka yetkazish bo'yicha zamonaviy texnologiyalar va usullar haqida konferensiya.",
            participants: "150+",
            status: "Tez orada",
            category: "Milliy",
            organizer: "O'zbekiston Madaniyat va San'at Instituti",
            image: "/digital-technology-preserving-cultural-heritage-ar.png",
          },
          {
            id: "folklore-studies-2024",
            title: "Folklor tadqiqotlari: an'ana va innovatsiya",
            date: "2024-07-10",
            endDate: "2024-07-12",
            location: "O'zbekiston Madaniyat va San'at Instituti",
            description:
              "O'zbek xalq og'zaki ijodini o'rganishda an'anaviy va zamonaviy yondashuvlar, folklor tadqiqotlarining istiqbollari haqida ilmiy konferensiya.",
            participants: "120+",
            status: "Abstrakt qabul qilinmoqda",
            category: "Milliy",
            organizer: "O'zbekiston Madaniyat va San'at Instituti",
            image: "/traditional-uzbek-folklore-performance-with-musici.png",
          },
        ]
      : []),
  ]

  const pastConferences = [
    ...pastApiConferences.map((conf) => ({
      id: conf.slug || conf.id.toString(),
      title: conf.name,
      date: conf.date,
      endDate: conf.date,
      location: conf.manzil,
      description: conf.description || "Konferensiya haqida qo'shimcha ma'lumot mavjud emas.",
      participants: "100",
      status: "Yakunlangan",
      category: "Xalqaro",
      organizer: conf.tashkilotchi_hamkorlar || "O'zbekiston Madaniyat va San'at Instituti",
      materials: "Mavjud",
      image: "/international-conference-on-cultural-identity-with.png",
    })),
    // Static fallback data when API is empty
    ...(apiConferences.length === 0
      ? [
          {
            id: "cultural-identity-2023",
            title: "Madaniy o'ziga xoslik va globallashuv jarayonlari",
            date: "2023-11-15",
            endDate: "2023-11-17",
            location: "Toshkent, Madaniyat va San'at Instituti",
            description:
              "Globallashuv sharoitida milliy madaniy o'ziga xoslikni saqlash va rivojlantirish masalalari bo'yicha xalqaro konferensiya.",
            participants: "180",
            status: "Yakunlangan",
            category: "Xalqaro",
            organizer: "Madaniyat va San'at Instituti",
            materials: "Mavjud",
            image: "/international-conference-on-cultural-identity-with.png",
          },
          {
            id: "traditional-crafts-2023",
            title: "An'anaviy hunarmandchilik: meros va zamonaviylik",
            date: "2023-09-20",
            endDate: "2023-09-22",
            location: "O'zbekiston Madaniyat va San'at Instituti",
            description:
              "O'zbekiston an'anaviy hunarmandchiligini zamonaviy sharoitda rivojlantirish va yoshlarga o'rgatish masalalari bo'yicha konferensiya.",
            participants: "95",
            status: "Yakunlangan",
            category: "Milliy",
            organizer: "O'zbekiston Madaniyat va San'at Instituti",
            materials: "Mavjud",
            image: "/traditional-uzbek-craftsmen-working-on-pottery-and.png",
          },
        ]
      : []),
  ]

  if (loading) {
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

      {/* Header Section */}
      <section className="py-12 sm:py-16 lg:py-20 responsive-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
            Ilmiy konferensiyalar
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Madaniyat, san'at va ilm-fan sohasidagi eng muhim tadbirlar va konferensiyalar haqida ma'lumot
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg max-w-md mx-auto">
              <p className="text-sm">API xatolik: {error}</p>
              <p className="text-xs mt-1">Statik ma'lumotlar ko'rsatilmoqda</p>
            </div>
          )}
        </div>
      </section>

      {/* Conference Tabs */}
      <section className="py-12 sm:py-16 responsive-padding">
        <div className="container mx-auto">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Content - Conference Tabs */}
            <div className="col-span-8">
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
                  <TabsTrigger value="upcoming">Kelgusi tadbirlar</TabsTrigger>
                  <TabsTrigger value="past">O'tgan tadbirlar</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {upcomingConferences.slice(0, 3).map((conference) => (
                      <Card
                        key={conference.id}
                        className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-gradient-to-b from-background to-primary/2"
                      >
                        <div className="aspect-[16/9] relative overflow-hidden">
                          <Image
                            src={conference.image || "/placeholder.svg"}
                            alt={conference.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute top-4 left-4 right-4 flex justify-between">
                            <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg">
                              {conference.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`border-0 shadow-lg ${
                                conference.status === "Ro'yxatdan o'tish ochiq"
                                  ? "bg-green-500/90 text-white"
                                  : "bg-orange-500/90 text-white"
                              }`}
                            >
                              {conference.status}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-3 space-y-2">
                          <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                            {conference.title}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: conference.description }} />
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {conference.date} - {conference.endDate}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="line-clamp-1">{conference.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="font-medium">{conference.participants} ishtirokchi</span>
                            </div>
                          </div>

                          <div className="text-sm text-muted-foreground p-3 bg-primary/5 rounded-lg">
                            <strong className="text-foreground">Tashkilotchi:</strong> {conference.organizer}
                          </div>

                          <Button
                            asChild
                            className="w-full hover-primary group-hover:shadow-lg transition-all duration-300"
                          >
                            <Link href={`/conference/${conference.id}`}>Batafsil ma'lumot</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="past" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {pastConferences.map((conference) => (
                      <Card
                        key={conference.id}
                        className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-gradient-to-b from-background to-muted/20"
                      >
                        <div className="aspect-[16/9] relative overflow-hidden">
                          <Image
                            src={conference.image || "/placeholder.svg"}
                            alt={conference.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute top-4 left-4 right-4 flex justify-between">
                            <Badge className="bg-muted/90 text-muted-foreground border-0 shadow-lg">
                              {conference.category}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-500/90 text-white border-0 shadow-lg">
                              {conference.status}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-3 space-y-2">
                          <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                            {conference.title}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: conference.description }} />
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {conference.date} - {conference.endDate}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="line-clamp-1">{conference.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Users className="h-4 w-4 text-primary" />
                              <span className="font-medium">{conference.participants} ishtirokchi</span>
                            </div>
                          </div>

                          <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                            <strong className="text-foreground">Tashkilotchi:</strong> {conference.organizer}
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              asChild
                              className="flex-1 hover-primary group-hover:shadow-lg transition-all duration-300"
                            >
                              <Link href={`/conference/${conference.id}`}>Ko'rish</Link>
                            </Button>
                            {conference.materials && (
                              <Button variant="outline" className="bg-transparent hover-primary">
                                Materiallar
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar - Conference Information */}
            <div className="col-span-4">
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
                        Kelgusi konferensiyalar
                      </h4>
                      <ul className="space-y-2">
                        {upcomingConferences.map((conference) => (
                          <li key={conference.id}>
                            <div className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                                    {conference.title}
                                  </h5>
                                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span className="line-clamp-1">{conference.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>{conference.date}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Users className="h-3 w-3 mr-1" />
                                      <span>{conference.participants}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                              >
                                Batafsil
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
                        {pastConferences.map((conference) => (
                          <li key={conference.id}>
                            <div className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                                    {conference.title}
                                  </h5>
                                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span className="line-clamp-1">{conference.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      <span>{conference.date}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Users className="h-3 w-3 mr-1" />
                                      <span>{conference.participants}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-xs"
                              >
                                Batafsil
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

      {/* Call to Action */}
      <section className="py-16 responsive-padding bg-gradient-to-b from-primary/5 to-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
            O'z tadbiringizni tashkil qiling
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto text-pretty">
            Ilmiy konferensiya yoki seminar tashkil qilmoqchimisiz? Biz sizga yordam beramiz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button size="lg" className="hover-primary">
              Taklif yuborish
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent hover-primary">
              Qo'llanma yuklab olish
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

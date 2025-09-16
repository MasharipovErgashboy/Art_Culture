"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, User, Eye, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Journal {
  id: number
  name: string
  name_uz?: string
  name_en?: string
  name_ru?: string
  description: string
  description_uz?: string
  description_en?: string
  description_ru?: string
  issn?: string
  image?: string
  slug: string
  slug_uz?: string
  slug_en?: string
  slug_ru?: string
  about?: string
  about_uz?: string
  about_en?: string
  about_ru?: string
  editorial_team?: string
  editorial_team_uz?: string
  editorial_team_en?: string
  editorial_team_ru?: string
  article_submission?: string
  article_submission_uz?: string
  article_submission_en?: string
  article_submission_ru?: string
  last_update: string
  issues_count: number
  created_at: string
}

export default function JournalsPage() {
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://127.0.0.1:8000/{lang}/journals/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRFTOKEN": "eJuCzMPXzuceRF25yOKmMxM4xf4mqGj35Y0XH5SmFgz83slSgqvKu3WpN7SfScL3",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setJournals(data)
        setError(null)
      } catch (err) {
        console.error("Journals API xatolik:", err)
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi")
      } finally {
        setLoading(false)
      }
    }

    fetchJournals()
  }, [])

  const mostReadJournals = [
    {
      id: "uzbekistan-culture-art",
      title: "O'zbekiston madaniyati va san'ati",
      views: "12,450",
      rating: 4.8,
      image: "/uzbekistan-culture-art-journal-cover.png",
      category: "Madaniyat",
    },
    {
      id: "scientific-heritage",
      title: "Ilmiy meros tadqiqotlari",
      views: "8,920",
      rating: 4.6,
      image: "/placeholder-j65e2.png",
      category: "Ilm-fan",
    },
    {
      id: "cultural-studies",
      title: "Madaniyatshunoslik",
      views: "7,340",
      rating: 4.7,
      image: "/placeholder-1loz8.png",
      category: "Madaniyatshunoslik",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-10 sm:py-12 responsive-padding">
        <div className="container mx-auto">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-lg text-muted-foreground">Jurnallar yuklanmoqda...</div>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center py-20">
              <div className="text-lg text-red-600 bg-red-50 px-6 py-4 rounded-lg border border-red-200">{error}</div>
            </div>
          )}

          {!loading && !error && (
            <div className="flex gap-6">
              <div className="w-80 flex-shrink-0 hidden lg:block">
                <div className="sticky top-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-border/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/30">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Eng ko'p o'qilgan</h2>
                  </div>

                  <div className="space-y-4">
                    {mostReadJournals.map((journal, index) => (
                      <div
                        key={journal.id}
                        className="group cursor-pointer bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/30 hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:bg-background/80"
                      >
                        <div className="flex gap-4">
                          <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                            <Image
                              src={journal.image || "/placeholder.svg"}
                              alt={journal.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute -top-1 -left-1 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-background">
                              {index + 1}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2 leading-tight">
                              {journal.title}
                            </h3>

                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-1 mb-3 bg-primary/10 text-primary border-primary/20"
                            >
                              {journal.category}
                            </Badge>

                            <div className="flex items-center justify-between mb-3 text-xs">
                              <div className="flex items-center gap-1 text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                <Eye className="h-3 w-3" />
                                <span className="font-medium">{journal.views}</span>
                              </div>
                              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium text-yellow-700">{journal.rating}</span>
                              </div>
                            </div>

                            <Button
                              size="sm"
                              className="w-full h-8 text-xs bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary border border-primary/20 hover:border-primary transition-all duration-300 font-medium"
                              asChild
                            >
                              <Link href={`/journals/${journal.id}`}>
                                <BookOpen className="h-3 w-3 mr-1" />
                                O'qish
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/30">
                    <Button
                      variant="outline"
                      className="w-full hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                    >
                      Barchasini ko'rish
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="responsive-grid">
                  {journals.length > 0 ? (
                    journals.map((journal) => (
                      <Card
                        key={journal.id}
                        className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-gradient-to-b from-background to-primary/2 h-fit"
                      >
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <Image
                            src={journal.image || "/placeholder.svg"}
                            alt={journal.name_uz || journal.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="absolute top-4 left-4 right-4 flex justify-between">
                            <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg">Jurnal</Badge>
                            <Badge variant="outline" className="bg-background/95 border-0 shadow-lg">
                              Faol
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-3 space-y-2">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="font-medium">ISSN: {journal.issn || "N/A"}</span>
                            <span className="bg-primary/10 px-2 py-1 rounded text-primary font-medium">
                              {new Date(journal.created_at).getFullYear()}
                            </span>
                          </div>

                          <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                            {journal.name_uz || journal.name}
                          </CardTitle>

                          <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                            {journal.description_uz || journal.description ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: journal.description_uz || journal.description,
                                }}
                              />
                            ) : (
                              "Tavsif mavjud emas"
                            )}
                          </CardDescription>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                            <User className="h-4 w-4 text-primary" />
                            <span className="font-medium line-clamp-1">{journal.issues_count} ta son</span>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0 space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>
                              So'nggi yangilanish: {new Date(journal.last_update).toLocaleDateString("uz-UZ")}
                            </span>
                          </div>

                          <Button
                            asChild
                            className="w-full hover-primary group-hover:shadow-lg transition-all duration-300"
                            size="default"
                          >
                            <Link href={`/journals/${journal.slug_uz || journal.slug}`}>
                              <BookOpen className="mr-2 h-4 w-4" />
                              Batafsil ko'rish
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <div className="text-lg text-muted-foreground">Hozircha jurnallar mavjud emas</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

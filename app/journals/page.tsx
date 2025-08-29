import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, User, Eye, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function JournalsPage() {
  const journals = [
    {
      id: "uzbekistan-culture-art",
      title: "O'zbekiston madaniyati va san'ati",
      description:
        "O'zbekiston madaniyati, san'ati va merosiga bag'ishlangan ilmiy jurnal. Tarix, adabiyot, tasviriy san'at va musiqa sohasidagi tadqiqotlar.",
      issn: "2181-9092",
      year: "2024",
      issue: "4-son",
      author: "O'zbekiston Madaniyat va San'at Instituti",
      image: "/uzbekistan-culture-art-journal-cover.png",
      category: "Madaniyat",
      status: "Faol",
      lastUpdate: "2024-03-15",
    },
    {
      id: "scientific-heritage",
      title: "О‘zbekiston davlat san’at va madaniyat instituti xabarlari",
      description:
        "Ilmiy meros va zamonaviy tadqiqotlar sohasidagi eng so'nggi ishlanmalar va kashfiyotlar haqida ma'lumotlar.",
      issn: "2181-8754",
      year: "2024",
      issue: "2-son",
      author: "O'zbekiston Madaniyat va San'at Instituti",
      image: "/placeholder-j65e2.png",
      category: "Ilm-fan",
      status: "Faol",
      lastUpdate: "2024-03-10",
    },
    {
      id: "cultural-studies",
      title: "Madaniyatshunoslik tadqiqotlari",
      description:
        "Madaniyatshunoslik, etnografiya va antropologiya sohasidagi fundamental va amaliy tadqiqotlar jurnali.",
      issn: "2181-7634",
      year: "2024",
      issue: "1-son",
      author: "O'zbekiston Madaniyat va San'at Instituti",
      image: "/placeholder-1loz8.png",
      category: "Madaniyatshunoslik",
      status: "Faol",
      lastUpdate: "2024-02-28",
    },
  ]

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

      {/* Journals Section */}
      <section className="py-10 sm:py-12 responsive-padding">
        <div className="container mx-auto">
          <div className="flex gap-6">
            {/* Sidebar: Eng ko‘p o‘qilgan jurnallar */}
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

            {/* Main Journals Grid */}
            <div className="flex-1">
              <div className="responsive-grid">
                {journals.map((journal) => (
                  <Card
                    key={journal.id}
                    className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-gradient-to-b from-background to-primary/2 h-fit"
                  >
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <Image
                        src={journal.image || "/placeholder.svg"}
                        alt={journal.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute top-4 left-4 right-4 flex justify-between">
                        <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg">
                          {journal.category}
                        </Badge>
                        <Badge variant="outline" className="bg-background/95 border-0 shadow-lg">
                          {journal.status}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pb-3 space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="font-medium">ISSN: {journal.issn}</span>
                        <span className="bg-primary/10 px-2 py-1 rounded text-primary font-medium">
                          {journal.year}, {journal.issue}
                        </span>
                      </div>

                      <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {journal.title}
                      </CardTitle>

                      <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                        {journal.description}
                      </CardDescription>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-medium line-clamp-1">{journal.author}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>So'nggi yangilanish: {journal.lastUpdate}</span>
                      </div>

                      <Button
                        asChild
                        className="w-full hover-primary group-hover:shadow-lg transition-all duration-300"
                        size="default"
                      >
                        <Link href={`/journals/${journal.id}`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Batafsil ko'rish
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, User } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <section className="py-12 sm:py-16 lg:py-20 responsive-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
              Ilmiy jurnallar
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Madaniyat, san'at va ilm-fan sohasidagi eng so'nggi tadqiqotlar va maqolalar to'plami
            </p>
          </div>
        </div>
      </section>

      {/* Journals Grid */}
      <section className="py-10 sm:py-1 responsive-padding">
        <div className="container mx-auto">
          <div className="responsive-grid max-w-6xl mx-auto">
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

          <div className="text-center mt-12 sm:mt-16">
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

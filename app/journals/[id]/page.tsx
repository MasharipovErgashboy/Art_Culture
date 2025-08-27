"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, BookOpen, Download, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

// Mock data - in real app this would come from database
const journalsData = {
  "uzbekistan-culture-art": {
    id: "uzbekistan-culture-art",
    title: "O'zbekiston madaniyati va san'ati",
    description:
      "O'zbekiston madaniyati, san'ati va merosiga bag'ishlangan ilmiy jurnal. Bu jurnal tarix, adabiyot, tasviriy san'at va musiqa sohasidagi fundamental va amaliy tadqiqotlarni o'z ichiga oladi. Jurnal O'zbekiston madaniyati va san'atining boy merosini zamonaviy ilmiy yondashuvlar bilan o'rganishga qaratilgan.",
    fullDescription:
      "O'zbekiston madaniyati va san'ati jurnali 2020-yilda tashkil etilgan bo'lib, madaniyat va san'at sohasidagi ilmiy tadqiqotlarni rivojlantirishga qaratilgan. Jurnal yiliga 4 marta nashr etiladi va har bir sonda 15-20 ta ilmiy maqola joylashtiriladi. Jurnal maqolalari o'zbek, rus va ingliz tillarida qabul qilinadi.",
    issn: "2181-9092",
    year: "2024",
    issue: "4-son",
    author: "O'zbekiston Madaniyat va San'at Instituti",
    editor: "Prof. Karimov A.B.",
    publishDate: "2024-03-15",
    pages: "156",
    image: "/uzbekistan-culture-art-journal-cover.png",
    category: "Madaniyat",
    status: "Faol",
    price: "50,000 so'm",
    updates: [
      {
        id: "update-1",
        title: "4-son (2024) - Yangi maqolalar",
        date: "2024-03-15",
        description: "O'zbekiston xalq san'ati va zamonaviy madaniyat o'rtasidagi bog'liqlik haqida yangi tadqiqotlar",
      },
      {
        id: "update-2",
        title: "3-son (2024) - Maxsus nashr",
        date: "2024-02-10",
        description: "Amir Temur davri madaniyati va san'atiga bag'ishlangan maxsus nashr",
      },
    ],
  },
  "scientific-heritage": {
    id: "scientific-heritage",
    title: "Ilmiy meros va zamonaviy tadqiqotlar",
    description:
      "Ilmiy meros va zamonaviy tadqiqotlar sohasidagi eng so'nggi ishlanmalar va kashfiyotlar haqida ma'lumotlar.",
    fullDescription:
      "Bu jurnal ilmiy merosni saqlash va zamonaviy tadqiqot usullarini qo'llash orqali yangi bilimlar yaratishga qaratilgan. Jurnal tabiiy fanlar, ijtimoiy fanlar va gumanitar fanlar sohasidagi tadqiqotlarni qamrab oladi.",
    issn: "2181-8754",
    year: "2024",
    issue: "2-son",
    author: "Ilmiy Tadqiqotlar Markazi",
    editor: "Prof. Abdullayev S.M.",
    publishDate: "2024-03-10",
    pages: "142",
    image: "/placeholder-j65e2.png",
    category: "Ilm-fan",
    status: "Faol",
    price: "45,000 so'm",
    updates: [
      {
        id: "update-1",
        title: "2-son (2024) - Innovatsion tadqiqotlar",
        date: "2024-03-10",
        description: "Sun'iy intellekt va mashinali o'rganish sohasidagi so'nggi yutuqlar",
      },
    ],
  },
  "cultural-studies": {
    id: "cultural-studies",
    title: "Madaniyatshunoslik tadqiqotlari",
    description:
      "Madaniyatshunoslik, etnografiya va antropologiya sohasidagi fundamental va amaliy tadqiqotlar jurnali.",
    fullDescription:
      "Madaniyatshunoslik tadqiqotlari jurnali O'zbekiston va Markaziy Osiyo xalqlarining madaniy merosini o'rganishga bag'ishlangan. Jurnal etnografiya, antropologiya, folkloristika va madaniy antropologiya sohasidagi tadqiqotlarni nashr etadi.",
    issn: "2181-7634",
    year: "2024",
    issue: "1-son",
    author: "Madaniyatshunoslik Instituti",
    editor: "Prof. Rahimova N.K.",
    publishDate: "2024-02-28",
    pages: "128",
    image: "/placeholder-1loz8.png",
    category: "Madaniyatshunoslik",
    status: "Faol",
    price: "40,000 so'm",
    updates: [
      {
        id: "update-1",
        title: "1-son (2024) - Etnografik tadqiqotlar",
        date: "2024-02-28",
        description: "O'zbekiston xalqlarining an'anaviy hunarmandchiligi haqida yangi ma'lumotlar",
      },
    ],
  },
}

export default function JournalDetailPage({ params }: { params: { id: string } }) {
  const journal = journalsData[params.id as keyof typeof journalsData]

  if (!journal) {
    notFound()
  }

  const handlePreview = () => {
    // Open PDF in new window
    window.open(`/pdfs/journals/${journal.id}.pdf`, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <section className="py-6 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Bosh sahifa
            </Link>
            <span>/</span>
            <Link href="/journals" className="hover:text-primary">
              Jurnallar
            </Link>
            <span>/</span>
            <span className="text-foreground">{journal.title}</span>
          </div>
        </div>
      </section>

      {/* Journal Detail */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Journal Cover and Info */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <div className="aspect-[3/4] relative mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={journal.image || "/placeholder.svg"}
                      alt={journal.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground mb-2">
                        {journal.category}
                      </Badge>
                      <h1 className="text-2xl font-bold text-foreground mb-2">{journal.title}</h1>
                      <p className="text-muted-foreground">{journal.description}</p>
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>ISSN:</strong> {journal.issn}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>Nashr sanasi:</strong> {journal.publishDate}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>Muharrir:</strong> {journal.editor}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>Sahifalar:</strong> {journal.pages}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-primary">{journal.price}</div>
                      <Button className="w-full" size="lg" asChild>
                        <Link href={`/checkout?type=journal&id=${journal.id}`}>
                          <Download className="mr-2 h-4 w-4" />
                          Sotib olish
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" onClick={handlePreview}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Namuna ko'rish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Journal Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <Button variant="ghost" asChild className="mb-6 p-0 h-auto">
                  <Link href="/journals" className="flex items-center text-muted-foreground hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Jurnallarga qaytish
                  </Link>
                </Button>
              </div>

              {/* Full Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Jurnal haqida</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{journal.fullDescription}</p>
                </CardContent>
              </Card>

              {/* Latest Updates */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>So'nggi yangilanishlar</CardTitle>
                  <Button variant="outline" size="sm" asChild className="bg-transparent">
                    <Link href={`/journals/${journal.id}/updates`}>Barcha yangilanishlar</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {journal.updates.map((update) => (
                      <Card key={update.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{update.title}</CardTitle>
                            <span className="text-sm text-muted-foreground">{update.date}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <CardDescription className="mb-3">{update.description}</CardDescription>
                          <Button variant="outline" size="sm" asChild className="bg-transparent">
                            <Link href={`/journals/${journal.id}/updates/${update.id}`}>Batafsil</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

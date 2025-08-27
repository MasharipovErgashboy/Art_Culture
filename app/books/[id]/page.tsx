"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, BookOpen, Download, ArrowLeft, ExternalLink, Building } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Mock data - in real app this would come from database
const booksData = {
  "uzbek-culture-history": {
    id: "uzbek-culture-history",
    title: "O'zbekiston madaniyati tarixi",
    description: "O'zbekiston madaniyatining qadimgi davrlardan hozirgi kungacha bo'lgan rivojlanish tarixi.",
    fullDescription:
      "Bu kitob O'zbekiston madaniyatining boy tarixini o'rganishga bag'ishlangan fundamental asardir. Kitobda qadimgi davrlardan tortib to zamonaviy davrgacha bo'lgan madaniy rivojlanish bosqichlari batafsil yoritilgan. Xalq an'analari, hunarmandchilik, adabiyot va san'at tarixiga oid keng qamrovli ma'lumotlar keltirilgan. Kitob oliy o'quv yurtlari talabalari, tadqiqotchilar va madaniyat sohasida faoliyat yurituvchi mutaxassislar uchun mo'ljallangan.",
    isbn: "978-9943-01-234-5",
    year: "2023",
    edition: "2-nashr",
    author: "Prof. Karimov Abdulla Bakhtiyor o'g'li",
    publisher: "O'zbekiston Madaniyat Nashri",
    publishDate: "2023-09-15",
    pages: "456",
    image: "/placeholder.svg?key=book1-detail",
    category: "Tarix",
    language: "O'zbek",
    price: "120,000 so'm",
    tableOfContents: [
      {
        chapter: "1-bob",
        title: "Qadimgi davr madaniyati",
        pages: "15-45",
        pdfUrl: "#",
      },
      {
        chapter: "2-bob",
        title: "O'rta asr madaniy merosi",
        pages: "46-98",
        pdfUrl: "#",
      },
      {
        chapter: "3-bob",
        title: "Temuriylar davri san'ati",
        pages: "99-156",
        pdfUrl: "#",
      },
      {
        chapter: "4-bob",
        title: "XVIII-XIX asr madaniyati",
        pages: "157-234",
        pdfUrl: "#",
      },
      {
        chapter: "5-bob",
        title: "Sovet davri madaniy o'zgarishlar",
        pages: "235-312",
        pdfUrl: "#",
      },
      {
        chapter: "6-bob",
        title: "Mustaqillik davri madaniy tiklanish",
        pages: "313-398",
        pdfUrl: "#",
      },
      {
        chapter: "Xulosa",
        title: "Zamonaviy madaniy rivojlanish istiqbollari",
        pages: "399-430",
        pdfUrl: "#",
      },
    ],
  },
  "central-asian-art": {
    id: "central-asian-art",
    title: "Markaziy Osiyo san'ati",
    description: "Markaziy Osiyo xalqlarining boy san'at merosini o'rganuvchi fundamental asarlar to'plami.",
    fullDescription:
      "Markaziy Osiyo san'ati kitobida mintaqaning boy madaniy merosi va san'at yutuqlari keng yoritilgan. Me'morchilik, tasviriy san'at, amaliy san'at va musiqa sohasidagi noyob namunalar tahlil qilingan. Kitob san'atshunoslik, madaniyatshunoslik va tarix yo'nalishlarida tahsil olayotgan talabalar hamda mutaxassislar uchun qimmatli manba hisoblanadi.",
    isbn: "978-9943-01-567-8",
    year: "2023",
    edition: "1-nashr",
    author: "Prof. Rahimova Saida Karimovna",
    publisher: "Ilm-Fan Nashri",
    publishDate: "2023-11-20",
    pages: "384",
    image: "/placeholder.svg?key=book2-detail",
    category: "San'at",
    language: "O'zbek",
    price: "95,000 so'm",
    tableOfContents: [
      {
        chapter: "1-bob",
        title: "Markaziy Osiyo me'morchiligi",
        pages: "12-78",
        pdfUrl: "#",
      },
      {
        chapter: "2-bob",
        title: "Tasviriy san'at namunalari",
        pages: "79-145",
        pdfUrl: "#",
      },
      {
        chapter: "3-bob",
        title: "Amaliy san'at va hunarmandchilik",
        pages: "146-234",
        pdfUrl: "#",
      },
      {
        chapter: "4-bob",
        title: "Musiqa va ijro san'ati",
        pages: "235-298",
        pdfUrl: "#",
      },
      {
        chapter: "5-bob",
        title: "Zamonaviy san'at rivojlanishi",
        pages: "299-356",
        pdfUrl: "#",
      },
    ],
  },
  "uzbek-folklore": {
    id: "uzbek-folklore",
    title: "O'zbek xalq og'zaki ijodi",
    description:
      "O'zbek xalqining boy og'zaki ijodi namunalari: ertaklar, rivoyatlar, maqollar, topishmoqlar va boshqa folklor janrlari.",
    fullDescription:
      "O'zbek xalq og'zaki ijodi kitobida xalqimizning asrlar davomida yaratgan boy ma'naviy merosi to'plangan. Ertaklar, rivoyatlar, maqollar, topishmoqlar, ashulalar va boshqa folklor janrlari ilmiy izohlar bilan birga taqdim etilgan. Kitob filologiya, madaniyatshunoslik va etnografiya sohasida faoliyat yurituvchi mutaxassislar uchun muhim manba hisoblanadi.",
    isbn: "978-9943-01-890-1",
    year: "2024",
    edition: "3-nashr",
    author: "Prof. Yusupova Dilnoza Rahimovna",
    publisher: "Adabiyot va San'at Nashri",
    publishDate: "2024-01-10",
    pages: "512",
    image: "/placeholder.svg?key=book3-detail",
    category: "Adabiyot",
    language: "O'zbek",
    price: "85,000 so'm",
    tableOfContents: [
      {
        chapter: "1-qism",
        title: "Xalq ertaklari",
        pages: "18-98",
        pdfUrl: "#",
      },
      {
        chapter: "2-qism",
        title: "Rivoyat va afsonalar",
        pages: "99-178",
        pdfUrl: "#",
      },
      {
        chapter: "3-qism",
        title: "Maqol va matallar",
        pages: "179-256",
        pdfUrl: "#",
      },
      {
        chapter: "4-qism",
        title: "Topishmoqlar",
        pages: "257-324",
        pdfUrl: "#",
      },
      {
        chapter: "5-qism",
        title: "Xalq ashulalari",
        pages: "325-412",
        pdfUrl: "#",
      },
      {
        chapter: "6-qism",
        title: "Marosim folklori",
        pages: "413-478",
        pdfUrl: "#",
      },
    ],
  },
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const book = booksData[params.id as keyof typeof booksData]

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  if (!book) {
    notFound()
  }

  const handlePreviewClick = () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    // In a real app, this would open the actual PDF file
    window.open(`/pdfs/${book.id}-preview.pdf`, "_blank")
  }

  const handlePurchaseClick = () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    router.push(`/checkout?type=book&id=${book.id}`)
  }

  const handlePdfClick = (pdfUrl: string) => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    window.open(pdfUrl, "_blank")
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
            <Link href="/books" className="hover:text-primary">
              Kitoblar
            </Link>
            <span>/</span>
            <span className="text-foreground">{book.title}</span>
          </div>
        </div>
      </section>

      {/* Book Detail */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Book Cover and Info */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <div className="aspect-[3/4] relative mb-6 overflow-hidden rounded-lg">
                    <Image src={book.image || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground mb-2">
                        {book.category}
                      </Badge>
                      <h1 className="text-2xl font-bold text-foreground mb-2">{book.title}</h1>
                      <p className="text-muted-foreground">{book.description}</p>
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>ISBN:</strong> {book.isbn}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>Nashr sanasi:</strong> {book.publishDate}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>Muallif:</strong> {book.author}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>Nashriyot:</strong> {book.publisher}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>Sahifalar:</strong> {book.pages}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>
                          <strong>Til:</strong> {book.language}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-primary">{book.price}</div>
                      <Button className="w-full hover-primary" size="lg" onClick={handlePurchaseClick}>
                        <Download className="mr-2 h-4 w-4" />
                        Sotib olish
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent hover-primary"
                        onClick={handlePreviewClick}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Namunani ko'rish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Book Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <Button variant="ghost" asChild className="mb-6 p-0 h-auto">
                  <Link href="/books" className="flex items-center text-muted-foreground hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kitoblarga qaytish
                  </Link>
                </Button>
              </div>

              {/* Full Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Kitob haqida</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{book.fullDescription}</p>
                </CardContent>
              </Card>

              {/* Table of Contents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Mundarija
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {book.tableOfContents.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {item.chapter}
                            </Badge>
                            <h3 className="font-semibold text-foreground">{item.title}</h3>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>Sahifalar:</strong> {item.pages}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent hover-primary"
                          onClick={() => handlePdfClick(item.pdfUrl)}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Books */}
              <Card>
                <CardHeader>
                  <CardTitle>Shunga o'xshash kitoblar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-16 h-20 bg-muted rounded flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Markaziy Osiyo san'ati</h4>
                        <p className="text-xs text-muted-foreground mb-2">Prof. Rahimova S.K.</p>
                        <Button variant="outline" size="sm" className="text-xs bg-transparent">
                          Ko'rish
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-16 h-20 bg-muted rounded flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">O'zbek xalq og'zaki ijodi</h4>
                        <p className="text-xs text-muted-foreground mb-2">Prof. Yusupova D.R.</p>
                        <Button variant="outline" size="sm" className="text-xs bg-transparent">
                          Ko'rish
                        </Button>
                      </div>
                    </div>
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

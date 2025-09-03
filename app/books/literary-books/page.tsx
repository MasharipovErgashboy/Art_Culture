"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  User,
  Building,
  FileText,
  Star,
  ShoppingCart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function LiteraryBooksPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 9

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  const handlePurchaseClick = (bookId: string) => {
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      router.push(`/checkout?type=book&id=${bookId}`)
    }
  }

  const literaryBooks = [
    {
      id: "uzbek-folklore",
      title: "O'zbek xalq og'zaki ijodi",
      description: "O'zbek xalqining boy og'zaki ijodi namunalari: ertaklar, rivoyatlar, maqollar va topishmoqlar.",
      isbn: "978-9943-01-890-1",
      year: "2024",
      edition: "3-nashr",
      author: "Prof. Yusupova D.R.",
      publisher: "Adabiyot va San'at Nashri",
      pages: "512",
      image: "/literature-history-textbook-academic-book-cover-pu.png",
      category: "Adabiyot",
      language: "O'zbek",
      price: "85,000 so'm",
      rating: 4.9,
      downloads: "4.1k",
    },
    {
      id: "uzbek-literature",
      title: "O'zbek adabiyoti tarixi",
      description: "O'zbek adabiyotining qadimgi davrlardan zamonaviy davrgacha bo'lgan rivojlanish bosqichlari.",
      isbn: "978-9943-01-456-7",
      year: "2024",
      edition: "1-nashr",
      author: "Prof. Qosimov R.N.",
      publisher: "Adabiyot Nashri",
      pages: "428",
      image: "/mathematics-textbook-academic-book-cover-blue-desi.png",
      category: "Adabiyot",
      language: "O'zbek",
      price: "105,000 so'm",
      rating: 4.6,
      downloads: "2.7k",
    },
    {
      id: "uzbek-theater",
      title: "O'zbek teatr san'ati",
      description: "O'zbek teatr san'atining paydo bo'lishi, rivojlanishi va zamonaviy holati haqida.",
      isbn: "978-9943-01-789-1",
      year: "2024",
      edition: "1-nashr",
      author: "Karimova L.S.",
      publisher: "Teatr San'ati Nashri",
      pages: "356",
      image: "/physics-textbook-academic-book-cover-red-atoms-des.png",
      category: "Teatr",
      language: "O'zbek",
      price: "88,000 so'm",
      rating: 4.3,
      downloads: "1.8k",
    },
    {
      id: "uzbek-poetry",
      title: "O'zbek she'riyati antologiyasi",
      description: "O'zbek she'riyatining eng yaxshi namunalari va mashhur shoirlar ijodi.",
      isbn: "978-9943-01-234-8",
      year: "2023",
      edition: "2-nashr",
      author: "Prof. Nazarov T.K.",
      publisher: "She'riyat Nashri",
      pages: "468",
      image: "/chemistry-textbook-academic-book-cover-green-molec.png",
      category: "She'riyat",
      language: "O'zbek",
      price: "95,000 so'm",
      rating: 4.8,
      downloads: "3.4k",
    },
    {
      id: "modern-uzbek-prose",
      title: "Zamonaviy o'zbek nasri",
      description: "XX-XXI asr o'zbek nasrining eng yaxshi namunalari va tahlili.",
      isbn: "978-9943-01-567-2",
      year: "2024",
      edition: "1-nashr",
      author: "Dr. Rahimova M.A.",
      publisher: "Zamonaviy Adabiyot Nashri",
      pages: "392",
      image: "/economics-theory-textbook-academic-book-cover-gold.png",
      category: "Nasr",
      language: "O'zbek",
      price: "110,000 so'm",
      rating: 4.5,
      downloads: "2.1k",
    },
    {
      id: "uzbek-drama",
      title: "O'zbek dramaturgiyasi",
      description: "O'zbek dramaturgiyasining rivojlanish tarixi va eng mashhur asarlar.",
      isbn: "978-9943-01-678-3",
      year: "2023",
      edition: "3-nashr",
      author: "Prof. Toshmatov A.B.",
      publisher: "Drama Nashri",
      pages: "324",
      image: "/literature-history-textbook-academic-book-cover-pu.png",
      category: "Drama",
      language: "O'zbek",
      price: "92,000 so'm",
      rating: 4.7,
      downloads: "2.8k",
    },
    {
      id: "literary-criticism",
      title: "Adabiy tanqid asoslari",
      description: "Adabiy tanqidning nazariy asoslari va amaliy qo'llanilishi.",
      isbn: "978-9943-01-789-4",
      year: "2024",
      edition: "2-nashr",
      author: "Prof. Karimov S.R.",
      publisher: "Tanqid Nashri",
      pages: "416",
      image: "/mathematics-textbook-academic-book-cover-blue-desi.png",
      category: "Tanqid",
      language: "O'zbek",
      price: "118,000 so'm",
      rating: 4.6,
      downloads: "1.9k",
    },
    {
      id: "world-literature",
      title: "Jahon adabiyoti namunalari",
      description: "Jahon adabiyotining eng mashhur asarlari va ularning o'zbek tilidagi tarjimalari.",
      isbn: "978-9943-01-890-5",
      year: "2023",
      edition: "4-nashr",
      author: "Prof. Yusupov K.M.",
      publisher: "Jahon Adabiyoti Nashri",
      pages: "548",
      image: "/physics-textbook-academic-book-cover-red-atoms-des.png",
      category: "Jahon adabiyoti",
      language: "O'zbek",
      price: "135,000 so'm",
      rating: 4.9,
      downloads: "4.5k",
    },
    {
      id: "children-literature",
      title: "Bolalar adabiyoti",
      description: "Bolalar uchun mo'ljallangan eng yaxshi adabiy asarlar to'plami.",
      isbn: "978-9943-01-901-6",
      year: "2024",
      edition: "1-nashr",
      author: "Abdullayeva N.S.",
      publisher: "Bolalar Adabiyoti Nashri",
      pages: "284",
      image: "/chemistry-textbook-academic-book-cover-green-molec.png",
      category: "Bolalar adabiyoti",
      language: "O'zbek",
      price: "75,000 so'm",
      rating: 4.8,
      downloads: "3.7k",
    },
    {
      id: "comparative-literature",
      title: "Qiyosiy adabiyotshunoslik",
      description: "Turli xalqlar adabiyotlarini qiyosiy o'rganish metodlari va natijalari.",
      isbn: "978-9943-01-012-7",
      year: "2023",
      edition: "2-nashr",
      author: "Prof. Mirzayev R.T.",
      publisher: "Qiyosiy Tadqiqot Nashri",
      pages: "372",
      image: "/economics-theory-textbook-academic-book-cover-gold.png",
      category: "Adabiyotshunoslik",
      language: "O'zbek",
      price: "125,000 so'm",
      rating: 4.4,
      downloads: "1.6k",
    },
    {
      id: "uzbek-literary-heritage",
      title: "O'zbek adabiy merosi",
      description: "O'zbek xalqining boy adabiy merosini saqlash va rivojlantirish masalalari.",
      isbn: "978-9943-01-123-8",
      year: "2024",
      edition: "1-nashr",
      author: "Prof. Rahmonova G.K.",
      publisher: "Adabiy Meros Nashri",
      pages: "496",
      image: "/literature-history-textbook-academic-book-cover-pu.png",
      category: "Adabiy meros",
      language: "O'zbek",
      price: "140,000 so'm",
      rating: 4.7,
      downloads: "2.3k",
    },
  ]

  const totalPages = Math.ceil(literaryBooks.length / booksPerPage)
  const startIndex = (currentPage - 1) * booksPerPage
  const endIndex = startIndex + booksPerPage
  const currentBooks = literaryBooks.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#DCE3F8" }}>
      <Navbar />

      {/* Header Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 text-[#003D7F] hover:text-blue-600 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Kitoblar bo'limlariga qaytish
            </Link>
          </div>

          <div className="text-center mb-12">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8 max-w-6xl mx-auto">
              <div className="w-full lg:w-2/5">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="/literary-books-poetry-novels-green.png"
                    alt="Adabiy kitoblar"
                    width={500}
                    height={400}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
                </div>
              </div>
              <div className="w-full lg:w-3/5">
                <div className="text-left lg:pl-8">
                  <h1 className="text-4xl sm:text-5xl font-bold text-[#003D7F] mb-6">Adabiy kitoblar</h1>
                  <div className="bg-white rounded-xl p-8 shadow-xl border border-emerald-100">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Adabiy kitoblar bo'limi O'zbek va jahon adabiyotining eng yaxshi namunalarini taqdim etadi. Bu
                      yerda klassik asarlar, zamonaviy romanlar, she'riy to'plamlar va adabiy tanqid asarlari bilan
                      tanishishingiz mumkin. Har bir kitob o'z davri va madaniyatining aks ettirilgan ko'zgusi bo'lib,
                      o'quvchilarga boy ma'naviy tajriba taqdim etadi.
                    </p>
                    <div className="mt-6 flex items-center gap-4 text-sm text-emerald-600">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <span className="font-medium">Klassik asarlar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        <span className="font-medium">Zamonaviy adabiyot</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
            {currentBooks.map((book) => (
              <Card
                key={book.id}
                className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-white h-fit"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <Badge className="bg-emerald-600 text-white border-0 shadow-lg">{book.category}</Badge>
                    <Badge variant="outline" className="bg-background/95 border-0 shadow-lg">
                      {book.language}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center justify-between text-white text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{book.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{book.downloads}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3 space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="font-medium">ISBN: {book.isbn}</span>
                    <span className="bg-emerald-100 px-2 py-1 rounded text-emerald-700 font-medium">{book.year}</span>
                  </div>

                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-[#003D7F] transition-colors line-clamp-2 leading-tight">
                    {book.title}
                  </CardTitle>

                  <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {book.description}
                  </CardDescription>

                  <div className="space-y-1 pt-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4 text-[#003D7F]" />
                      <span className="font-medium line-clamp-1">{book.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4 text-[#003D7F]" />
                      <span className="line-clamp-1">{book.publisher}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="text-lg font-bold text-[#003D7F]">{book.price}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 text-[#003D7F]" />
                      <span className="font-medium">{book.pages} sahifa</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-[#003D7F] hover:bg-blue-700 group-hover:shadow-lg transition-all duration-300"
                      size="default"
                    >
                      <Link href={`/books/${book.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Ko'rish
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      className="px-4 hover:bg-[#003D7F] hover:text-white bg-transparent"
                      onClick={() => handlePurchaseClick(book.id)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white hover:bg-[#003D7F] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
                Oldingi
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={
                      currentPage === page
                        ? "bg-[#003D7F] text-white hover:bg-blue-700"
                        : "bg-white hover:bg-[#003D7F] hover:text-white"
                    }
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-white hover:bg-[#003D7F] hover:text-white"
              >
                Keyingi
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
        </div>
      </section>

      <Footer />
    </div>
  )
}

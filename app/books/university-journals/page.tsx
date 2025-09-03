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
  GraduationCap,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function UniversityJournalsPage() {
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

  const universityBooks = [
    {
      id: "uzbek-culture-history",
      title: "O'zbekiston madaniyati tarixi",
      description: "O'zbekiston madaniyatining qadimgi davrlardan hozirgi kungacha bo'lgan rivojlanish tarixi.",
      isbn: "978-9943-01-234-5",
      year: "2023",
      edition: "2-nashr",
      author: "Prof. Karimov A.B.",
      publisher: "O'zbekiston Madaniyat Nashri",
      pages: "456",
      image: "/mathematics-textbook-academic-book-cover-blue-desi.png",
      category: "Tarix",
      language: "O'zbek",
      price: "120,000 so'm",
      rating: 4.8,
      downloads: "3.2k",
    },
    {
      id: "central-asian-art",
      title: "Markaziy Osiyo san'ati",
      description: "Markaziy Osiyo xalqlarining boy san'at merosini o'rganuvchi fundamental asarlar to'plami.",
      isbn: "978-9943-01-567-8",
      year: "2023",
      edition: "1-nashr",
      author: "Prof. Rahimova S.K.",
      publisher: "Ilm-Fan Nashri",
      pages: "384",
      image: "/physics-textbook-academic-book-cover-red-atoms-des.png",
      category: "San'at",
      language: "O'zbek",
      price: "95,000 so'm",
      rating: 4.6,
      downloads: "2.8k",
    },
    {
      id: "samarkand-architecture",
      title: "Samarqand me'morchiligi",
      description: "Samarqand shahrining me'moriy yodgorliklari va ularning san'at jihatdan tahlili.",
      isbn: "978-9943-01-678-9",
      year: "2024",
      edition: "2-nashr",
      author: "Mirzayev A.S.",
      publisher: "Me'morchilik Nashri",
      pages: "296",
      image: "/chemistry-textbook-academic-book-cover-green-molec.png",
      category: "Me'morchilik",
      language: "O'zbek",
      price: "110,000 so'm",
      rating: 4.7,
      downloads: "2.5k",
    },
    {
      id: "uzbek-folklore",
      title: "O'zbek xalq og'zaki ijodi",
      description: "O'zbek xalqining boy og'zaki ijod namunalari va ularning tahlili.",
      isbn: "978-9943-01-789-0",
      year: "2023",
      edition: "3-nashr",
      author: "Prof. Nazarov B.T.",
      publisher: "Xalq Merosi Nashri",
      pages: "512",
      image: "/literature-history-textbook-academic-book-cover-pu.png",
      category: "Folklar",
      language: "O'zbek",
      price: "85,000 so'm",
      rating: 4.9,
      downloads: "4.1k",
    },
    {
      id: "ancient-manuscripts",
      title: "Qadimgi qo'lyozmalar",
      description: "Markaziy Osiyoning qadimgi qo'lyozmalari va ularning ilmiy ahamiyati.",
      isbn: "978-9943-01-890-1",
      year: "2024",
      edition: "1-nashr",
      author: "Dr. Toshmatov K.R.",
      publisher: "Qo'lyozma Nashri",
      pages: "368",
      image: "/economics-theory-textbook-academic-book-cover-gold.png",
      category: "Qo'lyozma",
      language: "O'zbek",
      price: "140,000 so'm",
      rating: 4.5,
      downloads: "1.9k",
    },
    {
      id: "islamic-heritage",
      title: "Islom madaniy merosi",
      description: "Islom sivilizatsiyasining Markaziy Osiyo orqali o'tgan qismining tarixi.",
      isbn: "978-9943-01-901-2",
      year: "2023",
      edition: "2-nashr",
      author: "Prof. Yusupov A.M.",
      publisher: "Islom Madaniyati Nashri",
      pages: "428",
      image: "/mathematics-textbook-academic-book-cover-blue-desi.png",
      category: "Din",
      language: "O'zbek",
      price: "105,000 so'm",
      rating: 4.7,
      downloads: "2.7k",
    },
    {
      id: "traditional-crafts",
      title: "An'anaviy hunarmandchilik",
      description: "O'zbekiston xalqining an'anaviy hunarmandchilik san'ati va texnologiyalari.",
      isbn: "978-9943-01-012-3",
      year: "2024",
      edition: "1-nashr",
      author: "Umarova D.S.",
      publisher: "Hunar Nashri",
      pages: "324",
      image: "/physics-textbook-academic-book-cover-red-atoms-des.png",
      category: "Hunar",
      language: "O'zbek",
      price: "90,000 so'm",
      rating: 4.6,
      downloads: "2.3k",
    },
    {
      id: "silk-road-history",
      title: "Ipak yo'li tarixi",
      description: "Buyuk Ipak yo'lining Markaziy Osiyo orqali o'tgan qismining tarixi.",
      isbn: "978-9943-01-123-4",
      year: "2023",
      edition: "3-nashr",
      author: "Prof. Abdullayev R.K.",
      publisher: "Tarix Nashri",
      pages: "496",
      image: "/chemistry-textbook-academic-book-cover-green-molec.png",
      category: "Tarix",
      language: "O'zbek",
      price: "130,000 so'm",
      rating: 4.8,
      downloads: "3.5k",
    },
    {
      id: "uzbek-music",
      title: "O'zbek milliy musiqasi",
      description: "O'zbek xalqining milliy musiqa san'ati va uning rivojlanish tarixi.",
      isbn: "978-9943-01-234-6",
      year: "2024",
      edition: "2-nashr",
      author: "Musayeva G.A.",
      publisher: "Musiqa Nashri",
      pages: "356",
      image: "/literature-history-textbook-academic-book-cover-pu.png",
      category: "Musiqa",
      language: "O'zbek",
      price: "100,000 so'm",
      rating: 4.7,
      downloads: "2.9k",
    },
    {
      id: "cultural-monuments",
      title: "Madaniy yodgorliklar",
      description: "O'zbekistonning UNESCO ro'yxatidagi madaniy yodgorliklari.",
      isbn: "978-9943-01-345-7",
      year: "2023",
      edition: "2-nashr",
      author: "Prof. Karimova L.B.",
      publisher: "Yodgorlik Nashri",
      pages: "384",
      image: "/economics-theory-textbook-academic-book-cover-gold.png",
      category: "Madaniyat",
      language: "O'zbek",
      price: "125,000 so'm",
      rating: 4.9,
      downloads: "3.8k",
    },
    {
      id: "uzbek-literature-classics",
      title: "O'zbek adabiyoti klassiklari",
      description: "O'zbek adabiyotining eng mashhur klassik asarlari tahlili.",
      isbn: "978-9943-01-567-9",
      year: "2024",
      edition: "4-nashr",
      author: "Prof. Rahmonov S.T.",
      publisher: "Adabiyot Nashri",
      pages: "528",
      image: "/mathematics-textbook-academic-book-cover-blue-desi.png",
      category: "Adabiyot",
      language: "O'zbek",
      price: "135,000 so'm",
      rating: 4.8,
      downloads: "4.2k",
    },
  ]

  const totalPages = Math.ceil(universityBooks.length / booksPerPage)
  const startIndex = (currentPage - 1) * booksPerPage
  const endIndex = startIndex + booksPerPage
  const currentBooks = universityBooks.slice(startIndex, endIndex)

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
                    src="/university-academic-journals-books-stack-blue.png"
                    alt="Universitet jurnallari"
                    width={500}
                    height={400}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                </div>
              </div>
              <div className="w-full lg:w-3/5">
                <div className="text-left lg:pl-8">
                  <h1 className="text-4xl sm:text-5xl font-bold text-[#003D7F] mb-6">Universitet jurnallari</h1>
                  <div className="bg-white rounded-xl p-8 shadow-xl border border-blue-100">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Universitet jurnallari bo'limi ilmiy tadqiqotlar, dissertatsiyalar va akademik maqolalar
                      to'plamini o'z ichiga oladi. Bu bo'limda turli sohalardagi eng so'nggi ilmiy yutuqlar,
                      kashfiyotlar va tadqiqot natijalari bilan tanishishingiz mumkin. Har bir jurnal yuqori sifatli
                      ilmiy materiallar bilan to'ldirilgan bo'lib, akademik jamoatchilik uchun mo'ljallangan.
                    </p>
                    <div className="mt-6 flex items-center gap-4 text-sm text-blue-600">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        <span className="font-medium">Akademik materiallar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <span className="font-medium">Ilmiy tadqiqotlar</span>
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
                    <Badge className="bg-blue-600 text-white border-0 shadow-lg">{book.category}</Badge>
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
                    <span className="bg-blue-100 px-2 py-1 rounded text-blue-700 font-medium">{book.year}</span>
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
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
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

          {/* Pagination Component */}
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

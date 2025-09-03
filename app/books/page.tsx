"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp, Eye, Star } from "lucide-react"
import Link from "next/link"

export default function BookCategoriesPage() {
  const categories = [
    {
      id: "university-journals",
      title: "Universitet jurnallari bo'limi",
      description:
        "Ilmiy tadqiqotlar, dissertatsiyalar va akademik maqolalar to'plami. Turli sohalardagi eng so'nggi ilmiy yutuqlar va kashfiyotlar.",
      image: "/university-academic-journals-books-stack-blue.png",
      bookCount: "150+",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      href: "/books/university-journals",
    },
    {
      id: "literary-books",
      title: "Adabiy kitoblar bo'limi",
      description:
        "O'zbek va jahon adabiyotining eng yaxshi namunalari. Klassik asarlar, zamonaviy romanlar va she'riy to'plamlar.",
      image: "/literary-books-poetry-novels-green.png",
      bookCount: "200+",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      href: "/books/literary-books",
    },
    {
      id: "historical-books",
      title: "Tarixiy kitoblar bo'limi",
      description:
        "O'zbekiston va Markaziy Osiyo tarixiga oid fundamental asarlar. Qadimgi sivilizatsiyalardan zamonaviy davrgacha.",
      image: "/historical-books-ancient-manuscripts-amber.png",
      bookCount: "120+",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      href: "/books/historical-books",
    },
  ]

  const mostReadBooks = [
    {
      id: "uzbek-culture-history",
      title: "O'zbekiston madaniyati tarixi",
      views: "15,230",
      rating: 4.9,
      image: "/mathematics-textbook-academic-book-cover-blue-desi.png",
      category: "Tarix",
      author: "Prof. A. Karimov",
    },
    {
      id: "central-asian-art",
      title: "Markaziy Osiyo san'ati",
      views: "12,840",
      rating: 4.7,
      image: "/physics-textbook-academic-book-cover-red-atoms-des.png",
      category: "San'at",
      author: "Dr. M. Rahimova",
    },
    {
      id: "uzbek-literature",
      title: "O'zbek adabiyoti antologiyasi",
      views: "10,650",
      rating: 4.8,
      image: "/chemistry-textbook-academic-book-cover-green-molec.png",
      category: "Adabiyot",
      author: "Prof. S. Nazarov",
    },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#DCE3F8" }}>
      <Navbar />

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-80 min-h-screen sticky top-0" style={{ backgroundColor: "#DCE3F8" }}>
          <div className="sticky top-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-border/50 shadow-lg backdrop-blur-sm m-4">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/30">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-[#003D7F]">Eng ko'p o'qilgan</h2>
            </div>

            <div className="space-y-4">
              {mostReadBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="group cursor-pointer bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/30 hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:bg-background/80"
                >
                  <div className="flex gap-4">
                    <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={book.image || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -top-1 -left-1 bg-gradient-to-br from-[#003D7F] to-[#003D7F]/80 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-[#003D7F] transition-colors mb-2 leading-tight">
                        {book.title}
                      </h3>

                      <div className="text-xs text-gray-600 mb-2">{book.author}</div>

                      <div className="inline-block text-xs px-2 py-1 mb-3 bg-[#003D7F]/10 text-[#003D7F] border border-[#003D7F]/20 hover:border-[#003D7F] transition-all duration-300 font-medium rounded">
                        {book.category}
                      </div>

                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                          <Eye className="h-3 w-3" />
                          <span className="font-medium">{book.views}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-yellow-700">{book.rating}</span>
                        </div>
                      </div>

                      <button className="w-full h-8 text-xs bg-[#003D7F]/10 hover:bg-[#003D7F] hover:text-white text-[#003D7F] border border-[#003D7F]/20 hover:border-[#003D7F] transition-all duration-300 font-medium rounded flex items-center justify-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        O'qish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border/30">
              <button className="w-full py-2 px-4 border border-[#003D7F]/20 hover:bg-[#003D7F] hover:text-white text-[#003D7F] transition-colors bg-transparent rounded font-medium">
                Barchasini ko'rish
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header Section */}
          <section className="py-12 sm:py-16 lg:py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-[#003D7F] mb-4">Kitoblar bo'limlari</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Turli sohalardagi eng sifatli kitoblar va ilmiy nashrlarni toping
                </p>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {categories.map((category) => (
                  <Link key={category.id} href={category.href}>
                    <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 shadow-lg hover:scale-[1.02] bg-white h-full cursor-pointer">
                      <div className={`h-2 bg-gradient-to-r ${category.color}`} />

                      <CardHeader className="pb-4">
                        <div className="w-full h-32 mb-4 group-hover:scale-105 transition-transform duration-300 overflow-hidden rounded-lg">
                          <img
                            src={category.image || "/placeholder.svg"}
                            alt={category.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <CardTitle className="text-xl font-bold text-[#003D7F] group-hover:text-blue-600 transition-colors text-center">
                          {category.title}
                        </CardTitle>

                        <CardDescription className="text-gray-600 leading-relaxed text-center">
                          {category.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-[#003D7F]" />
                            <span className="font-semibold text-[#003D7F]">{category.bookCount} kitob</span>
                          </div>
                          <div className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                            Ko'rish →
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  )
}

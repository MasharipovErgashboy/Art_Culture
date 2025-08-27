"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("Barchasi")
  const newsPerPage = 6

  const featuredNews = {
    id: "new-digital-library",
    title: "Yangi raqamli kutubxona tizimi ishga tushirildi",
    description:
      "Art&Culture portalida yangi raqamli kutubxona tizimi ishga tushirildi. Endi foydalanuvchilar 10,000 dan ortiq kitob va jurnalga onlayn kirish imkoniyatiga ega.",
    content:
      "Bugun Art&Culture ilmiy portali yangi raqamli kutubxona tizimini taqdim etdi. Bu tizim orqali talabalar, tadqiqotchilar va ilm-fan sohasida faoliyat yurituvchi mutaxassislar 10,000 dan ortiq kitob, jurnal va ilmiy maqolalarga to'liq kirish imkoniyatiga ega bo'ldilar.",
    date: "2024-03-20",
    author: "Portal administratsiyasi",
    category: "Texnologiya",
    image: "/placeholder.svg?key=news1",
    views: 1250,
    featured: true,
  }

  const allNews = [
    {
      id: "conference-announcement",
      title: "Xalqaro konferensiya e'lon qilindi",
      description: "2024-yil may oyida O'zbekiston madaniyati va san'ati mavzusida xalqaro konferensiya bo'lib o'tadi.",
      date: "2024-03-18",
      author: "Konferensiya qo'mitasi",
      category: "Tadbir",
      image: "/placeholder.svg?key=news2",
      views: 890,
    },
    {
      id: "new-journal-issue",
      title: "Yangi jurnal soni nashr etildi",
      description: "'O'zbekiston madaniyati va san'ati' jurnalining 2024-yil 1-soni nashr etildi va portalda mavjud.",
      date: "2024-03-15",
      author: "Tahririyat",
      category: "Nashr",
      image: "/placeholder.svg?key=news3",
      views: 654,
    },
    {
      id: "research-grant",
      title: "Tadqiqot granti e'lon qilindi",
      description:
        "Yosh tadqiqotchilar uchun madaniyat va san'at sohasida tadqiqot olib borish uchun grant dasturi boshlandi.",
      date: "2024-03-12",
      author: "Grant komissiyasi",
      category: "Grant",
      image: "/placeholder.svg?key=news4",
      views: 432,
    },
    {
      id: "partnership-agreement",
      title: "Yangi hamkorlik shartnomasi imzolandi",
      description: "Portal Markaziy Osiyo universitetlari bilan ilmiy hamkorlik bo'yicha shartnoma imzoladi.",
      date: "2024-03-10",
      author: "Hamkorlik bo'limi",
      category: "Hamkorlik",
      image: "/placeholder.svg?key=news5",
      views: 321,
    },
    {
      id: "student-competition",
      title: "Talabalar uchun tanlov e'lon qilindi",
      description: "Madaniyat va san'at sohasida eng yaxshi ilmiy ish yozgan talabalar uchun tanlov boshlandi.",
      date: "2024-03-08",
      author: "Talabalar bo'limi",
      category: "Tanlov",
      image: "/placeholder.svg?key=news6",
      views: 567,
    },
    {
      id: "workshop-series",
      title: "Onlayn seminarlar seriyasi boshlandi",
      description: "Har hafta tadqiqot metodlari va ilmiy yozuv bo'yicha onlayn seminarlar o'tkaziladi.",
      date: "2024-03-05",
      author: "Ta'lim markazi",
      category: "Ta'lim",
      image: "/placeholder.svg?key=news7",
      views: 789,
    },
    {
      id: "library-expansion",
      title: "Kutubxona fondi kengaytirildi",
      description: "Raqamli kutubxonaga 2000 ta yangi kitob va jurnal qo'shildi.",
      date: "2024-03-03",
      author: "Kutubxona xizmati",
      category: "Texnologiya",
      image: "/placeholder.svg?key=news8",
      views: 445,
    },
    {
      id: "cultural-festival",
      title: "Madaniy festival tashkil etiladi",
      description: "Bahor bayramiga bag'ishlangan madaniy festival mart oyining oxirida bo'lib o'tadi.",
      date: "2024-03-01",
      author: "Madaniy markaz",
      category: "Tadbir",
      image: "/placeholder.svg?key=news9",
      views: 623,
    },
    {
      id: "research-publication",
      title: "Yangi tadqiqot natijalari e'lon qilindi",
      description: "O'zbek adabiyoti bo'yicha olib borilgan tadqiqot natijalari xalqaro jurnalda nashr etildi.",
      date: "2024-02-28",
      author: "Tadqiqot guruhi",
      category: "Nashr",
      image: "/placeholder.svg?key=news10",
      views: 378,
    },
    {
      id: "scholarship-program",
      title: "Stipendiya dasturi e'lon qilindi",
      description: "Magistratura talabalariga mo'ljallangan yangi stipendiya dasturi boshlandi.",
      date: "2024-02-25",
      author: "Stipendiya komissiyasi",
      category: "Grant",
      image: "/placeholder.svg?key=news11",
      views: 512,
    },
    {
      id: "international-cooperation",
      title: "Xalqaro hamkorlik kengaytirildi",
      description: "Evropa universitetlari bilan yangi hamkorlik shartnomasi imzolandi.",
      date: "2024-02-22",
      author: "Xalqaro aloqalar bo'limi",
      category: "Hamkorlik",
      image: "/placeholder.svg?key=news12",
      views: 289,
    },
    {
      id: "student-achievement",
      title: "Talabalar yutuqlari e'tirof etildi",
      description: "Xalqaro tanlovda g'olib bo'lgan talabalar mukofotlandi.",
      date: "2024-02-20",
      author: "Talabalar bo'limi",
      category: "Tanlov",
      image: "/placeholder.svg?key=news13",
      views: 456,
    },
  ]

  const categories = ["Barchasi", "Texnologiya", "Tadbir", "Nashr", "Grant", "Hamkorlik", "Tanlov", "Ta'lim"]

  const filteredNews =
    selectedCategory === "Barchasi" ? allNews : allNews.filter((news) => news.category === selectedCategory)

  const totalPages = Math.ceil(filteredNews.length / newsPerPage)
  const startIndex = (currentPage - 1) * newsPerPage
  const currentNews = filteredNews.slice(startIndex, startIndex + newsPerPage)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <section className="py-12 sm:py-16 lg:py-20 responsive-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
            Yangiliklar
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Universitet va ilm-fan sohasidagi eng so'nggi yangiliklar, e'lonlar va tadbirlar haqida ma'lumot
          </p>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-12 sm:py-16 responsive-padding">
        <div className="container mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">Asosiy yangilik</h2>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 border-0 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="aspect-video lg:aspect-auto relative">
                  <Image
                    src={featuredNews.image || "/placeholder.svg"}
                    alt={featuredNews.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg">Asosiy</Badge>
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {featuredNews.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{featuredNews.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4 text-primary" />
                      <span className="font-medium">{featuredNews.views}</span>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 leading-tight">
                    {featuredNews.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{featuredNews.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">{featuredNews.author}</span>
                    </div>
                    <Button asChild className="hover-primary">
                      <Link href={`/news/${featuredNews.id}`}>To'liq o'qish</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Category Filter */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === selectedCategory ? "default" : "outline"}
                  size="sm"
                  className={category !== selectedCategory ? "bg-transparent hover-primary" : ""}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Latest News Grid */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">So'nggi yangiliklar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {currentNews.map((news) => (
                <Card
                  key={news.id}
                  className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-gradient-to-b from-background to-primary/2"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={news.image || "/placeholder.svg"}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg">
                        {news.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">{news.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-primary" />
                        <span className="font-medium">{news.views}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {news.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      {news.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-medium line-clamp-1">{news.author}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild className="bg-transparent hover-primary">
                        <Link href={`/news/${news.id}`}>O'qish</Link>
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
                  className="hover-primary bg-transparent"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Oldingi
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === page ? "bg-primary text-primary-foreground" : "hover-primary bg-transparent"
                      }
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="hover-primary bg-transparent"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Keyingi
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 responsive-padding bg-gradient-to-b from-primary/5 to-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
            Yangiliklar obunasi
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto text-pretty">
            Eng so'nggi yangiliklar va e'lonlardan xabardor bo'lish uchun bizning yangiliklar obunasiga qo'shiling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email manzilingizni kiriting"
              className="flex-1 px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button className="hover-primary">Obuna bo'lish</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

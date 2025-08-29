"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, User, Building, FileText, Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Filter, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

export default function BooksPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])

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

  const allBooks = [
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
      image: "/placeholder.svg?key=book1",
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
      image: "/placeholder.svg?key=book2",
      category: "San'at",
      language: "O'zbek",
      price: "95,000 so'm",
      rating: 4.6,
      downloads: "2.8k",
    },
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
      image: "/placeholder.svg?key=book3",
      category: "Adabiyot",
      language: "O'zbek",
      price: "85,000 so'm",
      rating: 4.9,
      downloads: "4.1k",
    },
    {
      id: "traditional-crafts",
      title: "O'zbekiston an'anaviy hunarmandchiligi",
      description: "O'zbekiston hunarmandchiligining turli sohalari: to'qimachilik, kulolchilik, zargarlik.",
      isbn: "978-9943-01-345-6",
      year: "2023",
      edition: "1-nashr",
      author: "Toshmatov B.A.",
      publisher: "Hunar Nashri",
      pages: "328",
      image: "/placeholder.svg?key=book4",
      category: "Hunarmandchilik",
      language: "O'zbek",
      price: "75,000 so'm",
      rating: 4.5,
      downloads: "1.9k",
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
      image: "/placeholder.svg?key=book5",
      category: "Me'morchilik",
      language: "O'zbek",
      price: "110,000 so'm",
      rating: 4.7,
      downloads: "2.5k",
    },
    {
      id: "uzbek-music-heritage",
      title: "O'zbek musiqa merosi",
      description: "O'zbek xalq musiqasi, klassik musiqa va zamonaviy musiqa san'atining rivojlanish tarixi.",
      isbn: "978-9943-01-789-0",
      year: "2023",
      edition: "1-nashr",
      author: "Nazarova K.T.",
      publisher: "Musiqa Nashri",
      pages: "368",
      image: "/placeholder.svg?key=book6",
      category: "Musiqa",
      language: "O'zbek",
      price: "90,000 so'm",
      rating: 4.4,
      downloads: "2.1k",
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
      image: "/placeholder.svg?key=book7",
      category: "Adabiyot",
      language: "O'zbek",
      price: "105,000 so'm",
      rating: 4.6,
      downloads: "2.7k",
    },
    {
      id: "islamic-art",
      title: "Islom san'ati va madaniyati",
      description: "Islom madaniyati va san'atining O'zbekiston hududidagi rivojlanishi va ta'siri.",
      isbn: "978-9943-01-123-4",
      year: "2023",
      edition: "2-nashr",
      author: "Prof. Abdullayev M.K.",
      publisher: "Islom Madaniyati Nashri",
      pages: "392",
      image: "/placeholder.svg?key=book8",
      category: "Din",
      language: "O'zbek",
      price: "98,000 so'm",
      rating: 4.5,
      downloads: "2.3k",
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
      image: "/placeholder.svg?key=book9",
      category: "Teatr",
      language: "O'zbek",
      price: "88,000 so'm",
      rating: 4.3,
      downloads: "1.8k",
    },
  ]

  const categories = [...new Set(allBooks.map((book) => book.category))]
  const languages = ["O'zbek", "Rus", "Ingliz"]
  const years = [...new Set(allBooks.map((book) => book.year))]

  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(book.category)
    const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(book.language)
    const matchesYear = selectedYears.length === 0 || selectedYears.includes(book.year)

    return matchesSearch && matchesCategory && matchesLanguage && matchesYear
  })

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
  }

  const handleYearToggle = (year: string) => {
    setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]))
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedLanguages([])
    setSelectedYears([])
    setSearchQuery("")
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedLanguages.length > 0 || selectedYears.length > 0

  const booksPerPage = 9
  const currentPage = 1
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const startIndex = (currentPage - 1) * booksPerPage
  const currentBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header Section */}
      <section className="py-12 sm:py-16 lg:py-20 responsive-padding bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
              Akademik kitoblar
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Madaniyat, san'at va ilm-fan sohasidagi eng so'nggi darsliklar va monografiyalar to'plami
            </p>
          </div>

          {/* Search & Filter */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  placeholder="Kitob nomi yoki muallif bo'yicha qidirish..."
                  className="pl-10 bg-background"
                  aria-label="Kitob qidirish"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-transparent relative hover:bg-[#003D7F] hover:text-white hover:border-[#003D7F] transition-colors"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtr
                    {hasActiveFilters && <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Filtrlar
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-auto p-1 text-xs hover:bg-[#003D7F] hover:text-white"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Tozalash
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                    Kategoriya
                  </DropdownMenuLabel>
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                      className="hover:bg-[#003D7F] hover:text-white focus:bg-[#003D7F] focus:text-white"
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Til</DropdownMenuLabel>
                  {languages.map((language) => (
                    <DropdownMenuCheckboxItem
                      key={language}
                      checked={selectedLanguages.includes(language)}
                      onCheckedChange={() => handleLanguageToggle(language)}
                      className="hover:bg-[#003D7F] hover:text-white focus:bg-[#003D7F] focus:text-white"
                    >
                      {language}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Yil</DropdownMenuLabel>
                  {years.map((year) => (
                    <DropdownMenuCheckboxItem
                      key={year}
                      checked={selectedYears.includes(year)}
                      onCheckedChange={() => handleYearToggle(year)}
                      className="hover:bg-[#003D7F] hover:text-white focus:bg-[#003D7F] focus:text-white"
                    >
                      {year}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                    <button onClick={() => handleCategoryToggle(category)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedLanguages.map((language) => (
                  <Badge key={language} variant="secondary" className="text-xs">
                    {language}
                    <button onClick={() => handleLanguageToggle(language)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedYears.map((year) => (
                  <Badge key={year} variant="secondary" className="text-xs">
                    {year}
                    <button onClick={() => handleYearToggle(year)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-1 sm:py-1 responsive-padding">
        <div className="container mx-auto">
          <div className="mb-6 text-center">
            <p className="text-muted-foreground">{filteredBooks.length} ta kitob topildi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {currentBooks.map((book) => (
              <Card
                key={book.id}
                className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-gradient-to-b from-background to-primary/2 h-fit"
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
                    <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg">{book.category}</Badge>
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
                    <span className="bg-primary/10 px-2 py-1 rounded text-primary font-medium">{book.year}</span>
                  </div>

                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {book.title}
                  </CardTitle>

                  <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {book.description}
                  </CardDescription>

                  <div className="space-y-1 pt-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium line-clamp-1">{book.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4 text-primary" />
                      <span className="line-clamp-1">{book.publisher}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <div className="text-lg font-bold text-primary">{book.price}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">{book.pages} sahifa</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 hover-primary group-hover:shadow-lg transition-all duration-300"
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
                      className="px-4 hover-primary bg-transparent"
                      onClick={() => handlePurchaseClick(book.id)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination with bottom space */}
          <div className="flex items-center justify-center gap-2 mt-12 mb-20">
            <Button variant="outline" size="sm" className="hover-primary bg-transparent" disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Oldingi
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className={currentPage === page ? "bg-primary text-primary-foreground" : "hover-primary"}
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
            >
              Keyingi
              <ChevronRight className="h-1 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

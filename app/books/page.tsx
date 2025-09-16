"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
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

interface Book {
  id: number
  name: string
  slug: string
  isbn?: string
  year?: number
  description: string
  page_count?: number
  tags?: string
  category: number
  category_name: string
  author?: number
  author_name?: string
  pages: number
  created_at: string
}

export default function BooksListPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState<string>("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 9

  const category = searchParams.get("category") || ""

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)

    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("http://127.0.0.1:8000/{lang}/books/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFTOKEN": "AqQlQKEJ75TDii8kAgBSuzGZWF1rM7rfm3KPWFyo5tcohX0bff6jgUUzcSAUvQfc",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Book[] = await response.json()

        let filteredBooks = data
        if (category) {
          filteredBooks = data.filter(
            (book) =>
              book.category.toString() === category ||
              book.category_name?.toLowerCase().replace(/\s+/g, "-") === category,
          )
        }

        setBooks(filteredBooks)
        if (filteredBooks.length > 0 && category) {
          setCategoryName(filteredBooks[0].category_name)
        } else {
          setCategoryName("Barcha kitoblar")
        }
      } catch (err) {
        console.error("API xatolik:", err)
        setError("Kitoblarni yuklashda xatolik yuz berdi")
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [category])

  const totalPages = Math.ceil(books.length / booksPerPage)
  const startIndex = (currentPage - 1) * booksPerPage
  const endIndex = startIndex + booksPerPage
  const currentBooks = books.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePurchaseClick = (bookId: string) => {
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      router.push(`/checkout?type=book&id=${bookId}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#DCE3F8" }}>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#DCE3F8" }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xatolik</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#DCE3F8" }}>
      <Navbar />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link
              href="/books/categories"
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
                    alt={categoryName}
                    width={500}
                    height={400}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                </div>
              </div>
              <div className="w-full lg:w-3/5">
                <div className="text-left lg:pl-8">
                  <h1 className="text-4xl sm:text-5xl font-bold text-[#003D7F] mb-6">{categoryName}</h1>
                  <div className="bg-white rounded-xl p-8 shadow-xl border border-blue-100">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {categoryName} bo'limi ilmiy tadqiqotlar, dissertatsiyalar va akademik maqolalar to'plamini o'z
                      ichiga oladi. Bu bo'limda turli sohalardagi eng so'nggi ilmiy yutuqlar, kashfiyotlar va tadqiqot
                      natijalari bilan tanishishingiz mumkin. Har bir kitob yuqori sifatli ilmiy materiallar bilan
                      to'ldirilgan bo'lib, akademik jamoatchilik uchun mo'ljallangan.
                    </p>
                    <div className="mt-6 flex items-center gap-4 text-sm text-blue-600">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        <span className="font-medium">Akademik materiallar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <span className="font-medium">{books.length} kitob</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Kitoblar topilmadi</h3>
              <p className="text-gray-500">Ushbu kategoriyada hozircha kitoblar mavjud emas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
              {currentBooks.map((book) => (
                <Card
                  key={book.id}
                  className="group hover:shadow-xl transition-all duration-500 overflow-hidden border-0 shadow-md hover:scale-[1.02] bg-white h-fit"
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={`/abstract-geometric-shapes.png?height=400&width=300&query=${encodeURIComponent(book.name)}`}
                      alt={book.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                      <Badge className="bg-blue-600 text-white border-0 shadow-lg">{book.category_name}</Badge>
                      {book.year && (
                        <Badge variant="outline" className="bg-background/95 border-0 shadow-lg">
                          {book.year}
                        </Badge>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="flex items-center justify-between text-white text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">4.8</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{book.page_count || 0} bet</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="font-medium">ISBN: {book.isbn || "N/A"}</span>
                      {book.year && (
                        <span className="bg-blue-100 px-2 py-1 rounded text-blue-700 font-medium">{book.year}</span>
                      )}
                    </div>

                    <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-[#003D7F] transition-colors line-clamp-2 leading-tight">
                      {book.name}
                    </CardTitle>

                    <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: book.description || "" }} />
                    </CardDescription>

                    <div className="space-y-1 pt-1">
                      {book.author_name && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4 text-[#003D7F]" />
                          <span className="font-medium line-clamp-1">{book.author_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4 text-[#003D7F]" />
                        <span className="line-clamp-1">Akademik nashriyot</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-[#003D7F]">Bepul</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 text-[#003D7F]" />
                        <span className="font-medium">{book.page_count || 0} sahifa</span>
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
                        onClick={() => handlePurchaseClick(book.id.toString())}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

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

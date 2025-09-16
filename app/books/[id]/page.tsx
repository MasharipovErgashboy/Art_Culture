"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookOpen, User, Download, ArrowLeft, ExternalLink } from "lucide-react"

interface Book {
  id: number
  name: string
  name_uz?: string
  name_en?: string
  name_ru?: string
  slug: string
  isbn?: string
  year?: number
  description: string
  description_uz?: string
  description_en?: string
  description_ru?: string
  page_count?: number
  tags?: string
  category: number
  category_name: string
  author?: number
  author_name?: string
  pages: number
  created_at: string
  publisher?: string
  price?: string
  language?: string
  edition?: string
  publish_date?: string
}

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`http://127.0.0.1:8000/{lang}/books/${params.id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFTOKEN": "AqQlQKEJ75TDii8kAgBSuzGZWF1rM7rfm3KPWFyo5tcohX0bff6jgUUzcSAUvQfc",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Book = await response.json()
        setBook(data)
      } catch (err) {
        console.error("API xatolik:", err)
        setError("Kitobni yuklashda xatolik yuz berdi")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBook()
    }
  }, [params.id])

  const handlePreviewClick = () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    window.open(`/pdfs/${book?.id}-preview.pdf`, "_blank")
  }

  const handlePurchaseClick = () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    router.push(`/checkout?type=book&id=${book?.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-32 w-full mb-6" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Xatolik</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-6 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Bosh sahifa
            </Link>
            <span>/</span>
            <Link href="/books/categories" className="hover:text-primary">
              Kitoblar bo'limlari
            </Link>
            <span>/</span>
            <Link href="/books" className="hover:text-primary">
              Kitoblar
            </Link>
            <span>/</span>
            <span className="text-foreground">{book.name}</span>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="aspect-[3/4] relative mb-6 overflow-hidden rounded-lg">
                <Image
                  src={`/abstract-geometric-shapes.png?height=400&width=300&query=${encodeURIComponent(book.name)}`}
                  alt={book.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="bg-primary text-primary-foreground mb-2">
                  {book.category_name}
                </Badge>
                <h1 className="text-3xl font-bold text-foreground mb-4">{book.name}</h1>
                <div
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: book.description || "",
                  }}
                />
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                {book.isbn && (
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>ISBN:</strong> {book.isbn}
                    </span>
                  </div>
                )}
                {book.author_name && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Muallif:</strong> {book.author_name}
                    </span>
                  </div>
                )}
                {book.page_count && (
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Sahifalar:</strong> {book.page_count}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="text-2xl font-bold text-primary">{book.price || "120,000 so'm"}</div>
                <div className="flex space-x-3">
                  <Button className="flex-1 hover-primary" size="lg" onClick={handlePurchaseClick}>
                    <Download className="mr-2 h-4 w-4" />
                    Sotib olish
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent hover-primary"
                    onClick={handlePreviewClick}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Namuna
                  </Button>
                </div>
              </div>

              <Button variant="ghost" asChild className="p-0 h-auto">
                <Link href="/books" className="flex items-center text-muted-foreground hover:text-primary">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kitoblarga qaytish
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

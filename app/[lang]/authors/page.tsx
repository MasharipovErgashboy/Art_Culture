"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Loader } from "@/components/Loader"
import { fetchAuthors, type Author } from "@/lib/api"
import { Users, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const translations = {
  uz: {
    pageTitle: "Mualliflar",
    loading: "Mualliflar yuklanmoqda...",
    noAuthors: "Hozircha mualliflar mavjud emas",
    noAuthorsDesc: "Tez orada yangi mualliflar qo'shiladi.",
    image: "Rasm",
    name: "Ism",
    description: "Tavsif",
    books: "Kitoblar",
    journals: "Jurnallar",
    previous: "Oldingi",
    next: "Keyingi",
    page: "Sahifa",
    of: "dan",
  },
  ru: {
    pageTitle: "Авторы",
    loading: "Загрузка авторов...",
    noAuthors: "Пока нет доступных авторов",
    noAuthorsDesc: "Скоро будут добавлены новые авторы.",
    image: "Фото",
    name: "Имя",
    description: "Описание",
    books: "Книги",
    journals: "Журналы",
    previous: "Предыдущая",
    next: "Следующая",
    page: "Страница",
    of: "из",
  },
  en: {
    pageTitle: "Authors",
    loading: "Loading authors...",
    noAuthors: "No authors available yet",
    noAuthorsDesc: "New authors will be added soon.",
    image: "Image",
    name: "Name",
    description: "Description",
    books: "Books",
    journals: "Journals",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
}

const ITEMS_PER_PAGE = 50

export default function AuthorsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const lang = (params.lang as string) || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)

  const [authors, setAuthors] = useState<Author[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchAuthors(lang)
        setAuthors(data)
      } catch (err) {
        console.error("[v0] Error loading authors:", err)
        setError(err instanceof Error ? err.message : "Mualliflarni yuklashda xatolik yuz berdi")
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthors()
  }, [lang])

  const totalPages = Math.ceil(authors.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentAuthors = authors.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    router.push(`/${lang}/authors?page=${page}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const getAuthorSlug = (author: Author) => {
    if (lang === "uz") return author.slug_uz
    if (lang === "ru") return author.slug_ru
    if (lang === "en") return author.slug_en
    return author.slug_uz // fallback
  }

  const handleAuthorClick = (author: Author) => {
    const slug = getAuthorSlug(author)
    if (slug) {
      router.push(`/${lang}/authors/${slug}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t.pageTitle}</h1>
        </div>

        {isLoading ? (
          <Loader message={t.loading} />
        ) : error ? (
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-center">{error}</AlertDescription>
          </Alert>
        ) : authors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t.noAuthors}</h3>
            <p className="text-muted-foreground">{t.noAuthorsDesc}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary/5 border-b-2 border-primary/20">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground border-r border-border">
                        {t.image}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground border-r border-border">
                        {t.name}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground border-r border-border">
                        {t.description}
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground border-r border-border">
                        {t.books}
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">{t.journals}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAuthors.map((author, index) => {
                      const imageUrl = author.image
                        ? author.image.startsWith("http")
                          ? author.image
                          : `https://artculture.pythonanywhere.com${author.image}`
                        : null

                      const hasImageError = imageErrors.has(author.slug_uz || author.name)

                      return (
                        <tr
                          key={author.slug_uz || author.name}
                          onClick={() => handleAuthorClick(author)}
                          className={`border-b border-border hover:bg-primary/5 transition-colors cursor-pointer ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          }`}
                        >
                          {/* Image Column */}
                          <td className="px-6 py-4 border-r border-border">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/20 flex-shrink-0">
                              {imageUrl && !hasImageError ? (
                                <img
                                  src={imageUrl || "/placeholder.svg"}
                                  alt={author.name}
                                  className="w-full h-full object-cover"
                                  onError={() => {
                                    setImageErrors((prev) => new Set(prev).add(author.slug_uz || author.name))
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Users className="h-8 w-8 text-primary/40" />
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Name Column */}
                          <td className="px-6 py-4 border-r border-border">
                            <span className="font-semibold text-foreground">{author.name}</span>
                          </td>

                          {/* Description Column */}
                          <td className="px-6 py-4 border-r border-border">
                            <div
                              className="text-sm text-muted-foreground line-clamp-2 max-w-md"
                              dangerouslySetInnerHTML={{ __html: author.description }}
                            />
                          </td>

                          {/* Books Count Column */}
                          <td className="px-6 py-4 text-center border-r border-border">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {author.books_count}
                            </span>
                          </td>

                          {/* Journals Count Column */}
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {author.journals_count}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t.previous}
                  </Button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <div key={index}>
                        {page === "..." ? (
                          <span className="px-3 py-2 text-muted-foreground">...</span>
                        ) : (
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page as number)}
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="gap-2"
                  >
                    {t.next}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  {t.page} {currentPage} {t.of} {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

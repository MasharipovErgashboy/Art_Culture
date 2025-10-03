"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { JournalIssueCard } from "@/components/JournalIssueCard"
import { Loader } from "@/components/Loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { fetchJournalDetail, fetchJournalIssues, type Journal, type JournalIssue } from "@/lib/api"
import { Calendar, User, BookOpen, ArrowLeft, AlertCircle, Users, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"

const translations = {
  uz: {
    loading: "Jurnal ma'lumotlari yuklanmoqda...",
    home: "Bosh sahifa",
    journals: "Jurnallar",
    noImage: "Rasm mavjud emas",
    scientificJournal: "Ilmiy jurnal",
    issuesCount: "Sonlar soni",
    status: "Holat",
    active: "Faol",
    goBack: "Orqaga qaytish",
    aboutJournal: "Jurnal haqida",
    editorialTeam: "Tahririyat jamoasi",
    articleSubmission: "Maqola yuborish",
    journalIssues: "Jurnal sonlari",
    issues: "ta son",
    noIssues: "Hozircha jurnal sonlari mavjud emas",
    noIssuesDesc: "Tez orada yangi sonlar qo'shiladi.",
    notFound: "Jurnal topilmadi",
    notFoundDesc: "So'ralgan jurnal mavjud emas yoki o'chirilgan.",
  },
  ru: {
    loading: "Загрузка информации о журнале...",
    home: "Главная",
    journals: "Журналы",
    noImage: "Изображение недоступно",
    scientificJournal: "Научный журнал",
    issuesCount: "Количество выпусков",
    status: "Статус",
    active: "Активен",
    goBack: "Назад",
    aboutJournal: "О журнале",
    editorialTeam: "Редакционная коллегия",
    articleSubmission: "Подача статьи",
    journalIssues: "Выпуски журнала",
    issues: "выпусков",
    noIssues: "Пока нет доступных выпусков",
    noIssuesDesc: "Скоро будут добавлены новые выпуски.",
    notFound: "Журнал не найден",
    notFoundDesc: "Запрашиваемый журнал не существует или был удален.",
  },
  en: {
    loading: "Loading journal information...",
    home: "Home",
    journals: "Journals",
    noImage: "No image available",
    scientificJournal: "Scientific Journal",
    issuesCount: "Number of Issues",
    status: "Status",
    active: "Active",
    goBack: "Go Back",
    aboutJournal: "About Journal",
    editorialTeam: "Editorial Team",
    articleSubmission: "Article Submission",
    journalIssues: "Journal Issues",
    issues: "issues",
    noIssues: "No issues available yet",
    noIssuesDesc: "New issues will be added soon.",
    notFound: "Journal not found",
    notFoundDesc: "The requested journal does not exist or has been deleted.",
  },
}

export default function JournalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params.lang as string) || "en"
  const slug = params.slug as string
  const t = translations[lang as keyof typeof translations] || translations.uz

  const [journal, setJournal] = useState<Journal | null>(null)
  const [issues, setIssues] = useState<JournalIssue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const loadJournalData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const journalData = await fetchJournalDetail(slug, lang)
        console.log("[v0] Journal data loaded:", journalData)
        console.log("[v0] Journal image:", journalData.image)
        console.log("[v0] Journal about field:", journalData.about)
        console.log("[v0] Journal editorial_team field:", journalData.editorial_team)
        console.log("[v0] Journal article_submission field:", journalData.article_submission)
        console.log("[v0] About exists?", !!journalData.about)
        console.log("[v0] Editorial team exists?", !!journalData.editorial_team)
        console.log("[v0] Article submission exists?", !!journalData.article_submission)
        setJournal(journalData)

        const issuesData = await fetchJournalIssues(journalData.name, lang)
        setIssues(issuesData)
      } catch (err) {
        console.error("Error loading journal data:", err)
        if (err instanceof TypeError && err.message.includes("fetch")) {
          setError("Django server bilan bog'lanish xatoligi. Server ishlamayapti yoki CORS sozlamalari noto'g'ri.")
        } else {
          setError(err instanceof Error ? err.message : "Jurnal ma'lumotlarini yuklashda xatolik yuz berdi")
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      loadJournalData()
    }
  }, [slug, lang])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Loader message={t.loading} />
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-center">{error}</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    )
  }

  if (!journal) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t.notFound}</h3>
            <p className="text-muted-foreground">{t.notFoundDesc}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const imageUrl = journal.image ? `https://artculture.pythonanywhere.com${journal.image}` : null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-6 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              {t.home}
            </Link>
            <span>/</span>
            <Link href={`/${lang}/journals`} className="hover:text-primary">
              {t.journals}
            </Link>
            <span>/</span>
            <span className="text-foreground">{journal.name}</span>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  {imageUrl && !imageError ? (
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 mb-6">
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-pulse">
                            <BookOpen className="h-12 w-12 text-primary/30" />
                          </div>
                        </div>
                      )}
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={journal.name}
                        fill
                        className={`object-cover transition-opacity duration-300 ${
                          imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized
                        priority={false}
                        onError={() => {
                          console.log("[v0] Image failed to load:", imageUrl)
                          setImageError(true)
                        }}
                        onLoad={() => {
                          console.log("[v0] Image loaded successfully:", imageUrl)
                          setImageLoaded(true)
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] relative mb-6 overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 flex items-center justify-center">
                      <div className="text-center">
                        <BookOpen className="h-16 w-16 text-primary/40 mx-auto mb-2" />
                        <p className="text-sm text-primary/60 font-medium">{t.noImage}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground mb-2">
                        {t.scientificJournal}
                      </Badge>
                      <h1 className="text-2xl font-bold text-foreground mb-2">{journal.name}</h1>
                      {journal.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {journal.description.replace(/<[^>]*>/g, "").substring(0, 150)}...
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-3 text-sm">
                      {journal.issn && (
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>
                            <strong>{t.issuesCount}:</strong> {journal.issn}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>{t.issuesCount}:</strong> {journal.issues_count || 0}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>{t.status}:</strong> {t.active}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="mb-6">
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="group hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:shadow-md"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    {t.goBack}
                  </Button>
                </div>
              </div>

              {journal.about && journal.about.trim().length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {t.aboutJournal}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-muted-foreground leading-relaxed prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: journal.about }}
                    />
                  </CardContent>
                </Card>
              )}

              {journal.editorial_team && journal.editorial_team.trim().length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {t.editorialTeam}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-muted-foreground leading-relaxed prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: journal.editorial_team }}
                    />
                  </CardContent>
                </Card>
              )}

              {journal.article_submission && journal.article_submission.trim().length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {t.articleSubmission}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-muted-foreground leading-relaxed prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: journal.article_submission }}
                    />
                  </CardContent>
                </Card>
              )}

              {!journal.about && journal.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.aboutJournal}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-muted-foreground leading-relaxed prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: journal.description }}
                    />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{t.journalIssues}</CardTitle>
                  <Badge variant="outline">
                    {journal.issues_count || 0} {t.issues}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {(!issues || issues.length === 0) && journal.latest_issues && journal.latest_issues.length > 0 ? (
                      <div className="space-y-4">
                        {journal.latest_issues.map((issue) => (
                          <JournalIssueCard key={issue.id} issue={issue} lang={lang} />
                        ))}
                      </div>
                    ) : issues.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">{t.noIssues}</h3>
                        <p className="text-muted-foreground">{t.noIssuesDesc}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {issues.map((issue) => (
                          <JournalIssueCard key={issue.id} issue={issue} lang={lang} />
                        ))}
                      </div>
                    )}
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

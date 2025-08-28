import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  FileText,
  Calendar,
  Newspaper,
  Info,
  Mail,
  Search,
  Award,
  Globe,
  Users,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const sections = [
    {
      title: "Jurnallar",
      description: "Ilmiy jurnallar va maqolalar to'plami",
      icon: FileText,
      href: "/journals",
      color: "text-primary",
    },
    {
      title: "Kitoblar",
      description: "Akademik kitoblar va darsliklar",
      icon: BookOpen,
      href: "/books",
      color: "text-secondary",
    },
    {
      title: "Konferensiya",
      description: "Ilmiy konferensiyalar va tadbirlar",
      icon: Calendar,
      href: "/conference",
      color: "text-primary",
    },
    {
      title: "Yangiliklar",
      description: "So'nggi yangiliklar va e'lonlar",
      icon: Newspaper,
      href: "/news",
      color: "text-secondary",
    },
    {
      title: "Haqida",
      description: "Loyiha va universitet haqida ma'lumot",
      icon: Info,
      href: "/about",
      color: "text-primary",
    },
    {
      title: "Aloqa",
      description: "Bog'lanish va yordam olish",
      icon: Mail,
      href: "/contact",
      color: "text-secondary",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 responsive-padding bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 sm:mb-6 text-balance">
            Art&Culture Publishing
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 text-pretty">
            Ilmiy meros va zamonaviy bilimlar jamlanmasi
          </p>
          <p className="responsive-text text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto text-pretty">
            Talabalar, tadqiqotchilar va olimlar uchun jurnallar va kitoblarni tizimlashtirish va ularga kirish imkonini
            beruvchi ilmiy raqamli platforma.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-base sm:text-lg px-6 sm:px-8 hover-secondary">
              <Link href="/journals">
                <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Jurnallarni ko'rish
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base sm:text-lg px-6 sm:px-8 bg-transparent hover-secondary"
            >
              <Link href="/books">
                <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Kitoblarni o'qish
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Sections Preview */}
      <section className="py-12 sm:py-16 responsive-padding">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Asosiy bo'limlar
            </h2>
            <p className="responsive-text text-muted-foreground max-w-2xl mx-auto text-pretty">
              Ilmiy resurslar va ma'lumotlarga tezkor kirish uchun kerakli bo'limlarni tanlang
            </p>
          </div>

          <div className="responsive-grid">
            {sections.map((section) => {
              const IconComponent = section.icon
              return (
                <Card
                  key={section.title}
                  className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 hover:scale-105"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <IconComponent
                        className={`h-6 w-6 sm:h-8 sm:w-8 ${section.color} group-hover:text-primary transition-colors`}
                      />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-muted-foreground">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button
                      variant="outline"
                      asChild
                      className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors bg-transparent"
                    >
                      <Link href={section.href}>Ko'rish</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 responsive-padding bg-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Nima uchun bizni tanlaysiz?
            </h2>
            <p className="responsive-text text-muted-foreground max-w-2xl mx-auto text-pretty">
              Ilmiy tadqiqotlar va ta'lim sohasida eng yaxshi xizmatlarni taqdim etamiz
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center space-y-4 p-4 sm:p-6 rounded-lg bg-background/50 hover:bg-background transition-colors">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">Sifatli kontent</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Ekspert tomonidan tekshirilgan ilmiy materiallar
              </p>
            </div>

            <div className="text-center space-y-4 p-4 sm:p-6 rounded-lg bg-background/50 hover:bg-background transition-colors">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">Global kirish</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Istalgan joydan 24/7 kirish imkoniyati</p>
            </div>

            <div className="text-center space-y-4 p-4 sm:p-6 rounded-lg bg-background/50 hover:bg-background transition-colors">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">Hamjamiyat</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Tadqiqotchilar va olimlar jamoasi</p>
            </div>

            <div className="text-center space-y-4 p-4 sm:p-6 rounded-lg bg-background/50 hover:bg-background transition-colors">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">Innovatsiya</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Zamonaviy texnologiyalar va yondashuvlar</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

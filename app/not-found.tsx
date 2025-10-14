"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

const translations = {
  uz: {
    title: "404",
    heading: "Sahifa topilmadi",
    description: "Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan.",
    homeButton: "Bosh sahifa",
    backButton: "Orqaga qaytish",
  },
  ru: {
    title: "404",
    heading: "Страница не найдена",
    description: "Извините, страница, которую вы ищете, не существует или была удалена.",
    homeButton: "Главная страница",
    backButton: "Вернуться назад",
  },
  en: {
    title: "404",
    heading: "Page Not Found",
    description: "Sorry, the page you are looking for does not exist or has been removed.",
    homeButton: "Home Page",
    backButton: "Go Back",
  },
}

export default function NotFound() {
  const pathname = usePathname()

  const lang = pathname?.startsWith("/uz")
    ? "uz"
    : pathname?.startsWith("/ru")
      ? "ru"
      : pathname?.startsWith("/en")
        ? "en"
        : "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar currentLang={lang} />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <h1 className="text-9xl font-bold text-primary">{t.title}</h1>
            <h2 className="text-3xl font-bold text-gray-900">{t.heading}</h2>
            <p className="text-gray-600 text-lg">{t.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
              <Link href={`/${lang}`}>
                <Home className="w-4 h-4 mr-2" />
                {t.homeButton}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="hover-primary bg-transparent"
              onClick={() => window.history.back()}
            >
              <a href="#">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backButton}
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

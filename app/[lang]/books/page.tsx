import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookOpen } from "lucide-react"

const translations = {
  uz: {
    title: "Kitoblar",
    comingSoon: "Tez orada yuklanadi",
    description: "Kitoblar sahifasi hozirda ishlab chiqilmoqda va tez orada mavjud bo'ladi.",
  },
  ru: {
    title: "Книги",
    comingSoon: "Скоро будет загружено",
    description: "Страница книг в настоящее время находится в разработке и скоро будет доступна.",
  },
  en: {
    title: "Books",
    comingSoon: "Coming Soon",
    description: "The books page is currently under development and will be available soon.",
  },
}

export default function BooksPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-[#003D7F] rounded-full">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
            <p className="text-xl md:text-2xl font-semibold text-[#003D7F] mb-4">{t.comingSoon}</p>
            <p className="text-gray-600 text-base md:text-lg">{t.description}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

"use client"

import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { useParams } from "next/navigation"

const footerTranslations = {
  uz: {
    universityName: "O'zbekiston Madaniyat va San'at Instituti",
    quickLinks: "Tezkor havolalar",
    journals: "Jurnallar",
    books: "Kitoblar",
    conferences: "Konferensiya",
    news: "Yangiliklar",
    academicResources: "Ilmiy resurslar",
    authors: "Mualliflar",
    about: "Biz Haqimizda",
    contact: "Bog'lanish",
    contactInfo: "Aloqa ma'lumotlari",
    location: "Toshkent, O'zbekiston",
    copyright: "© 2025 Art&Culture University Scientific Portal. Barcha huquqlar himoyalangan.",
  },
  ru: {
    universityName: "Узбекский институт культуры и искусства",
    quickLinks: "Быстрые ссылки",
    journals: "Журналы",
    books: "Книги",
    conferences: "Конференции",
    news: "Новости",
    academicResources: "Научные ресурсы",
    authors: "Авторы",
    about: "О нас",
    contact: "Контакты",
    contactInfo: "Контактная информация",
    location: "Ташкент, Узбекистан",
    copyright: "© 2025 Art&Culture University Scientific Portal. Все права защищены.",
  },
  en: {
    universityName: "Uzbekistan Institute of Culture and Arts",
    quickLinks: "Quick Links",
    journals: "Journals",
    books: "Books",
    conferences: "Conferences",
    news: "News",
    academicResources: "Academic Resources",
    authors: "Authors",
    about: "About Us",
    contact: "Contact",
    contactInfo: "Contact Information",
    location: "Tashkent, Uzbekistan",
    copyright: "© 2025 Art&Culture University Scientific Portal. All rights reserved.",
  },
}

export function Footer() {
  const params = useParams()
  const lang = (params?.lang as string) || "uz"
  const t = footerTranslations[lang as keyof typeof footerTranslations] || footerTranslations.uz

  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* University Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="Art&Culture Logo" className="h-10 w-10 rounded" />
              <div className="flex flex-col items-center font-bold text-primary leading-tight">
                <span className="text-base sm:text-lg">
                  Art
                  <span className="text-xs sm:text-sm">&</span>
                  Culture
                </span>
                <span className="text-sm sm:text-base">Publishing</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{t.universityName}</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">{t.quickLinks}</h3>
            <div className="space-y-2">
              <Link
                href={`/${lang}/journals`}
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t.journals}
              </Link>
              <Link
                href={`/${lang}/books`}
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t.books}
              </Link>
              <Link
                href={`/${lang}/conferences`}
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t.conferences}
              </Link>
              <Link
                href={`/${lang}/news`}
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t.news}
              </Link>
            </div>
          </div>

          {/* Academic Resources */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">{t.academicResources}</h3>
            <div className="space-y-2">
              <Link
                href={`/${lang}/authors`}
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t.authors}
              </Link>
              <Link
                href={`/${lang}/about`}
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t.about}
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t.contact}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">{t.contactInfo}</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>{t.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="break-all">info@artculture.uz</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>(71)230-28-15</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">{t.copyright}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

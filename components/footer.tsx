import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* University Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A&C</span>
              </div>
              <span className="font-bold text-lg text-primary">Art&Culture</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Ilmiy meros va zamonaviy bilimlar jamlanmasi - University Scientific Portal
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Tezkor havolalar</h3>
            <div className="space-y-2">
              <Link
                href="/journals"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Jurnallar
              </Link>
              <Link href="/books" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Kitoblar
              </Link>
              <Link
                href="/conference"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Konferensiya
              </Link>
              <Link href="/news" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Yangiliklar
              </Link>
            </div>
          </div>

          {/* Academic Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Ilmiy resurslar</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Haqida
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Aloqa
              </Link>
              <Link href="/help" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Yordam
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Aloqa ma'lumotlari</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Toshkent, O'zbekiston</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@artculture.uz</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+998 71 123 45 67</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Art&Culture University Scientific Portal. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  )
}

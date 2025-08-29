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
              {/* Logo joylashgan qismi */}
              <img 
                src="/logo.jpg" 
                alt="Art&Culture Logo" 
                className="h-10 w-10 rounded" 
              />

              {/* Matn qismi */}
              <div className="flex flex-col items-center font-bold text-primary leading-tight">
                <span className="text-lg">
                  Art
                  <span className="text-sm">&</span>
                  Culture
                </span>
                <span className="text-base">Publishing</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              O'zbekiston Madaniyat va San'at Instituti
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
                Biz Haqimizda
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Bog'lanish
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
                <span>(71)230-28-15</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Art&Culture  University Scientific Portal. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  )
}

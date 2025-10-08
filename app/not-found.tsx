import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-3xl font-bold text-gray-900">Sahifa topilmadi</h2>
            <p className="text-gray-600 text-lg">Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
              <Link href="/uz">
                <Home className="w-4 h-4 mr-2" />
                Bosh sahifa
              </Link>
            </Button>

            <Button asChild variant="outline" className="hover-primary bg-transparent">
              <Link href="javascript:history.back()">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Orqaga qaytish
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

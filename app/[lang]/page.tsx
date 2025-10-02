import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HomeContent } from "@/components/home-content"

export default async function LangHomePage({ params }: { params: Promise<{ lang: "uz" | "ru" | "en" }> }) {
  const { lang } = await params

  return (
    <>
      <Navbar />
      <HomeContent lang={lang} />
      <Footer />
    </>
  )
}

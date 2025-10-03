import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HomeContent } from "@/components/home-content"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HomeContent lang="uz" />
      <Footer />
    </>
  )
}

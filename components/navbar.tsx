"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Globe, User, ShoppingBag, Menu, X, LogOut, Settings, BookOpen } from "lucide-react"
import { fetchJournal, fetchConference, fetchJournalIssue, getSlugForLang } from "@/lib/api"

interface UserData {
  id: string
  name?: string
  surname?: string
  email: string
  avatar?: string
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState("UZB")
  const [user, setUser] = useState<UserData | null>(null)
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

  const lang = (params?.lang as string) || "uz"

  useEffect(() => {
    const urlLangMap: { [key: string]: string } = {
      uz: "UZB",
      ru: "RUS",
      en: "ENG",
    }
    setCurrentLang(urlLangMap[lang] || "UZB")
  }, [lang])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (e) {
        console.error("User parse error:", e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/"
  }

  const languages = [
    { code: "UZB", name: "O'zbekcha", flag: "🇺🇿" },
    { code: "RUS", name: "Русский", flag: "🇷🇺" },
    { code: "ENG", name: "English", flag: "🇺🇸" },
  ]

  const handleLanguageChange = async (langCode: string) => {
    setCurrentLang(langCode)

    // Map display language codes to URL language codes
    const langMap: { [key: string]: string } = {
      UZB: "uz",
      RUS: "ru",
      ENG: "en",
    }

    const newLang = langMap[langCode] || "uz"
    const currentLang = lang

    // Parse pathname to detect dynamic routes with slugs
    const pathParts = pathname.split("/").filter(Boolean)

    // Check if we're on a detail page with a slug
    // Pattern: /[lang]/[resource-type]/[slug]
    if (pathParts.length >= 3 && (pathParts[0] === "uz" || pathParts[0] === "ru" || pathParts[0] === "en")) {
      const resourceType = pathParts[1] // e.g., "journals", "conferences", "journal-soni"
      const currentSlug = pathParts[2]

      try {
        let newSlug = currentSlug

        // Fetch the resource to get all language slugs
        if (resourceType === "journals") {
          const journal = await fetchJournal(currentSlug, currentLang)
          newSlug = getSlugForLang(journal, newLang)
        } else if (resourceType === "conferences") {
          const conference = await fetchConference(currentSlug, currentLang)
          newSlug = getSlugForLang(conference, newLang)
        } else if (resourceType === "journal-soni") {
          const issue = await fetchJournalIssue(currentSlug, currentLang)
          newSlug = getSlugForLang(issue, newLang)
        }

        // Build new path with updated language and slug
        const newPath = `/${newLang}/${resourceType}/${newSlug}`
        router.push(newPath)

        // Dispatch custom event
        window.dispatchEvent(
          new CustomEvent("languageChange", {
            detail: { language: langCode },
          }),
        )
        return
      } catch (error) {
        console.error("Error fetching resource for language change:", error)
        // Fall back to simple language replacement if fetch fails
      }
    }

    // For non-detail pages or if fetch failed, just replace language segment
    let newPath = pathname

    if (pathname.startsWith("/uz") || pathname.startsWith("/ru") || pathname.startsWith("/en")) {
      newPath = pathname.replace(/^\/(uz|ru|en)/, `/${newLang}`)
    } else {
      newPath = `/${newLang}${pathname}`
    }

    router.push(newPath)

    window.dispatchEvent(
      new CustomEvent("languageChange", {
        detail: { language: langCode },
      }),
    )
  }

  const leftNavItems = [
    { href: `/${lang}/about`, label: "Biz haqimizda" },
    { href: `/${lang}/contact`, label: "Bog'lanish" },
  ]

  const centerNavItems = [
    { href: `/${lang}/journals`, label: "Jurnallar" },
    { href: `/${lang}/books`, label: "Kitoblar" },
    { href: `/${lang}/conferences`, label: "Konferensiya" },
  ]

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-[#003D7F]/95"
      style={{ backgroundColor: "#003D7F" }}
    >
      <div className="w-full px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-6">
            {leftNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-blue-100 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <Link href="/" className="flex items-center space-x-3 ml-4">
              <img src="/logo.jpg" alt="Art&Culture Logo" className="h-16 w-16 rounded" />
              <span className="flex flex-col items-center font-bold leading-tight">
                <span className="text-2xl text-[#F4C430]">
                  Art<span className="text-2xl text-white">&</span>Culture
                </span>
                <span className="text-2xl text-white">Publishing</span>
              </span>
            </Link>
          </div>

          {/* Center menu */}
          <div className="hidden md:flex items-center space-x-8">
            {centerNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg font-semibold transition-colors ${
                  pathname === item.href
                    ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent border-blue-300 text-blue-100 hover:bg-blue-800 hover:text-white"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentLang}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className="gap-2"
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  title="Sotib olingan mahsulotlar"
                  className="text-blue-100 hover:text-white hover:bg-blue-800"
                >
                  <ShoppingBag className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.avatar || "/placeholder.svg"}
                          alt={`${user?.name || ""} ${user?.surname || ""}`}
                        />
                        <AvatarFallback className="bg-primary text-white">
                          {(user?.name?.charAt(0) || user?.email?.charAt(0) || "?").toUpperCase()}
                          {user?.surname?.charAt(0) || ""}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user?.name} {user?.surname}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${lang}/profile`}
                        className="cursor-pointer text-blue-100 hover:text-white hover:bg-blue-800"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${lang}/my-books`}
                        className="cursor-pointer text-blue-100 hover:text-white hover:bg-blue-800"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Mening kitoblarim</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${lang}/settings`}
                        className="cursor-pointer text-blue-100 hover:text-white hover:bg-blue-800"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Sozlamalar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-blue-100 hover:text-white hover:bg-blue-800"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Chiqish</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild className="text-blue-100 hover:text-white hover:bg-blue-800">
                  <Link href="/login">Kirish</Link>
                </Button>
                <Button size="sm" asChild className="bg-white text-blue-900 hover:bg-blue-50">
                  <Link href="/register">Ro'yxatdan o'tish</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-blue-100 hover:text-white hover:bg-blue-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-blue-700 py-4">
            <div className="flex flex-col space-y-3">
              {[...leftNavItems, ...centerNavItems].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors px-2 py-1 ${
                    pathname === item.href ? "text-yellow-400 font-semibold" : "text-blue-100 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center space-x-2 px-2 pt-2 border-t border-blue-700">
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" className="text-blue-100 hover:text-white hover:bg-blue-800">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-blue-100 hover:text-white hover:bg-blue-800"
                    >
                      <Link href={`/${lang}/profile`}>Profil</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-blue-100 hover:text-white hover:bg-blue-800"
                    >
                      Chiqish
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-blue-100 hover:text-white hover:bg-blue-800"
                    >
                      <Link href="/login">Kirish</Link>
                    </Button>
                    <Button size="sm" asChild className="bg-white text-blue-900 hover:bg-blue-50">
                      <Link href="/register">Ro'yxatdan o'tish</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

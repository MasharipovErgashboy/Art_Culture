"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Menu, BookOpen, Calendar, FileText, User, LogOut } from "lucide-react"
import {
  fetchJournal,
  fetchConference,
  fetchJournalIssue,
  fetchYangilik,
  fetchReklama,
  fetchRasmiyElon,
  getSlugForLang,
} from "@/lib/api"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { languages } from "@/lib/languages"
import { logout } from "@/lib/auth"

interface UserProfile {
  email: string
  username: string
  subscription?: any
}

const navTranslations = {
  uz: {
    about: "Biz haqimizda",
    contact: "Bog'lanish",
    journals: "Jurnallar",
    books: "Kitoblar",
    conferences: "Konferensiya",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    profile: "Profil",
    logout: "Chiqish",
    menu: "Menyu",
  },
  ru: {
    about: "О нас",
    contact: "Контакты",
    journals: "Журналы",
    books: "Книги",
    conferences: "Конференции",
    login: "Войти",
    register: "Регистрация",
    profile: "Профиль",
    logout: "Выйти",
    menu: "Меню",
  },
  en: {
    about: "About Us",
    contact: "Contact",
    journals: "Journals",
    books: "Books",
    conferences: "Conferences",
    login: "Login",
    register: "Register",
    profile: "Profile",
    logout: "Logout",
    menu: "Menu",
  },
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState("UZB")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

  const lang = (params?.lang as string) || "uz"
  const t = navTranslations[lang as keyof typeof navTranslations] || navTranslations.uz

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token")

      if (!token) {
        setIsLoggedIn(false)
        setUser(null)
        setIsLoadingUser(false)
        return
      }

      try {
        console.log("[v0] Fetching user profile from API...")
        const response = await fetch("https://artculture.pythonanywhere.com/auth/me/", {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRFTOKEN": localStorage.getItem("csrf_token") || "",
          },
        })

        if (!response.ok) {
          console.error("[v0] Failed to fetch profile:", response.status)
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("user")
          }
          setIsLoggedIn(false)
          setUser(null)
          setIsLoadingUser(false)
          return
        }

        const userData = await response.json()
        console.log("[v0] User profile fetched:", userData)

        setUser(userData)
        setIsLoggedIn(true)
        setIsLoadingUser(false)
      } catch (error) {
        console.error("[v0] Error fetching user profile:", error)
        setIsLoggedIn(false)
        setUser(null)
        setIsLoadingUser(false)
      }
    }

    fetchUserProfile()

    const handleStorageChange = () => {
      fetchUserProfile()
    }

    window.addEventListener("storage", handleStorageChange)

    const handleLoginEvent = () => {
      fetchUserProfile()
    }

    window.addEventListener("userLoggedIn", handleLoginEvent)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userLoggedIn", handleLoginEvent)
    }
  }, [pathname])

  useEffect(() => {
    const urlLangMap: { [key: string]: string } = {
      uz: "UZB",
      ru: "RUS",
      en: "ENG",
    }
    setCurrentLang(urlLangMap[lang] || "UZB")
  }, [lang])

  const handleLanguageChange = async (langCode: string) => {
    setCurrentLang(langCode)

    const langMap: { [key: string]: string } = {
      UZB: "uz",
      RUS: "ru",
      ENG: "en",
    }

    const newLang = langMap[langCode] || "uz"
    const currentLang = lang

    if (pathname === "/") {
      router.push(`/${newLang}`)
      return
    }

    const pathParts = pathname.split("/").filter(Boolean)

    if (pathParts.length >= 3 && (pathParts[0] === "uz" || pathParts[0] === "ru" || pathParts[0] === "en")) {
      const resourceType = pathParts[1]
      const currentSlug = pathParts[2]

      console.log("[v0] Language change detected:", {
        resourceType,
        currentSlug,
        currentLang,
        newLang,
      })

      try {
        let newSlug = currentSlug

        if (resourceType === "journals") {
          const journal = await fetchJournal(currentSlug, currentLang)
          newSlug = getSlugForLang(journal, newLang)
        } else if (resourceType === "conferences") {
          const conference = await fetchConference(currentSlug, currentLang)
          newSlug = getSlugForLang(conference, newLang)
        } else if (resourceType === "journal-soni") {
          const issue = await fetchJournalIssue(currentSlug, currentLang)
          newSlug = getSlugForLang(issue, newLang)
        } else if (resourceType === "yangiliklar") {
          console.log("[v0] Fetching yangilik for language change...")
          console.log("[v0] Current slug:", currentSlug)
          console.log("[v0] Current lang:", currentLang)
          console.log("[v0] Target lang:", newLang)

          try {
            const yangilik = await fetchYangilik(currentSlug, currentLang)
            console.log("[v0] Yangilik data received:", yangilik)
            console.log("[v0] Available slugs:", {
              slug_uz: yangilik.slug_uz,
              slug_en: yangilik.slug_en,
              slug_ru: yangilik.slug_ru,
            })
            newSlug = getSlugForLang(yangilik, newLang)
            console.log("[v0] New slug for", newLang, ":", newSlug)
          } catch (error) {
            console.error("[v0] Failed to fetch yangilik:", error)
            console.log("[v0] Falling back to current slug")
            newSlug = currentSlug
          }
        } else if (resourceType === "reklama") {
          console.log("[v0] Fetching reklama for language change...")
          console.log("[v0] Current slug:", currentSlug)
          console.log("[v0] Current lang:", currentLang)
          console.log("[v0] Target lang:", newLang)

          try {
            const reklama = await fetchReklama(currentSlug, currentLang)
            console.log("[v0] Reklama data received:", reklama)
            console.log("[v0] Available slugs:", {
              slug_uz: reklama.slug_uz,
              slug_en: reklama.slug_en,
              slug_ru: reklama.slug_ru,
            })
            newSlug = getSlugForLang(reklama, newLang)
            console.log("[v0] New slug for", newLang, ":", newSlug)
          } catch (error) {
            console.error("[v0] Failed to fetch reklama:", error)
            console.log("[v0] Falling back to current slug")
            newSlug = currentSlug
          }
        } else if (resourceType === "rasmiy-elon") {
          console.log("[v0] Fetching rasmiy-elon for language change...")

          try {
            const rasmiyElon = await fetchRasmiyElon(currentSlug, currentLang)
            newSlug = getSlugForLang(rasmiyElon, newLang)
          } catch (error) {
            console.error("[v0] Failed to fetch rasmiy-elon:", error)
            newSlug = currentSlug
          }
        }

        const newPath = `/${newLang}/${resourceType}/${newSlug}`
        console.log("[v0] Redirecting to:", newPath)
        router.push(newPath)

        window.dispatchEvent(
          new CustomEvent("languageChange", {
            detail: { language: langCode },
          }),
        )
        return
      } catch (error) {
        console.error("[v0] Error fetching resource for language change:", error)
      }
    }

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

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setUser(null)
    router.push(`/${lang}`)
  }

  const leftNavItems = [
    { href: `/${lang}/about`, label: t.about },
    { href: `/${lang}/contact`, label: t.contact },
  ]

  const centerNavItems = [
    { href: `/${lang}/journals`, label: t.journals, icon: FileText },
    { href: `/${lang}/books`, label: t.books, icon: BookOpen },
    { href: `/${lang}/conferences`, label: t.conferences, icon: Calendar },
  ]

  const getUserInitial = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-[#003D7F]/95"
      style={{ backgroundColor: "#003D7F" }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {leftNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-blue-100 hover:text-white transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}

            <Link href={`/${lang}`} className="flex items-center space-x-2 ml-4">
              <img
                src="/logo.jpg"
                alt="Art&Culture Logo"
                className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded"
              />
              <span className="hidden xl:flex flex-col items-center font-bold leading-tight">
                <span className="text-xl lg:text-2xl text-[#F4C430]">
                  Art<span className="text-xl lg:text-2xl text-white">&</span>Culture
                </span>
                <span className="text-xl lg:text-2xl text-white">Publishing</span>
              </span>
            </Link>
          </div>

          <Link href={`/${lang}`} className="flex lg:hidden items-center space-x-2">
            <img src="/logo.jpg" alt="Art&Culture Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded" />
            <span className="flex flex-col items-center font-bold leading-tight">
              <span className="text-base sm:text-lg text-[#F4C430]">
                Art<span className="text-base sm:text-lg text-white">&</span>Culture
              </span>
              <span className="text-base sm:text-lg text-white">Publishing</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {centerNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base xl:text-lg font-semibold transition-colors whitespace-nowrap ${
                  pathname === item.href
                    ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 sm:gap-2 bg-transparent border-blue-300 text-blue-100 hover:bg-blue-800 hover:text-white px-2 sm:px-3"
                >
                  <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">{currentLang}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[100]">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className="gap-2 cursor-pointer"
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {!isLoadingUser && isLoggedIn && user ? (
              <div className="hidden sm:block">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full bg-white hover:bg-blue-50 p-0">
                      <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-base">
                        {getUserInitial()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 z-[100]">
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-700">{user.username}</div>
                    <div className="px-2 py-1 text-xs text-gray-500 border-b mb-1">{user.email}</div>
                    <DropdownMenuItem asChild>
                      <Link href={`/${lang}/profile`} className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        <span>{t.profile}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 cursor-pointer text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t.logout}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : !isLoadingUser ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-blue-100 hover:text-white hover:bg-blue-800 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Link href={`/${lang}/login`}>{t.login}</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-white text-blue-900 hover:bg-blue-50 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <Link href={`/${lang}/register`}>{t.register}</Link>
                </Button>
              </div>
            ) : null}

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-blue-100 hover:text-white hover:bg-blue-800 px-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>{t.menu}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="space-y-2">
                    {centerNavItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            pathname === item.href
                              ? "bg-primary text-primary-foreground font-semibold"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    {leftNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    {!isLoadingUser && isLoggedIn && user ? (
                      <>
                        <div className="px-4 py-2 bg-gray-50 rounded-lg mb-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {getUserInitial()}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{user.username}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 bg-transparent"
                          asChild
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Link href={`/${lang}/profile`}>
                            <User className="h-4 w-4" />
                            {t.profile}
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 bg-transparent text-red-600 hover:text-red-700"
                          onClick={() => {
                            handleLogout()
                            setIsMenuOpen(false)
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          {t.logout}
                        </Button>
                      </>
                    ) : !isLoadingUser ? (
                      <>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          asChild
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Link href={`/${lang}/login`}>{t.login}</Link>
                        </Button>
                        <Button className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                          <Link href={`/${lang}/register`}>{t.register}</Link>
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

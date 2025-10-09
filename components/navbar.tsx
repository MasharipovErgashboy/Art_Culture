"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, Calendar, FileText, User, LogOut, BookOpen } from "lucide-react"
import {
  fetchJournal,
  fetchConference,
  fetchJournalIssue,
  fetchYangilik,
  fetchReklama,
  fetchRasmiyElon,
  fetchBookCategory,
  fetchBook,
  getSlugForLang,
} from "@/lib/api"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { logout } from "@/lib/auth"

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
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null)

  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()

  const lang = (params?.lang as string) || "uz"
  const t = navTranslations[lang as keyof typeof navTranslations] || navTranslations.uz

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem("access_token")

      if (!token) {
        setIsLoggedIn(false)
        setUser(null)
        setIsLoadingUser(false)
        return
      }

      try {
        const response = await fetch("https://artculture.pythonanywhere.com/auth/me/", {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const userData = await response.json()
        setUser(userData)
        setIsLoggedIn(true)
        setIsLoadingUser(false)
      } catch (error) {
        console.error("[v0] Failed to fetch profile:", error)
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
        setIsLoggedIn(false)
        setUser(null)
        setIsLoadingUser(false)
      }
    }

    loadUserProfile()

    const handleStorageChange = () => {
      loadUserProfile()
    }

    window.addEventListener("storage", handleStorageChange)

    const handleLoginEvent = () => {
      loadUserProfile()
    }

    window.addEventListener("userLoggedIn", handleLoginEvent)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userLoggedIn", handleLoginEvent)
    }
  }, [pathname])

  const handleLanguageChange = async (langCode: string) => {
    const langMap: { [key: string]: string } = {
      uz: "uz",
      ru: "ru",
      en: "en",
    }

    const newLang = langMap[langCode] || "uz"
    const currentLang = lang

    console.log("[v0] ========== LANGUAGE CHANGE START ==========")
    console.log("[v0] From:", currentLang, "To:", newLang)
    console.log("[v0] Current pathname:", pathname)

    if (pathname === "/") {
      router.push(`/${newLang}`)
      return
    }

    const pathParts = pathname.split("/").filter(Boolean)
    console.log("[v0] Path parts:", pathParts)
    console.log("[v0] Path parts length:", pathParts.length)

    if (pathParts.length >= 3) {
      console.log("[v0] pathParts[0] (lang):", pathParts[0])
      console.log("[v0] pathParts[1] (resource type):", pathParts[1])
      console.log("[v0] pathParts[2] (slug):", pathParts[2])
    }

    if (pathParts.length >= 3 && (pathParts[0] === "uz" || pathParts[0] === "ru" || pathParts[0] === "en")) {
      const resourceType = pathParts[1]
      const currentSlug = pathParts[2]

      console.log("[v0] ========== DETAIL PAGE DETECTED ==========")
      console.log("[v0] Resource type:", resourceType)
      console.log("[v0] Current slug:", currentSlug)
      console.log("[v0] Current lang:", currentLang)
      console.log("[v0] Target lang:", newLang)

      if (resourceType === "books-category") {
        console.log("[v0] ========== BOOKS-CATEGORY PAGE DETECTED ==========")
        console.log("[v0] fetchBookCategory function exists:", typeof fetchBookCategory)
        console.log("[v0] fetchBookCategory is:", fetchBookCategory)
      } else if (resourceType === "books") {
        console.log("[v0] ========== BOOKS PAGE DETECTED ==========")
      }

      try {
        let newSlug = currentSlug
        let resourceData: any = null

        if (resourceType === "journals") {
          console.log("[v0] Fetching journal...")
          resourceData = await fetchJournal(currentSlug, currentLang)
          console.log("[v0] Journal data received:", resourceData)
        } else if (resourceType === "conferences") {
          console.log("[v0] Fetching conference...")
          resourceData = await fetchConference(currentSlug, currentLang)
          console.log("[v0] Conference data received:", resourceData)
        } else if (resourceType === "journal-soni") {
          console.log("[v0] Fetching journal issue...")
          resourceData = await fetchJournalIssue(currentSlug, currentLang)
          console.log("[v0] Journal issue data received:", resourceData)
        } else if (resourceType === "yangiliklar") {
          console.log("[v0] Fetching yangilik...")
          resourceData = await fetchYangilik(currentSlug, currentLang)
          console.log("[v0] Yangilik data received:", resourceData)
        } else if (resourceType === "reklama") {
          console.log("[v0] Fetching reklama...")
          resourceData = await fetchReklama(currentSlug, currentLang)
          console.log("[v0] Reklama data received:", resourceData)
        } else if (resourceType === "rasmiy-elon") {
          console.log("[v0] Fetching rasmiy-elon...")
          resourceData = await fetchRasmiyElon(currentSlug, currentLang)
          console.log("[v0] Rasmiy-elon data received:", resourceData)
        } else if (resourceType === "books-category") {
          console.log("[v0] ========== ABOUT TO FETCH BOOK CATEGORY ==========")
          console.log("[v0] Current slug:", currentSlug)
          console.log("[v0] Current lang:", currentLang)
          console.log("[v0] Function type:", typeof fetchBookCategory)

          try {
            console.log("[v0] Calling fetchBookCategory...")
            resourceData = await fetchBookCategory(currentSlug, currentLang)
            console.log("[v0] ========== BOOK CATEGORY FETCHED SUCCESSFULLY ==========")
            console.log("[v0] Resource data:", JSON.stringify(resourceData, null, 2))
            console.log("[v0] Slugs available:", {
              uz: resourceData?.slug_uz,
              en: resourceData?.slug_en,
              ru: resourceData?.slug_ru,
            })
          } catch (fetchError) {
            console.error("[v0] ========== ERROR FETCHING BOOK CATEGORY ==========")
            console.error(
              "[v0] Error type:",
              fetchError instanceof Error ? fetchError.constructor.name : typeof fetchError,
            )
            console.error("[v0] Error message:", fetchError instanceof Error ? fetchError.message : String(fetchError))
            console.error("[v0] Error stack:", fetchError instanceof Error ? fetchError.stack : "No stack")
            throw fetchError
          }
        } else if (resourceType === "books") {
          console.log("[v0] ========== ABOUT TO FETCH BOOK ==========")
          console.log("[v0] Current slug:", currentSlug)
          console.log("[v0] Current lang:", currentLang)
          console.log("[v0] Function type:", typeof fetchBook)

          try {
            console.log("[v0] Calling fetchBook...")
            resourceData = await fetchBook(currentSlug, currentLang)
            console.log("[v0] ========== BOOK FETCHED SUCCESSFULLY ==========")
            console.log("[v0] Resource data:", JSON.stringify(resourceData, null, 2))
            console.log("[v0] Slugs available:", {
              uz: resourceData?.slug_uz,
              en: resourceData?.slug_en,
              ru: resourceData?.slug_ru,
            })
          } catch (fetchError) {
            console.error("[v0] ========== ERROR FETCHING BOOK ==========")
            console.error(
              "[v0] Error type:",
              fetchError instanceof Error ? fetchError.constructor.name : typeof fetchError,
            )
            console.error("[v0] Error message:", fetchError instanceof Error ? fetchError.message : String(fetchError))
            console.error("[v0] Error stack:", fetchError instanceof Error ? fetchError.stack : "No stack")
            throw fetchError
          }
        }

        if (resourceData) {
          console.log("[v0] ========== EXTRACTING SLUG ==========")
          console.log("[v0] Resource data received:", JSON.stringify(resourceData, null, 2))
          console.log("[v0] Available slugs:", {
            uz: resourceData.slug_uz,
            en: resourceData.slug_en,
            ru: resourceData.slug_ru,
          })
          console.log("[v0] Target language:", newLang)
          console.log("[v0] getSlugForLang function type:", typeof getSlugForLang)

          try {
            console.log("[v0] Calling getSlugForLang...")
            newSlug = getSlugForLang(resourceData, newLang)
            console.log("[v0] ========== SLUG EXTRACTED SUCCESSFULLY ==========")
            console.log("[v0] New slug:", newSlug)
            console.log("[v0] Old slug:", currentSlug)
            console.log("[v0] Slug changed:", currentSlug !== newSlug)
          } catch (slugError) {
            console.error("[v0] ========== ERROR EXTRACTING SLUG ==========")
            console.error("[v0] Error:", slugError)
            throw slugError
          }
        } else {
          console.warn("[v0] ========== NO RESOURCE DATA RECEIVED ==========")
          console.warn("[v0] Using current slug as fallback")
        }

        const newPath = `/${newLang}/${resourceType}/${newSlug}`
        console.log("[v0] ========== NAVIGATION ==========")
        console.log("[v0] Old path:", pathname)
        console.log("[v0] New path:", newPath)
        console.log("[v0] Old slug:", currentSlug)
        console.log("[v0] New slug:", newSlug)
        console.log("[v0] Slug changed:", currentSlug !== newSlug)
        console.log("[v0] ========== LANGUAGE CHANGE END ==========")

        router.push(newPath)

        window.dispatchEvent(
          new CustomEvent("languageChange", {
            detail: { language: langCode },
          }),
        )
        return
      } catch (error) {
        console.error("[v0] ========== ERROR IN LANGUAGE CHANGE ==========")
        console.error("[v0] Error type:", error instanceof Error ? error.constructor.name : typeof error)
        console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
        console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
        console.error("[v0] Resource type:", resourceType)
        console.error("[v0] Current slug:", currentSlug)
        console.error("[v0] Current lang:", currentLang)
        console.error("[v0] Target lang:", newLang)
        console.error("[v0] ========== ERROR END ==========")

        const fallbackPath = `/${newLang}/${resourceType}/${currentSlug}`
        console.warn("[v0] ========== USING FALLBACK ==========")
        console.warn("[v0] Fallback path:", fallbackPath)
        console.warn("[v0] This means the slug will NOT change, only the language")
        router.push(fallbackPath)
        return
      }
    }

    // For other pages, just change the language prefix
    let newPath = pathname

    if (pathname.startsWith("/uz") || pathname.startsWith("/ru") || pathname.startsWith("/en")) {
      newPath = pathname.replace(/^\/(uz|ru|en)/, `/${newLang}`)
    } else {
      newPath = `/${newLang}${pathname}`
    }

    console.log("[v0] Simple language change to:", newPath)
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
    { href: `/${lang}/books-category`, label: t.books, icon: BookOpen },
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

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsDropdownOpen(false)
    }, 5000) // 5 seconds delay
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

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
            <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-md p-1">
              {["uz", "ru", "en"].map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => handleLanguageChange(langCode)}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                    lang === langCode
                      ? "bg-white text-[#003D7F] shadow-sm"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {langCode.toUpperCase()}
                </button>
              ))}
            </div>

            {!isLoadingUser && isLoggedIn && user && mounted ? (
              <div className="hidden sm:block relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <button className="h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-[#003D7F] transition-all duration-200">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-base shadow-lg hover:shadow-xl transition-shadow">
                    {getUserInitial()}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                          {getUserInitial()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900 truncate">{user.username}</div>
                          <div className="text-xs text-gray-600 truncate">{user.email}</div>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/${lang}/profile`}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-700">{t.profile}</span>
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                      >
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{t.logout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !isLoadingUser && mounted ? (
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
                  <div className="flex items-center gap-2 bg-gray-100 rounded-md p-1">
                    {["uz", "ru", "en"].map((langCode) => (
                      <button
                        key={langCode}
                        onClick={() => {
                          handleLanguageChange(langCode)
                          setIsMenuOpen(false)
                        }}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded transition-all ${
                          lang === langCode
                            ? "bg-white text-[#003D7F] shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                        }`}
                      >
                        {langCode.toUpperCase()}
                      </button>
                    ))}
                  </div>

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
                    {!isLoadingUser && isLoggedIn && user && mounted ? (
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
                    ) : !isLoadingUser && mounted ? (
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

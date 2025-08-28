"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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

interface UserData {
  id: string
  name: string
  surname: string
  email: string
  avatar?: string
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState("UZB")
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
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

  const navItems = [
    { href: "/", label: "Asosiy Sahifa" },
    { href: "/journals", label: "Jurnallar" },
    { href: "/books", label: "Kitoblar" },
    { href: "/conference", label: "Konferensiya" },
    { href: "/news", label: "Yangiliklar" },
    { href: "/about", label: "Biz Haqimizda" },
    { href: "/contact", label: "Bog'lanish" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <img 
          src="/logo.jpg" 
          alt="Art&Culture Logo" 
          className="h-8 w-8 rounded" 
        />
        <span className="font-bold text-xl text-primary">Art&Culture Publishing</span>
      </Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentLang}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} onClick={() => setCurrentLang(lang.code)} className="gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Actions */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-2">
                {/* Products/Cart Icon */}
                <Button variant="ghost" size="sm" title="Sotib olingan mahsulotlar">
                  <ShoppingBag className="h-4 w-4" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.name} ${user.surname}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.name.charAt(0)}
                          {user.surname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {user.name} {user.surname}
                        </p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-books" className="cursor-pointer">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Mening kitoblarim</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Sozlamalar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Chiqish</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Kirish</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Ro'yxatdan o'tish</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center space-x-2 px-2 pt-2 border-t">
                {user ? (
                  <>
                    <Button variant="ghost" size="sm">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/profile">Profil</Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      Chiqish
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">Kirish</Link>
                    </Button>
                    <Button size="sm" asChild>
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

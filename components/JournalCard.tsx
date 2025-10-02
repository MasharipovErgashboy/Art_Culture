"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Lock } from "lucide-react"
import Image from "next/image"
import type { Journal } from "@/lib/api"
import { getSlugForLang } from "@/lib/api"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

interface JournalCardProps {
  journal: Journal
  lang: string
}

export function JournalCard({ journal, lang }: JournalCardProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const imageUrl = journal.image ? `http://127.0.0.1:8000${journal.image}` : null
  const journalSlug = getSlugForLang(journal, lang)

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated()
      console.log("[v0] Authentication check:", authStatus)
      setIsLoggedIn(authStatus)
    }

    checkAuth()

    // Re-check authentication when window gains focus (user returns from login)
    window.addEventListener("focus", checkAuth)
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("focus", checkAuth)
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  const handleJournalAccess = (e: React.MouseEvent) => {
    e.preventDefault()

    const authenticated = isAuthenticated()
    console.log("[v0] Click handler - authenticated:", authenticated)
    console.log("[v0] Access token:", localStorage.getItem("access_token"))

    console.log("[v0] Authenticated, navigating to journal:", journalSlug)
    router.push(`/${lang}/journals/${journalSlug}`)
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-primary/30 hover:scale-[1.02] bg-white/80 backdrop-blur-sm overflow-hidden">
      {imageUrl && !imageError ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse">
                <BookOpen className="h-12 w-12 text-primary/30" />
              </div>
            </div>
          )}
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={journal.name}
            fill
            className={`object-cover group-hover:scale-105 transition-all duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              setImageError(true)
            }}
            onLoad={() => {
              setImageLoaded(true)
            }}
            unoptimized
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-primary/40 mx-auto mb-4" />
            <p className="text-primary/60 font-medium">Rasm mavjud emas</p>
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{journal.issues_count} son</span>
          </div>
        </div>
        <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {journal.name}
        </CardTitle>
        <CardDescription className="line-clamp-3" dangerouslySetInnerHTML={{ __html: journal.description }} />
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleJournalAccess}
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 group"
        >
          <span className="flex items-center gap-2">
            {!isLoggedIn && <Lock className="h-4 w-4" />}
            Jurnalni ko'rish
          </span>
        </Button>
      </CardContent>
    </Card>
  )
}

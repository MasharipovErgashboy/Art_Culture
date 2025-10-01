"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, FileText } from "lucide-react"
import Image from "next/image"
import type { Conference } from "@/lib/api"
import { getSlugForLang } from "@/lib/api"
import { useRouter } from "next/navigation"

interface ConferenceCardProps {
  conference: Conference
  lang: string
}

export function ConferenceCard({ conference, lang }: ConferenceCardProps) {
  const router = useRouter()
  const imageUrl = conference.image ? `http://127.0.0.1:8000${conference.image}` : null
  const conferenceSlug = getSlugForLang(conference, lang)

  const handleConferenceAccess = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/${lang}/conferences/${conferenceSlug}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-primary/30 hover:scale-[1.02] bg-white/80 backdrop-blur-sm">
      {imageUrl && (
        <div className="relative h-72 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-slate-100 to-slate-200">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={conference.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {!imageUrl && (
        <div className="relative h-72 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
          <div className="text-center">
            <Calendar className="h-16 w-16 text-primary/40 mx-auto mb-4" />
            <p className="text-primary/60 font-medium">Rasm mavjud emas</p>
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(conference.date)}</span>
          </div>
        </div>
        <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {conference.name}
        </CardTitle>
        <CardDescription className="line-clamp-3" dangerouslySetInnerHTML={{ __html: conference.description }} />

        <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{conference.manzil}</span>
          </div>
          {conference.tashkilotchi_hamkorlar && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{conference.tashkilotchi_hamkorlar}</span>
            </div>
          )}
          {conference.pdf && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>PDF mavjud</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleConferenceAccess}
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 group"
        >
          <span className="flex items-center gap-2">Konferensiyani ko'rish</span>
        </Button>
      </CardContent>
    </Card>
  )
}

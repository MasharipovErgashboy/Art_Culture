import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Download, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { JournalIssue } from "@/lib/api"
import { getSlugForLang } from "@/lib/api"

interface JournalIssueCardProps {
  issue: JournalIssue
  lang: string
}

export function JournalIssueCard({ issue, lang }: JournalIssueCardProps) {
  const API_BASE = "http://127.0.0.1:8000"
  const issueSlug = getSlugForLang(issue, lang)

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white rounded-2xl overflow-hidden hover:-translate-y-2 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <CardHeader className="pb-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              <FileText className="h-4 w-4" />
              <span className="font-medium">{issue.sections_count} bo'lim</span>
            </div>
          </div>
        </div>

        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 leading-tight mb-3">
          {issue.name}
        </CardTitle>

        <CardDescription className="text-gray-600 leading-relaxed line-clamp-3 text-base">
          {issue.description
            ?.replace(/<[^>]*>/g, "") // Remove HTML tags
            ?.replace(/&nbsp;/g, " ") // Replace non-breaking spaces
            ?.replace(/&amp;/g, "&") // Replace HTML entities
            ?.replace(/&lt;/g, "<") // Replace HTML entities
            ?.replace(/&gt;/g, ">") // Replace HTML entities
            ?.replace(/\s+/g, " ") // Replace multiple spaces with single space
            ?.trim() || "Tavsif mavjud emas"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <div className="flex gap-3">
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
          >
            <Link href={`/${lang}/journal-soni/${issueSlug}`} className="flex items-center justify-center gap-2">
              Batafsil ko'rish
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>

          {issue.pdf_file && (
            <Button
              variant="outline"
              asChild
              className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl p-3 transition-all duration-300 bg-transparent"
            >
              <a href={`${API_BASE}${issue.pdf_file}`} target="_blank" rel="noopener noreferrer">
                <Download className="h-5 w-5 text-gray-600 hover:text-blue-600 transition-colors duration-300" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

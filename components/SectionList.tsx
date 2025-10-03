import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, ExternalLink } from "lucide-react"
import type { JournalSection } from "@/lib/api"

interface SectionListProps {
  sections: JournalSection[]
}

export function SectionList({ sections }: SectionListProps) {
  const API_BASE = "https://artculture.pythonanywhere.com"

  if (sections.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Hozircha bo'limlar mavjud emas.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {section.author_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full justify-between bg-transparent">
              <a href={`${API_BASE}${section.pdf}`} target="_blank" rel="noopener noreferrer">
                PDF ni ochish
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

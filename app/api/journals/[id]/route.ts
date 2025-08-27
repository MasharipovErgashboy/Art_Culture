import { type NextRequest, NextResponse } from "next/server"
import type { Journal, ApiResponse } from "@/lib/types"

// Mock data - replace with actual database queries
const mockJournals: Journal[] = [
  {
    id: "uzbekistan-culture-art",
    title: "O'zbekiston madaniyati va san'ati",
    description:
      "O'zbekiston madaniyati, san'ati va merosiga bag'ishlangan ilmiy jurnal. Tarix, adabiyot, tasviriy san'at va musiqa sohasidagi tadqiqotlar.",
    issn: "2181-9092",
    year: "2024",
    issue: "4-son",
    author: "O'zbekiston Madaniyat va San'at Instituti",
    image: "/uzbekistan-culture-art-journal-cover.png",
    category: "Madaniyat",
    status: "Faol",
    lastUpdate: "2024-03-15",
    views: "2.4k",
    articles: 24,
    updates: [
      {
        id: "update-1",
        title: "2024-yil 4-son yangilanishi",
        description: "Yangi maqolalar va tadqiqotlar qo'shildi",
        publishedDate: "2024-03-15",
        tableOfContents: [
          {
            id: "article-1",
            title: "O'zbek xalq musiqasining zamonaviy rivojlanishi",
            author: "Prof. Karimov A.B.",
            pages: "5-18",
            pdfUrl: "/pdfs/article-1.pdf",
          },
          {
            id: "article-2",
            title: "Samarqand me'morchiligining san'at jihatdan tahlili",
            author: "Dotsent Rahimova S.K.",
            pages: "19-35",
            pdfUrl: "/pdfs/article-2.pdf",
          },
        ],
      },
    ],
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const journal = mockJournals.find((j) => j.id === params.id)

    if (!journal) {
      return NextResponse.json({ success: false, message: "Journal not found" }, { status: 404 })
    }

    const response: ApiResponse<Journal> = {
      data: journal,
      success: true,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching journal:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

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
  },
  {
    id: "scientific-heritage",
    title: "Ilmiy meros va zamonaviy tadqiqotlar",
    description:
      "Ilmiy meros va zamonaviy tadqiqotlar sohasidagi eng so'nggi ishlanmalar va kashfiyotlar haqida ma'lumotlar.",
    issn: "2181-8754",
    year: "2024",
    issue: "2-son",
    author: "Ilmiy Tadqiqotlar Markazi",
    image: "/placeholder-j65e2.png",
    category: "Ilm-fan",
    status: "Faol",
    lastUpdate: "2024-03-10",
    views: "1.8k",
    articles: 18,
  },
  {
    id: "cultural-studies",
    title: "Madaniyatshunoslik tadqiqotlari",
    description:
      "Madaniyatshunoslik, etnografiya va antropologiya sohasidagi fundamental va amaliy tadqiqotlar jurnali.",
    issn: "2181-7634",
    year: "2024",
    issue: "1-son",
    author: "Madaniyatshunoslik Instituti",
    image: "/placeholder-1loz8.png",
    category: "Madaniyatshunoslik",
    status: "Faol",
    lastUpdate: "2024-02-28",
    views: "1.2k",
    articles: 15,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filteredJournals = mockJournals

    // Apply filters
    if (query) {
      filteredJournals = filteredJournals.filter(
        (journal) =>
          journal.title.toLowerCase().includes(query.toLowerCase()) ||
          journal.description.toLowerCase().includes(query.toLowerCase()) ||
          journal.author.toLowerCase().includes(query.toLowerCase()),
      )
    }

    if (category) {
      filteredJournals = filteredJournals.filter((journal) => journal.category.toLowerCase() === category.toLowerCase())
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedJournals = filteredJournals.slice(startIndex, endIndex)

    const response: ApiResponse<Journal[]> = {
      data: paginatedJournals,
      success: true,
      pagination: {
        page,
        limit,
        total: filteredJournals.length,
        totalPages: Math.ceil(filteredJournals.length / limit),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching journals:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

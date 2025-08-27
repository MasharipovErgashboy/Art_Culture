export interface Journal {
  id: string
  title: string
  description: string
  issn: string
  year: string
  issue: string
  author: string
  image: string
  category: string
  status: "Faol" | "Arxiv"
  lastUpdate: string
  views: string
  articles: number
  updates?: JournalUpdate[]
}

export interface JournalUpdate {
  id: string
  title: string
  description: string
  publishedDate: string
  tableOfContents: TableOfContentsItem[]
}

export interface TableOfContentsItem {
  id: string
  title: string
  author: string
  pages: string
  pdfUrl: string
}

export interface Book {
  id: string
  title: string
  description: string
  isbn: string
  year: string
  edition: string
  author: string
  publisher: string
  pages: string
  image: string
  category: string
  language: string
  price: string
  rating: number
  downloads: string
  tableOfContents?: TableOfContentsItem[]
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactSubmissionResponse {
  success: boolean
  message: string
}

export interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  publishedDate: string
  category: string
  image: string
  author: string
}

export interface Conference {
  id: string
  title: string
  description: string
  date: string
  location: string
  type: "upcoming" | "past"
  image: string
  registrationUrl?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchParams {
  query?: string
  category?: string
  page?: number
  limit?: number
}

import type {
  Journal,
  Book,
  ContactFormData,
  ContactSubmissionResponse,
  NewsItem,
  Conference,
  ApiResponse,
  SearchParams,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Journals API
  async getJournals(params?: SearchParams): Promise<ApiResponse<Journal[]>> {
    const searchParams = new URLSearchParams()
    if (params?.query) searchParams.append("query", params.query)
    if (params?.category) searchParams.append("category", params.category)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const queryString = searchParams.toString()
    return this.request<Journal[]>(`/journals${queryString ? `?${queryString}` : ""}`)
  }

  async getJournal(id: string): Promise<ApiResponse<Journal>> {
    return this.request<Journal>(`/journals/${id}`)
  }

  // Books API
  async getBooks(params?: SearchParams): Promise<ApiResponse<Book[]>> {
    const searchParams = new URLSearchParams()
    if (params?.query) searchParams.append("query", params.query)
    if (params?.category) searchParams.append("category", params.category)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const queryString = searchParams.toString()
    return this.request<Book[]>(`/books${queryString ? `?${queryString}` : ""}`)
  }

  async getBook(id: string): Promise<ApiResponse<Book>> {
    return this.request<Book>(`/books/${id}`)
  }

  // News API
  async getNews(params?: SearchParams): Promise<ApiResponse<NewsItem[]>> {
    const searchParams = new URLSearchParams()
    if (params?.query) searchParams.append("query", params.query)
    if (params?.category) searchParams.append("category", params.category)
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const queryString = searchParams.toString()
    return this.request<NewsItem[]>(`/news${queryString ? `?${queryString}` : ""}`)
  }

  async getNewsItem(id: string): Promise<ApiResponse<NewsItem>> {
    return this.request<NewsItem>(`/news/${id}`)
  }

  // Conference API
  async getConferences(type?: "upcoming" | "past"): Promise<ApiResponse<Conference[]>> {
    const queryString = type ? `?type=${type}` : ""
    return this.request<Conference[]>(`/conferences${queryString}`)
  }

  async getConference(id: string): Promise<ApiResponse<Conference>> {
    return this.request<Conference>(`/conferences/${id}`)
  }

  // Contact API
  async submitContactForm(data: ContactFormData): Promise<ContactSubmissionResponse> {
    const response = await this.request<ContactSubmissionResponse>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.data
  }

  // Statistics API
  async getStatistics(): Promise<
    ApiResponse<{
      journals: number
      books: number
      users: number
      downloads: number
    }>
  > {
    return this.request("/statistics")
  }
}

export const apiClient = new ApiClient()

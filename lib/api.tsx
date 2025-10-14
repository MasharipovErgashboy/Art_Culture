const API_BASE = "https://artculture.pythonanywhere.com"
const API_TIMEOUT = 10000 // 10 seconds timeout

// Helper function to create fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = API_TIMEOUT) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Server bilan bog'lanish vaqti tugadi. Django server ishlamayotgan bo'lishi mumkin.")
    }
    throw error
  }
}

export interface Journal {
  slug_uz: string
  slug_en: string
  slug_ru: string
  name: string
  description: string
  issues_count: number
  latest_issues?: JournalIssue[]
  image?: string
  issn?: string
  about?: string
  editorial_team?: string
  article_submission?: string
}

export interface JournalIssue {
  id: number
  slug_uz: string
  slug_en: string
  slug_ru: string
  name: string
  description: string
  pdf_file: string
  sections_count: number
  journal_name: string
}

export interface JournalSection {
  id: number
  slug_uz: string
  slug_en: string
  slug_ru: string
  author_name: string
  pdf: string
  journal_issue_name: string
}

export interface Yangilik {
  title: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  media: string | null
  homepage_content: string | null
  description: string | null
}

export interface Reklama {
  id?: number
  title: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  media: string | null
  homepage_content: string | null
  description: string | null
  author?: string
}

export interface RasmiyElon {
  id?: number
  title: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  media: string | null
  homepage_content: string | null
  description: string | null
  author?: string
}

export interface BookCategory {
  id?: number
  slug_uz: string
  slug_en: string
  slug_ru: string
  name: string
  books_count: number
  description: string
}

export interface Book {
  id?: number
  slug_uz: string
  slug_en: string
  slug_ru: string
  name: string
  author_name: string
  image: string
  isbn: string
  year: number
  description: string
  page_count: number
  pdf_file: string
}

export interface Conference {
  slug_uz: string
  slug_en: string
  slug_ru: string
  name: string
  description: string
  date: string
  manzil: string
  tashkilotchi_hamkorlar?: string
  image?: string
  pdf?: string
}

export interface SubscriptionType {
  id: number
  name: string
  duration_days: number
  price: string
  books_count: number
  journals_count: number
  conferences_count: number
}

export interface Subscription {
  id: number
  subscription_type: SubscriptionType
  start_date: string
  end_date: string
  is_active: boolean
}

export interface UserProfile {
  email: string
  username: string
  subscription: {
    active: Subscription[]
    ended: Subscription[]
  } | null
}

export interface Author {
  slug_uz: string
  slug_en: string | null
  slug_ru: string | null
  description: string
  image: string | null
  name: string
  books_count: number
  journals_count: number
}

export interface SubscriptionPlanDetail {
  id: number
  name: string
  duration_days: number
  price: string
  books: Book[]
  journals: Journal[]
  conferences: Conference[]
  books_count: number
  journals_count: number
  conferences_count: number
}

export async function fetchJournals(lang = "en"): Promise<Journal[]> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/${lang}/journals/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching journals:", error)
    throw error
  }
}

export async function fetchJournal(slug: string, lang = "en"): Promise<Journal> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/${lang}/journals/${slug}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching journal:", error)
    throw error
  }
}

export const fetchJournalDetail = fetchJournal

export async function fetchJournalIssues(journalName: string, lang = "en"): Promise<JournalIssue[]> {
  try {
    const encodedJournalName = encodeURIComponent(journalName)
    const url = `${API_BASE}/${lang}/journal-soni/?journal_name=${encodedJournalName}`

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const filteredIssues = data.filter((issue: JournalIssue) => issue.journal_name === journalName)
    return filteredIssues
  } catch (error) {
    console.error("Error fetching journal issues:", error)
    throw error
  }
}

export async function fetchJournalIssue(slug: string, lang = "en"): Promise<JournalIssue> {
  try {
    console.log("[v0] fetchJournalIssue called with:", { slug, lang })
    const url = `${API_BASE}/${lang}/journal-soni/${slug}/`
    console.log("[v0] Fetching journal issue from URL:", url)

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] fetchJournalIssue API error:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
        url,
      })
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] fetchJournalIssue success:", data)
    return data
  } catch (error) {
    console.error("[v0] fetchJournalIssue error:", error)
    throw error
  }
}

export async function fetchJournalSections(journalIssueName: string, lang = "en"): Promise<JournalSection[]> {
  try {
    const encodedIssueName = encodeURIComponent(journalIssueName)
    const url = `${API_BASE}/${lang}/journal-sections/?journal_issue_name=${encodedIssueName}`

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const filteredSections = data.filter((section: JournalSection) => section.journal_issue_name === journalIssueName)
    return filteredSections
  } catch (error) {
    console.error("Error fetching journal sections:", error)
    throw error
  }
}

export async function fetchAllJournalSections(lang = "en"): Promise<JournalSection[]> {
  try {
    const url = `${API_BASE}/${lang}/journal-sections/`
    console.log("[v0] Fetching all journal sections from URL:", url)

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      console.error("[v0] fetchAllJournalSections API error:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] fetchAllJournalSections success:", data.length, "sections")
    return data
  } catch (error) {
    console.error("[v0] fetchAllJournalSections error:", error)
    throw error
  }
}

export async function fetchYangilik(slug: string, lang = "en"): Promise<Yangilik> {
  try {
    const url = `${API_BASE}/${lang}/yangiliklar/${slug}/`

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.detail
  } catch (error) {
    console.error("Error fetching yangilik:", error)
    throw error
  }
}

export async function fetchReklama(slug: string, lang = "en"): Promise<Reklama> {
  try {
    const url = `${API_BASE}/${lang}/reklama/${slug}/`

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.detail || data
  } catch (error) {
    console.error("Error fetching reklama:", error)
    throw error
  }
}

export async function fetchRasmiyElon(slug: string, lang = "en"): Promise<RasmiyElon> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/${lang}/rasmiy-elonlar/${slug}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.detail || data
  } catch (error) {
    console.error("Error fetching rasmiy elon:", error)
    throw error
  }
}

export async function fetchBookCategories(lang = "en"): Promise<BookCategory[]> {
  console.log("[v0] fetchBookCategories called with lang:", lang)
  try {
    const url = `${API_BASE}/${lang}/book-categories/`
    console.log("[v0] Fetching book categories from URL:", url)

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      console.error("[v0] fetchBookCategories API error:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] fetchBookCategories success:", data.length, "categories")
    return data
  } catch (error) {
    console.error("[v0] fetchBookCategories error:", error)
    throw error
  }
}

export async function fetchBookCategory(slug: string, lang = "en", token?: string): Promise<BookCategory> {
  try {
    const url = `${API_BASE}/${lang}/book-categories/${slug}/`
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") : null)

    console.log("[v0] fetchBookCategory called:", { url, lang, slug, hasToken: !!authToken })

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": lang,
    }

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`
    }

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers,
      mode: "cors",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] fetchBookCategory API error:", errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] fetchBookCategory success:", data)
    return data
  } catch (error) {
    console.error("[v0] fetchBookCategory error:", error)
    throw error
  }
}

export async function fetchBook(slug: string, lang = "en", token?: string): Promise<Book> {
  try {
    const url = `${API_BASE}/${lang}/books/${slug}/`
    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("access_token") : null)

    console.log("[v0] fetchBook called:", { url, lang, slug, hasToken: !!authToken })

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": lang,
    }

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`
    }

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers,
      mode: "cors",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] fetchBook API error:", errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] fetchBook success:", data)
    return data
  } catch (error) {
    console.error("[v0] fetchBook error:", error)
    throw error
  }
}

export async function fetchConferences(
  lang = "en",
  page = 1,
): Promise<{
  count: number
  next: string | null
  previous: string | null
  results: Conference[]
}> {
  try {
    const url = `${API_BASE}/${lang}/conferences/?page=${page}`
    console.log("[v0] Fetching conferences from URL:", url)

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("[v0] Conferences API response not OK:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Conferences API response:", data)
    console.log("[v0] Number of conferences:", data.results?.length || 0)

    return data
  } catch (error) {
    console.error("[v0] Error fetching conferences:", error)
    throw error
  }
}

export async function fetchConference(slug: string, lang = "en"): Promise<Conference> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/${lang}/conferences/${slug}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching conference:", error)
    throw error
  }
}

export async function fetchUserProfile(token: string): Promise<UserProfile> {
  try {
    const url = `${API_BASE}/auth/me/`

    const response = await fetchWithTimeout(url, {
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

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export async function fetchAuthors(lang = "en"): Promise<Author[]> {
  try {
    const url = `${API_BASE}/${lang}/authors/`
    console.log("[v0] Fetching authors from URL:", url)

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      console.error("[v0] Authors API response not OK:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Authors API response:", data)
    console.log("[v0] Number of authors:", data.length)

    return data
  } catch (error) {
    console.error("[v0] Error fetching authors:", error)
    throw error
  }
}

export async function fetchAuthor(slug: string, lang = "en"): Promise<Author> {
  try {
    const url = `${API_BASE}/${lang}/authors/${slug}/`
    console.log("[v0] Fetching author from URL:", url)

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      console.error("[v0] Author API response not OK:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Author API response:", data)

    return data
  } catch (error) {
    console.error("[v0] Error fetching author:", error)
    throw error
  }
}

export async function fetchSubscriptionPlan(id: number, lang = "en"): Promise<SubscriptionPlanDetail> {
  try {
    const url = `${API_BASE}/${id}/plans/`
    console.log("[v0] Fetching subscription plan from URL:", url)

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    if (!response.ok) {
      console.error("[v0] Subscription plan API response not OK:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Subscription plan API response:", data)

    return data
  } catch (error) {
    console.error("[v0] Error fetching subscription plan:", error)
    throw error
  }
}

export function getSlugForLang(item: { slug_uz?: string; slug_en?: string; slug_ru?: string }, lang: string): string {
  console.log("[v0] getSlugForLang called with:", { item, lang })

  let slug: string | undefined

  switch (lang) {
    case "uz":
      slug = item.slug_uz
      break
    case "en":
      slug = item.slug_en
      break
    case "ru":
      slug = item.slug_ru
      break
    default:
      slug = item.slug_uz
  }

  if (!slug) {
    console.warn(`[v0] Slug for language '${lang}' is missing, trying fallbacks...`)
    slug = item.slug_uz || item.slug_en || item.slug_ru
  }

  if (!slug) {
    console.error("[v0] No valid slug found in item:", item)
    throw new Error(`No valid slug found for language: ${lang}`)
  }

  console.log(`[v0] Returning slug for ${lang}:`, slug)
  return slug
}

export function getApiBaseUrl(): string {
  return API_BASE
}

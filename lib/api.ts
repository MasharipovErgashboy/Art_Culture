import { fetchWithAuth } from "./auth"

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
  name: string // API returns 'name', not 'title'
  description: string
  issues_count: number
  latest_issues?: JournalIssue[] // API includes this field
  image?: string // Added image field for journal images
  issn?: string // International Standard Serial Number
  about?: string // About the journal (HTML content)
  editorial_team?: string // Editorial team information (HTML content)
  article_submission?: string // Article submission guidelines (HTML content)
}

export interface JournalIssue {
  id: number
  slug_uz: string
  slug_en: string
  slug_ru: string
  name: string
  description: string
  pdf_file: string
  journal_name: string
  sections_count?: number
  latest_sections?: JournalSection[]
}

export interface JournalSection {
  id?: number
  journal_issue_name: string
  author_name: string
  name: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  pages: number
  created_at: string
  pdf: string
}

// Fetch list of book categories
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
    console.log("[v0] First category:", data[0])
    return data
  } catch (error) {
    console.error("[v0] fetchBookCategories error:", error)
    throw error
  }
}

// Fetch all journals
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

// Fetch single journal by slug
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

// Fetch journal issues by journal name
export async function fetchJournalIssues(journalName: string, lang = "en"): Promise<JournalIssue[]> {
  try {
    const encodedJournalName = encodeURIComponent(journalName)
    const url = `${API_BASE}/${lang}/journal-soni/?journal_name=${encodedJournalName}`
    console.log("[v0] Fetching issues from URL:", url)
    console.log("[v0] Original journal name:", journalName)
    console.log("[v0] Encoded journal name:", encodedJournalName)

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
    console.log("[v0] Raw issues response:", data)
    console.log("[v0] Number of issues returned:", data.length)

    const filteredIssues = data.filter((issue: JournalIssue) => {
      const matches = issue.journal_name === journalName
      console.log(
        `[v0] Issue "${issue.name}" - journal_name: "${issue.journal_name}" - matches "${journalName}": ${matches}`,
      )
      return matches
    })

    console.log("[v0] Filtered issues count:", filteredIssues.length)
    return filteredIssues
  } catch (error) {
    console.error("Error fetching journal issues:", error)
    throw error
  }
}

// Fetch single journal issue by slug
export async function fetchJournalIssue(slug: string, lang = "en"): Promise<JournalIssue> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/${lang}/journal-soni/${slug}/`, {
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
    console.error("Error fetching journal issue:", error)
    throw error
  }
}

// Fetch all conferences with pagination
export async function fetchConferences(
  lang = "en",
  page = 1,
): Promise<{
  count: number
  next: string | null
  previous: string | null
  results: any[] // Conference variable is undeclared, using any for now
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
      cache: "no-store", // Added to prevent caching issues
    })

    if (!response.ok) {
      console.error("[v0] Profile API response not OK:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Conferences API response:", data)
    console.log("[v0] Number of conferences:", data.results?.length || 0)

    if (data.results) {
      data.results.forEach((conf: any) => {
        // Conference variable is undeclared, using any for now
        console.log(`[v0] Conference: ${conf.name}`)
        console.log(`[v0] Image path: ${conf.image}`)
        console.log(`[v0] Full image URL: ${API_BASE}${conf.image}`)
      })
    }

    return data
  } catch (error) {
    console.error("[v0] Error fetching conferences:", error)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("[v0] Network error - possible causes:")
      console.error("  1. Django server is not running on https://artculture.pythonanywhere.com")
      console.error("  2. CORS is not configured properly on Django backend")
      console.error("  3. Check Django CORS settings: CORS_ALLOWED_ORIGINS should include http://localhost:3000")
    }
    throw error
  }
}

// Fetch single conference by slug
export async function fetchConference(slug: string, lang = "en"): Promise<any> {
  // Conference variable is undeclared, using any for now
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

export interface Yangilik {
  title: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  media: string | null
  homepage_content: string | null
  description: string | null
}

// Fetch single news item by slug
export async function fetchYangilik(slug: string, lang = "en"): Promise<Yangilik> {
  try {
    const url = `${API_BASE}/${lang}/yangiliklar/${slug}/`
    console.log("[v0] Fetching yangilik from URL:", url)
    console.log("[v0] Slug:", slug)
    console.log("[v0] Language:", lang)

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
      console.error("[v0] API response not OK:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Yangilik API response:", data)

    if (!data.detail) {
      console.error("[v0] API response missing detail field:", data)
      throw new Error("Invalid API response: missing detail field")
    }

    // API returns {detail: {...}, 10_data: [...]}
    return data.detail
  } catch (error) {
    console.error("[v0] Error fetching yangilik:", error)
    throw error
  }
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

export async function fetchReklama(slug: string, lang = "en"): Promise<Reklama> {
  try {
    const url = `${API_BASE}/${lang}/reklama/${slug}/`
    console.log("[v0] Fetching reklama from URL:", url)
    console.log("[v0] Slug:", slug)
    console.log("[v0] Language:", lang)

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
      console.error("[v0] API response not OK:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Reklama API response:", data)

    // API returns {detail: {...}} or just the object
    return data.detail || data
  } catch (error) {
    console.error("[v0] Error fetching reklama:", error)
    throw error
  }
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
      console.error("[v0] API response not OK:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Rasmiy elon API response:", data)

    // API returns {detail: {...}} or just the object
    return data.detail || data
  } catch (error) {
    console.error("[v0] Error fetching rasmiy elon:", error)
    throw error
  }
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

// Fetch book category with optional token
export async function fetchBookCategory(slug: string, lang = "en", token?: string): Promise<BookCategory> {
  try {
    const url = `${API_BASE}/${lang}/book-categories/${slug}/`

    console.log("[v0] ========== FETCH BOOK CATEGORY DEBUG ==========")
    console.log("[v0] URL:", url)
    console.log("[v0] Language:", lang)
    console.log("[v0] Slug:", slug)

    const response = await fetchWithAuth(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response ok:", response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] API error response:", errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Book category data received:", data)
    console.log("[v0] ========== FETCH BOOK CATEGORY SUCCESS ==========")

    return data
  } catch (error) {
    console.error("[v0] ========== FETCH BOOK CATEGORY ERROR ==========")
    console.error("[v0] Error:", error)
    console.error("[v0] ========== FETCH BOOK CATEGORY ERROR END ==========")
    throw error
  }
}

// Fetch book with optional token
export async function fetchBook(slug: string, lang = "en", token?: string): Promise<Book> {
  try {
    const url = `${API_BASE}/${lang}/books/${slug}/`

    console.log("[v0] ========== FETCH BOOK DEBUG ==========")
    console.log("[v0] URL:", url)
    console.log("[v0] Language:", lang)
    console.log("[v0] Slug:", slug)

    const response = await fetchWithAuth(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
      },
      mode: "cors",
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response ok:", response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] API error response:", errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Book data received:", data)
    console.log("[v0] ========== FETCH BOOK SUCCESS ==========")

    return data
  } catch (error) {
    console.error("[v0] ========== FETCH BOOK ERROR ==========")
    console.error("[v0] Error:", error)
    console.error("[v0] ========== FETCH BOOK ERROR END ==========")
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

  // If the requested language slug is missing, try fallbacks
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

// Fetch user profile
export async function fetchUserProfile(token: string): Promise<UserProfile> {
  try {
    const url = `${API_BASE}/auth/me/`
    console.log("[v0] Fetching user profile from URL:", url)

    const response = await fetchWithAuth(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      mode: "cors",
    })

    if (!response.ok) {
      console.error("[v0] Profile API response not OK:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] User profile API response:", data)

    return data
  } catch (error) {
    console.error("[v0] Error fetching user profile:", error)
    throw error
  }
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

// Fetch single author by slug
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

export interface SubscriptionPlanDetail {
  id: number
  name: string
  duration_days: number
  price: string
  books: Book[]
  journals: Journal[]
  conferences: any[] // Using any for now since Conference interface is not fully defined
  books_count: number
  journals_count: number
  conferences_count: number
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

export async function buySubscription(subscriptionTypeId: number, token: string, lang = "en"): Promise<Subscription> {
  try {
    const url = `${API_BASE}/${lang}/buy/?subscription_type_id=${subscriptionTypeId}`
    console.log("[v0] Buying subscription from URL:", url)

    const response = await fetchWithAuth(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Buy subscription API error:", response.status, errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Buy subscription API response:", data)

    return data
  } catch (error) {
    console.error("[v0] Error buying subscription:", error)
    throw error
  }
}

// Helper to get API base URL (useful for debugging)
export function getApiBaseUrl(): string {
  return API_BASE
}

export async function fetchJournalSections(issueName: string, lang = "en"): Promise<JournalSection[]> {
  try {
    const url = `${API_BASE}/${lang}/journal-sections/?journal_issue_name=${encodeURIComponent(issueName)}`
    console.log("[v0] Fetching journal sections from URL:", url)

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
      console.error("[v0] Journal sections API response not OK:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Journal sections API response:", data)
    console.log("[v0] Number of sections:", data.length)

    return data
  } catch (error) {
    console.error("[v0] Error fetching journal sections:", error)
    throw error
  }
}

export async function fetchAllJournalSections(lang = "en"): Promise<JournalSection[]> {
  try {
    const url = `${API_BASE}/${lang}/journal-sections/`
    console.log("[v0] Fetching all journal sections from URL:", url)

    const response = await fetchWithAuth(url, {
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

export async function fetchSectionPdf(slug: string, lang = "en"): Promise<Blob> {
  try {
    const url = `${API_BASE}/${lang}/section/${slug}/`
    console.log("[v0] ========== FETCH SECTION PDF DEBUG ==========")
    console.log("[v0] Fetching section PDF from URL:", url)
    console.log("[v0] Language:", lang)
    console.log("[v0] Slug:", slug)

    const response = await fetchWithAuth(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
      mode: "cors",
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response ok:", response.ok)
    console.log("[v0] Response content-type:", response.headers.get("content-type"))

    if (!response.ok) {
      const contentType = response.headers.get("content-type")
      let errorMessage = `HTTP error! status: ${response.status}`

      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json()
          console.error("[v0] API error response (JSON):", errorData)
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch (e) {
          console.error("[v0] Could not parse error response as JSON")
        }
      } else {
        const errorText = await response.text()
        console.error("[v0] API error response (text):", errorText)
        if (errorText) {
          errorMessage = errorText
        }
      }

      throw new Error(errorMessage)
    }

    const blob = await response.blob()
    console.log("[v0] fetchSectionPdf success, blob size:", blob.size)
    console.log("[v0] Blob type:", blob.type)
    console.log("[v0] ========== FETCH SECTION PDF SUCCESS ==========")
    return blob
  } catch (error) {
    console.error("[v0] ========== FETCH SECTION PDF ERROR ==========")
    console.error("[v0] Error:", error)
    console.error("[v0] ========== FETCH SECTION PDF ERROR END ==========")
    throw error
  }
}

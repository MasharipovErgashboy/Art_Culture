const API_BASE = "http://127.0.0.1:8000"
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

// Fetch journal sections by journal issue name
export async function fetchJournalSections(journalIssueName: string, lang = "en"): Promise<JournalSection[]> {
  try {
    const encodedIssueName = encodeURIComponent(journalIssueName)
    const url = `${API_BASE}/${lang}/journal-sections/?journal_issue_name=${encodedIssueName}`
    console.log("[v0] Fetching sections from URL:", url)
    console.log("[v0] Original issue name:", journalIssueName)
    console.log("[v0] Encoded issue name:", encodedIssueName)

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
    console.log("[v0] Raw sections response:", data)
    console.log("[v0] Number of sections returned:", data.length)

    const filteredSections = data.filter((section: JournalSection) => {
      const matches = section.journal_issue_name === journalIssueName
      console.log(
        `[v0] Section by "${section.author_name}" - journal_issue_name: "${section.journal_issue_name}" - matches "${journalIssueName}": ${matches}`,
      )
      return matches
    })

    console.log("[v0] Filtered sections count:", filteredSections.length)
    return filteredSections
  } catch (error) {
    console.error("Error fetching journal sections:", error)
    throw error
  }
}

export interface Conference {
  name: string
  slug_uz: string
  slug_en: string
  slug_ru: string
  image: string | null
  date: string
  manzil: string
  tashkilotchi_hamkorlar: string | null
  description: string
  pdf: string | null
}

// Fetch all conferences with pagination
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
      cache: "no-store", // Added to prevent caching issues
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Conferences API response:", data)
    console.log("[v0] Number of conferences:", data.results?.length || 0)

    if (data.results) {
      data.results.forEach((conf: Conference) => {
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
      console.error("  1. Django server is not running on http://127.0.0.1:8000")
      console.error("  2. CORS is not configured properly on Django backend")
      console.error("  3. Check Django CORS settings: CORS_ALLOWED_ORIGINS should include http://localhost:3000")
    }
    throw error
  }
}

// Fetch single conference by slug
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

export function getSlugForLang(item: { slug_uz: string; slug_en: string; slug_ru: string }, lang: string): string {
  switch (lang) {
    case "uz":
      return item.slug_uz
    case "en":
      return item.slug_en
    case "ru":
      return item.slug_ru
    default:
      return item.slug_uz
  }
}

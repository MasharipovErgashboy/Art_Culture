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
    return data.filter((issue: JournalIssue) => issue.journal_name === journalName)
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
    return data.filter((section: JournalSection) => section.journal_issue_name === journalIssueName)
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
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Error fetching conferences:", error)
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
    console.error("[v0] Error fetching yangilik:", error)
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

// Fetch single rasmiy elon by slug
export async function fetchRasmiyElon(slug: string, lang = "en"): Promise<RasmiyElon> {
  try {
    const url = `${API_BASE}/${lang}/rasmiy-elonlar/${slug}/`
    console.log("[v0] Fetching rasmiy elon from URL:", url)
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
    console.log("[v0] Rasmiy elon API response:", data)

    // API returns {detail: {...}} or just the object
    return data.detail || data
  } catch (error) {
    console.error("[v0] Error fetching rasmiy elon:", error)
    throw error
  }
}

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

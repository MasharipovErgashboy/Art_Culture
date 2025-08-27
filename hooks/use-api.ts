import useSWR from "swr"
import type { SearchParams } from "@/lib/types"
import { apiClient } from "@/lib/api"

export function useJournals(params?: SearchParams) {
  const { data, error, isLoading, mutate } = useSWR(["journals", params], () => apiClient.getJournals(params))

  return {
    journals: data?.data || [],
    isLoading,
    error,
    mutate,
    pagination: data?.pagination,
  }
}

export function useJournal(id: string) {
  const { data, error, isLoading, mutate } = useSWR(id ? ["journal", id] : null, () => apiClient.getJournal(id))

  return {
    journal: data?.data,
    isLoading,
    error,
    mutate,
  }
}

export function useBooks(params?: SearchParams) {
  const { data, error, isLoading, mutate } = useSWR(["books", params], () => apiClient.getBooks(params))

  return {
    books: data?.data || [],
    isLoading,
    error,
    mutate,
    pagination: data?.pagination,
  }
}

export function useBook(id: string) {
  const { data, error, isLoading, mutate } = useSWR(id ? ["book", id] : null, () => apiClient.getBook(id))

  return {
    book: data?.data,
    isLoading,
    error,
    mutate,
  }
}

export function useNews(params?: SearchParams) {
  const { data, error, isLoading, mutate } = useSWR(["news", params], () => apiClient.getNews(params))

  return {
    news: data?.data || [],
    isLoading,
    error,
    mutate,
    pagination: data?.pagination,
  }
}

export function useNewsItem(id: string) {
  const { data, error, isLoading, mutate } = useSWR(id ? ["news-item", id] : null, () => apiClient.getNewsItem(id))

  return {
    newsItem: data?.data,
    isLoading,
    error,
    mutate,
  }
}

export function useConferences(type?: "upcoming" | "past") {
  const { data, error, isLoading, mutate } = useSWR(["conferences", type], () => apiClient.getConferences(type))

  return {
    conferences: data?.data || [],
    isLoading,
    error,
    mutate,
  }
}

export function useStatistics() {
  const { data, error, isLoading, mutate } = useSWR("statistics", () => apiClient.getStatistics())

  return {
    statistics: data?.data,
    isLoading,
    error,
    mutate,
  }
}

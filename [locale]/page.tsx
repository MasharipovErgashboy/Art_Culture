"use client"

import { useEffect, useState } from "react"

export default function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // API URL tilga qarab tanlanadi
        const apiUrl =
          locale === "uz"
            ? "https://artculture.pythonanywhere.com/" // default
            : `https://artculture.pythonanywhere.com/${locale}`

        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error(`API error: ${res.status}`)

        const json = await res.json()
        setData(json)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [locale])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Home Page (til: {locale.toUpperCase()})
      </h1>

      {loading && <p>⏳ Yuklanmoqda...</p>}
      {error && <p className="text-red-500">❌ Xato: {error}</p>}

      {data && (
        <pre className="bg-gray-100 p-4 rounded-md">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  )
}

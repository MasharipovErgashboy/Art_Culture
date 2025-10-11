"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/Loader"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { CheckCircle2, XCircle, ShoppingCart, Clock, BookOpen, FileText, Users } from "lucide-react"

const API_BASE = "https://artculture.pythonanywhere.com"

interface SubscriptionType {
  id: number
  name: string
  duration_days: number
  price: string
  books_count: number
  journals_count: number
  conferences_count: number
}

interface UserSubscription {
  id: number
  subscription_type: SubscriptionType
  start_date: string
  end_date: string
  is_active: boolean
}

const translations = {
  uz: {
    title: "Obuna sotib olish",
    loading: "Yuklanmoqda...",
    purchasing: "Obuna sotib olinmoqda...",
    success: "Obuna muvaffaqiyatli sotib olindi!",
    error: "Xatolik yuz berdi",
    notLoggedIn: "Tizimga kirish talab qilinadi",
    notLoggedInDesc: "Obuna sotib olish uchun tizimga kirishingiz kerak.",
    loginButton: "Tizimga kirish",
    invalidId: "Noto'g'ri obuna turi",
    invalidIdDesc: "Obuna turi ID si topilmadi yoki noto'g'ri.",
    backToHome: "Bosh sahifaga qaytish",
    subscriptionDetails: "Obuna tafsilotlari",
    duration: "Davomiyligi",
    days: "kun",
    price: "Narxi",
    includes: "Quyidagilarni o'z ichiga oladi",
    books: "Kitoblar",
    journals: "Jurnallar",
    conferences: "Konferensiyalar",
    confirmPurchase: "Sotib olishni tasdiqlash",
    viewSubscription: "Obunani ko'rish",
    startDate: "Boshlanish sanasi",
    endDate: "Tugash sanasi",
    status: "Holati",
    active: "Faol",
    availableSubscriptions: "Mavjud obunalar",
    selectSubscription: "Obunani tanlang",
  },
  ru: {
    title: "Купить подписку",
    loading: "Загрузка...",
    purchasing: "Покупка подписки...",
    success: "Подписка успешно куплена!",
    error: "Произошла ошибка",
    notLoggedIn: "Требуется вход в систему",
    notLoggedInDesc: "Для покупки подписки необходимо войти в систему.",
    loginButton: "Войти",
    invalidId: "Неверный тип подписки",
    invalidIdDesc: "ID типа подписки не найден или неверен.",
    backToHome: "Вернуться на главную",
    subscriptionDetails: "Детали подписки",
    duration: "Длительность",
    days: "дней",
    price: "Цена",
    includes: "Включает",
    books: "Книги",
    journals: "Журналы",
    conferences: "Конференции",
    confirmPurchase: "Подтвердить покупку",
    viewSubscription: "Посмотреть подписку",
    startDate: "Дата начала",
    endDate: "Дата окончания",
    status: "Статус",
    active: "Активна",
    availableSubscriptions: "Доступные подписки",
    selectSubscription: "Выберите подписку",
  },
  en: {
    title: "Buy Subscription",
    loading: "Loading...",
    purchasing: "Purchasing subscription...",
    success: "Subscription purchased successfully!",
    error: "An error occurred",
    notLoggedIn: "Login required",
    notLoggedInDesc: "You need to login to purchase a subscription.",
    loginButton: "Login",
    invalidId: "Invalid subscription type",
    invalidIdDesc: "Subscription type ID not found or invalid.",
    backToHome: "Back to Home",
    subscriptionDetails: "Subscription Details",
    duration: "Duration",
    days: "days",
    price: "Price",
    includes: "Includes",
    books: "Books",
    journals: "Journals",
    conferences: "Conferences",
    confirmPurchase: "Confirm Purchase",
    viewSubscription: "View Subscription",
    startDate: "Start Date",
    endDate: "End Date",
    status: "Status",
    active: "Active",
    availableSubscriptions: "Available Subscriptions",
    selectSubscription: "Select a subscription",
  },
}

export default function BuySubscriptionPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const lang = params.lang as string
  const t = translations[lang as keyof typeof translations] || translations.en

  const subscriptionTypeId = searchParams.get("subscription_type_id")

  const [allSubscriptions, setAllSubscriptions] = useState<SubscriptionType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType | null>(null)
  const [purchasedSubscription, setPurchasedSubscription] = useState<UserSubscription | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    setSubscriptionType(null)

    // Check if user is logged in
    const token = localStorage.getItem("access_token")
    if (!token) {
      setIsLoggedIn(false)
      setIsLoading(false)
      return
    }

    setIsLoggedIn(true)

    fetchAllSubscriptions()
  }, [subscriptionTypeId, lang])

  const fetchAllSubscriptions = async () => {
    try {
      const currentT = translations[lang as keyof typeof translations] || translations.en

      const response = await fetch(`${API_BASE}/${lang}`)
      if (!response.ok) throw new Error("Failed to fetch subscriptions")

      const data = await response.json()
      const subscriptions = data.subscriptions || []
      setAllSubscriptions(subscriptions)

      // Find the selected subscription
      if (subscriptionTypeId) {
        const subscription = subscriptions.find(
          (sub: SubscriptionType) => sub.id === Number.parseInt(subscriptionTypeId),
        )

        if (!subscription) {
          setError(currentT.invalidIdDesc)
        } else {
          setSubscriptionType(subscription)
        }
      } else if (subscriptions.length > 0) {
        // If no subscription is selected, select the first one
        setSubscriptionType(subscriptions[0])
        router.replace(`/${lang}/buy/?subscription_type_id=${subscriptions[0].id}`)
      }
    } catch (err) {
      const currentT = translations[lang as keyof typeof translations] || translations.en
      setError(currentT.error)
      console.error("[v0] Error fetching subscriptions:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectSubscription = (subscription: SubscriptionType) => {
    setSubscriptionType(subscription)
    router.push(`/${lang}/buy/?subscription_type_id=${subscription.id}`)
  }

  const handlePurchase = async () => {
    if (!subscriptionTypeId) return

    setIsPurchasing(true)
    setError(null)

    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        router.push(
          `/${lang}/login?returnUrl=${encodeURIComponent(`/${lang}/buy/?subscription_type_id=${subscriptionTypeId}`)}`,
        )
        return
      }

      const response = await fetch(`${API_BASE}/${lang}/buy/?subscription_type_id=${subscriptionTypeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to purchase subscription")
      }

      const data: UserSubscription = await response.json()
      setPurchasedSubscription(data)
      console.log("[v0] Subscription purchased successfully:", data)
    } catch (err: any) {
      setError(err.message || t.error)
      console.error("[v0] Error purchasing subscription:", err)
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleLoginRedirect = () => {
    router.push(
      `/${lang}/login?returnUrl=${encodeURIComponent(`/${lang}/buy/?subscription_type_id=${subscriptionTypeId}`)}`,
    )
  }

  const handleViewSubscription = () => {
    if (purchasedSubscription) {
      router.push(`/${lang}/subscription/${purchasedSubscription.subscription_type.id}`)
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
        <Footer />
      </>
    )
  }

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive mb-2">
                <XCircle className="h-6 w-6" />
                <CardTitle>{t.notLoggedIn}</CardTitle>
              </div>
              <CardDescription>{t.notLoggedInDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleLoginRedirect} className="w-full">
                {t.loginButton}
              </Button>
              <Button variant="outline" onClick={() => router.push(`/${lang}`)} className="w-full">
                {t.backToHome}
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    )
  }

  if (purchasedSubscription) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle2 className="h-6 w-6" />
                <CardTitle>{t.success}</CardTitle>
              </div>
              <CardDescription>{t.subscriptionDetails}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="font-medium">{purchasedSubscription.subscription_type.name}</span>
                  <span className="text-2xl font-bold">{purchasedSubscription.subscription_type.price} UZS</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{t.startDate}</p>
                    <p className="font-medium">{new Date(purchasedSubscription.start_date).toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{t.endDate}</p>
                    <p className="font-medium">{new Date(purchasedSubscription.end_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">{t.status}</p>
                  <p className="font-medium text-green-600">{t.active}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">{t.includes}:</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">{purchasedSubscription.subscription_type.books_count}</span>{" "}
                      {t.books}
                    </div>
                    <div>
                      <span className="font-medium">{purchasedSubscription.subscription_type.journals_count}</span>{" "}
                      {t.journals}
                    </div>
                    <div>
                      <span className="font-medium">{purchasedSubscription.subscription_type.conferences_count}</span>{" "}
                      {t.conferences}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleViewSubscription} className="flex-1">
                  {t.viewSubscription}
                </Button>
                <Button variant="outline" onClick={() => router.push(`/${lang}`)} className="flex-1">
                  {t.backToHome}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
            <p className="text-muted-foreground">{t.selectSubscription}</p>
          </div>

          <div className="grid lg:grid-cols-[350px_1fr] gap-6">
            {/* Left column: Subscriptions list */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">{t.availableSubscriptions}</h2>
              {allSubscriptions.map((subscription) => (
                <Card
                  key={subscription.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    subscriptionType?.id === subscription.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSelectSubscription(subscription)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{subscription.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {subscription.duration_days} {t.days}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-3">{subscription.price} UZS</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {subscription.books_count} {t.books}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {subscription.journals_count} {t.journals}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {subscription.conferences_count} {t.conferences}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right column: Selected subscription details */}
            <div>
              {subscriptionType ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="h-6 w-6" />
                      <CardTitle>{t.subscriptionDetails}</CardTitle>
                    </div>
                    <CardDescription>{subscriptionType.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4">
                      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <span className="font-medium text-lg">{subscriptionType.name}</span>
                        <span className="text-2xl font-bold">{subscriptionType.price} UZS</span>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">{t.duration}</p>
                        <p className="font-medium">
                          {subscriptionType.duration_days} {t.days}
                        </p>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">{t.includes}:</p>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="font-medium">{subscriptionType.books_count}</span> {t.books}
                          </div>
                          <div>
                            <span className="font-medium">{subscriptionType.journals_count}</span> {t.journals}
                          </div>
                          <div>
                            <span className="font-medium">{subscriptionType.conferences_count}</span> {t.conferences}
                          </div>
                        </div>
                      </div>
                    </div>

                    {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

                    <div className="flex gap-4">
                      <Button onClick={handlePurchase} disabled={isPurchasing} className="flex-1">
                        {isPurchasing ? t.purchasing : t.confirmPurchase}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/${lang}`)}
                        disabled={isPurchasing}
                        className="flex-1"
                      >
                        {t.backToHome}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">{t.selectSubscription}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AlertCircle, CheckCircle, Shield, Crown, Star, Calendar, DollarSign } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

interface Translations {
  myProfile: string
  manageAccount: string
  profileUpdated: string
  authTokenNotFound: string
  sessionExpired: string
  networkError: string
  noProfileData: string
  personalInfo: string
  username: string
  emailAddress: string
  subscriptionStatus: string
  currentPlan: string
  activePremium: string
  expired: string
  limitedAccess: string
  freePlan: string
  renewSubscription: string
  startDate: string
  endDate: string
  price: string
  books: string
  journals: string
  conferences: string
  active: string
  upgradeToPremium: string
}

const translations: { [key: string]: Translations } = {
  uz: {
    myProfile: "Mening profilim",
    manageAccount: "Hisob sozlamalarini boshqarish",
    profileUpdated: "Profil muvaffaqiyatli yangilandi!",
    authTokenNotFound: "Autentifikatsiya tokeni topilmadi. Iltimos, qayta kiring.",
    sessionExpired: "Sessiya muddati tugadi. Iltimos, qayta kiring.",
    networkError: "Tarmoq xatosi. Iltimos, ulanishingizni tekshiring.",
    noProfileData: "Profil ma'lumotlari mavjud emas.",
    personalInfo: "Shaxsiy ma'lumotlar",
    username: "Foydalanuvchi nomi",
    emailAddress: "Elektron pochta manzili",
    subscriptionStatus: "Obuna holati",
    currentPlan: "Joriy reja",
    activePremium: "Faol Premium",
    expired: "Muddati tugagan",
    limitedAccess: "Cheklangan kirish",
    freePlan: "Bepul reja",
    renewSubscription: "Premium obunani yangilash",
    startDate: "Boshlanish sanasi",
    endDate: "Tugash sanasi",
    price: "Narxi",
    books: "Kitoblar",
    journals: "Jurnallar",
    conferences: "Konferensiyalar",
    active: "Faol",
    upgradeToPremium: "Premium ga o'tish",
  },
  ru: {
    myProfile: "Мой профиль",
    manageAccount: "Управление настройками аккаунта",
    profileUpdated: "Профиль успешно обновлен!",
    authTokenNotFound: "Токен аутентификации не найден. Пожалуйста, войдите снова.",
    sessionExpired: "Сессия истекла. Пожалуйста, войдите снова.",
    networkError: "Ошибка сети. Пожалуйста, проверьте подключение.",
    noProfileData: "Данные профиля недоступны.",
    personalInfo: "Личная информация",
    username: "Имя пользователя",
    emailAddress: "Адрес электронной почты",
    subscriptionStatus: "Статус подписки",
    currentPlan: "Текущий план",
    activePremium: "Активный Premium",
    expired: "Истек",
    limitedAccess: "Ограниченный доступ",
    freePlan: "Бесплатный план",
    renewSubscription: "Продлить Premium подписку",
    startDate: "Дата начала",
    endDate: "Дата окончания",
    price: "Цена",
    books: "Книги",
    journals: "Журналы",
    conferences: "Конференции",
    active: "Активный",
    upgradeToPremium: "Перейти на Premium",
  },
  en: {
    myProfile: "My Profile",
    manageAccount: "Manage your account settings and preferences",
    profileUpdated: "Profile updated successfully!",
    authTokenNotFound: "Authentication token not found. Please login again.",
    sessionExpired: "Session expired. Please login again.",
    networkError: "Network error. Please check your connection.",
    noProfileData: "No profile data available.",
    personalInfo: "Personal Information",
    username: "Username",
    emailAddress: "Email Address",
    subscriptionStatus: "Subscription Status",
    currentPlan: "Current Plan",
    activePremium: "Active Premium",
    expired: "Expired",
    limitedAccess: "Limited access",
    freePlan: "Free Plan",
    renewSubscription: "Renew Premium Subscription",
    startDate: "Start Date",
    endDate: "End Date",
    price: "Price",
    books: "Books",
    journals: "Journals",
    conferences: "Conferences",
    active: "Active",
    upgradeToPremium: "Upgrade to Premium",
  },
}

interface SubscriptionType {
  id: number
  name: string
  duration_days: number
  price: string
  books_count: number
  journals_count: number
  conferences_count: number
}

interface Subscription {
  id: number
  subscription_type: SubscriptionType
  start_date: string
  end_date: string
  is_active: boolean
}

interface UserProfile {
  email: string
  username: string
  subscription: {
    active: Subscription[]
    ended: Subscription[]
  } | null
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const lang = (params?.lang as string) || "uz"
  const currentLang = lang
  const t = translations[currentLang as keyof typeof translations] || translations.uz

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("access_token")
        if (!token) {
          setError(t.authTokenNotFound)
          return
        }

        const response = await fetch("https://artculture.pythonanywhere.com/auth/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("401")
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: UserProfile = await response.json()
        setProfile(data)
      } catch (err) {
        console.error("[v0] Profile fetch error:", err)
        if (err instanceof Error && err.message.includes("401")) {
          setError(t.sessionExpired)
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
        } else {
          setError(t.networkError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [t])

  const getSubscriptionBadge = (subscription: UserProfile["subscription"]) => {
    const hasActiveSubscription = subscription?.active && subscription.active.length > 0
    const hasEndedSubscription = subscription?.ended && subscription.ended.length > 0

    if (hasActiveSubscription) {
      return (
        <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
          <Crown className="w-3 h-3 mr-1" />
          {t.activePremium}
        </Badge>
      )
    } else if (hasEndedSubscription) {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          {t.expired}
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="border-gray-300 text-gray-600">
          <Star className="w-3 h-3 mr-1" />
          {t.freePlan}
        </Badge>
      )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(currentLang === "uz" ? "uz-UZ" : currentLang === "ru" ? "ru-RU" : "en-US", {
      year: "numeric",
      month: currentLang === "uz" ? "2-digit" : "long",
      day: "numeric",
    })
  }

  const handleUpgradeToPremium = () => {
    router.push(`/${lang}/buy/`)
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto py-12 px-4 max-w-6xl">
            <div className="animate-pulse space-y-8">
              <div className="h-10 bg-gray-200 rounded-lg w-64"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="h-64 bg-white rounded-2xl shadow-sm"></div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-48 bg-white rounded-2xl shadow-sm"></div>
                  <div className="h-48 bg-white rounded-2xl shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto py-12 px-4 max-w-6xl">
            <Alert variant="destructive" className="shadow-lg">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    )
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto py-12 px-4 max-w-6xl">
            <Alert className="shadow-lg">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>{t.noProfileData}</AlertDescription>
            </Alert>
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto py-12 px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.myProfile}</h1>
            <p className="text-gray-600 text-lg">{t.manageAccount}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Profile Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm border-0 bg-white sticky top-24">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {profile?.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                        {profile?.subscription?.active && profile.subscription.active.length > 0 ? (
                          <Crown className="w-6 h-6 text-yellow-500" />
                        ) : (
                          <Star className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 w-full">
                      <h2 className="text-2xl font-bold text-gray-900 break-words">{profile?.username}</h2>
                      <p className="text-sm text-gray-600 break-all">{profile?.email}</p>
                    </div>

                    <Separator />

                    <div className="w-full">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                        {t.subscriptionStatus}
                      </p>
                      <div className="flex justify-center">{getSubscriptionBadge(profile?.subscription)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Subscription Details */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm border-0 bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{t.subscriptionStatus}</h3>
                  </div>

                  {profile?.subscription?.active && profile.subscription.active.length > 0 ? (
                    <div className="space-y-4">
                      {profile.subscription.active
                        .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime())
                        .map((sub, index) => (
                          <div
                            key={sub.id}
                            className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                                  {index === 0 ? t.currentPlan : "Oldingi reja"}
                                </p>
                                <div className="flex items-center gap-3">
                                  <Crown className="w-6 h-6 text-yellow-500" />
                                  <span className="text-2xl font-bold text-gray-900">{sub.subscription_type.name}</span>
                                </div>
                              </div>
                              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 px-4 py-1">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {t.active}
                              </Badge>
                            </div>

                            <div className="space-y-3 mt-6">
                              <div className="flex items-center gap-3 text-gray-700">
                                <Calendar className="w-5 h-5 text-emerald-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-500">{t.startDate}</p>
                                  <p className="font-semibold">{formatDate(sub.start_date)}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-gray-700">
                                <Calendar className="w-5 h-5 text-emerald-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-500">{t.endDate}</p>
                                  <p className="font-semibold">{formatDate(sub.end_date)}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-gray-700">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-500">{t.price}</p>
                                  <p className="font-semibold">{sub.subscription_type.price} UZS</p>
                                </div>
                              </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="bg-white rounded-lg p-3">
                                <p className="text-2xl font-bold text-emerald-600">
                                  {sub.subscription_type.books_count}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">{t.books}</p>
                              </div>
                              <div className="bg-white rounded-lg p-3">
                                <p className="text-2xl font-bold text-emerald-600">
                                  {sub.subscription_type.journals_count}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">{t.journals}</p>
                              </div>
                              <div className="bg-white rounded-lg p-3">
                                <p className="text-2xl font-bold text-emerald-600">
                                  {sub.subscription_type.conferences_count}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">{t.conferences}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : profile?.subscription?.ended && profile.subscription.ended.length > 0 ? (
                    <div className="space-y-6">
                      {profile.subscription.ended.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2">
                                {t.currentPlan}
                              </p>
                              <div className="flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                                <span className="text-2xl font-bold text-gray-900">{sub.subscription_type.name}</span>
                              </div>
                            </div>
                            <Badge variant="destructive" className="px-4 py-1">
                              {t.expired}
                            </Badge>
                          </div>

                          <div className="space-y-3 mt-6">
                            <div className="flex items-center gap-3 text-gray-700">
                              <Calendar className="w-5 h-5 text-red-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">{t.endDate}</p>
                                <p className="font-semibold">{formatDate(sub.end_date)}</p>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 font-medium my-6">{t.limitedAccess}</p>
                          <Button
                            onClick={handleUpgradeToPremium}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                          >
                            <Crown className="w-5 h-5 mr-2" />
                            {t.renewSubscription}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                            {t.currentPlan}
                          </p>
                          <div className="flex items-center gap-3">
                            <Star className="w-6 h-6 text-gray-400" />
                            <span className="text-2xl font-bold text-gray-900">{t.freePlan}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-gray-300 text-gray-600 px-4 py-1">
                          Free
                        </Badge>
                      </div>
                      <p className="text-gray-700 font-medium mb-6">{t.limitedAccess}</p>
                      <Button
                        onClick={handleUpgradeToPremium}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        {t.upgradeToPremium}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </ProtectedRoute>
  )
}

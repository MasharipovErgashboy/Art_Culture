"use client"

import { use, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { User, Edit3, Save, X, AlertCircle, CheckCircle, Shield, Crown, Star } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { fetchUserProfile, type UserProfile } from "@/lib/api"

interface Translations {
  myProfile: string
  manageAccount: string
  editProfile: string
  profileUpdated: string
  authTokenNotFound: string
  sessionExpired: string
  failedToFetch: string
  networkError: string
  noProfileData: string
  personalInfo: string
  username: string
  emailAddress: string
  subscriptionStatus: string
  currentPlan: string
  activePremium: string
  fullAccess: string
  pendingActivation: string
  activationInProgress: string
  expired: string
  limitedAccess: string
  freePlan: string
  renewSubscription: string
  saveChanges: string
  savingChanges: string
  cancel: string
  failedToSave: string
}

const translations: { [key: string]: Translations } = {
  uz: {
    myProfile: "Mening profilim",
    manageAccount: "Hisob sozlamalarini boshqarish",
    editProfile: "Profilni tahrirlash",
    profileUpdated: "Profil muvaffaqiyatli yangilandi!",
    authTokenNotFound: "Autentifikatsiya tokeni topilmadi. Iltimos, qayta kiring.",
    sessionExpired: "Sessiya muddati tugadi. Iltimos, qayta kiring.",
    failedToFetch: "Profilni yuklashda xatolik",
    networkError: "Tarmoq xatosi. Iltimos, ulanishingizni tekshiring.",
    noProfileData: "Profil ma'lumotlari mavjud emas.",
    personalInfo: "Shaxsiy ma'lumotlar",
    username: "Foydalanuvchi nomi",
    emailAddress: "Elektron pochta manzili",
    subscriptionStatus: "Obuna holati",
    currentPlan: "Joriy reja",
    activePremium: "Faol Premium",
    fullAccess: "Barcha funksiyalarga to'liq kirish",
    pendingActivation: "Faollashtirish kutilmoqda",
    activationInProgress: "Faollashtirish jarayonda",
    expired: "Muddati tugagan",
    limitedAccess: "Cheklangan kirish",
    freePlan: "Bepul reja",
    renewSubscription: "Premium obunani yangilash",
    saveChanges: "O'zgarishlarni saqlash",
    savingChanges: "O'zgarishlar saqlanmoqda...",
    cancel: "Bekor qilish",
    failedToSave: "Profil o'zgarishlarini saqlashda xatolik.",
  },
  ru: {
    myProfile: "Мой профиль",
    manageAccount: "Управление настройками аккаунта",
    editProfile: "Редактировать профиль",
    profileUpdated: "Профиль успешно обновлен!",
    authTokenNotFound: "Токен аутентификации не найден. Пожалуйста, войдите снова.",
    sessionExpired: "Сессия истекла. Пожалуйста, войдите снова.",
    failedToFetch: "Не удалось загрузить профиль",
    networkError: "Ошибка сети. Пожалуйста, проверьте подключение.",
    noProfileData: "Данные профиля недоступны.",
    personalInfo: "Личная информация",
    username: "Имя пользователя",
    emailAddress: "Адрес электронной почты",
    subscriptionStatus: "Статус подписки",
    currentPlan: "Текущий план",
    activePremium: "Активный Premium",
    fullAccess: "Полный доступ ко всем функциям",
    pendingActivation: "Ожидание активации",
    activationInProgress: "Активация в процессе",
    expired: "Истек",
    limitedAccess: "Ограниченный доступ",
    freePlan: "Бесплатный план",
    renewSubscription: "Продлить Premium подписку",
    saveChanges: "Сохранить изменения",
    savingChanges: "Сохранение изменений...",
    cancel: "Отмена",
    failedToSave: "Не удалось сохранить изменения профиля.",
  },
  en: {
    myProfile: "My Profile",
    manageAccount: "Manage your account settings and preferences",
    editProfile: "Edit Profile",
    profileUpdated: "Profile updated successfully!",
    authTokenNotFound: "Authentication token not found. Please login again.",
    sessionExpired: "Session expired. Please login again.",
    failedToFetch: "Failed to fetch profile",
    networkError: "Network error. Please check your connection.",
    noProfileData: "No profile data available.",
    personalInfo: "Personal Information",
    username: "Username",
    emailAddress: "Email Address",
    subscriptionStatus: "Subscription Status",
    currentPlan: "Current Plan",
    activePremium: "Active Premium",
    fullAccess: "Full access to all features",
    pendingActivation: "Pending Activation",
    activationInProgress: "Activation in progress",
    expired: "Expired",
    limitedAccess: "Limited access",
    freePlan: "Free Plan",
    renewSubscription: "Renew Premium Subscription",
    saveChanges: "Save Changes",
    savingChanges: "Saving Changes...",
    cancel: "Cancel",
    failedToSave: "Failed to save profile changes.",
  },
}

export default function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params)
  const currentLang = lang || "uz"
  const t = translations[currentLang as keyof typeof translations] || translations.uz

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

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

        const data = await fetchUserProfile(token)
        setProfile(data)
        setEditedProfile(data)
      } catch (err) {
        console.error("Profile fetch error:", err)
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

  const handleEdit = () => {
    setIsEditing(true)
    setSaveMessage(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedProfile(profile)
    setSaveMessage(null)
  }

  const handleSave = async () => {
    if (!editedProfile) return

    try {
      setSaving(true)
      setSaveMessage(null)

      const token = localStorage.getItem("access_token")
      if (!token) {
        setError(t.authTokenNotFound)
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProfile(editedProfile)
      setIsEditing(false)
      setSaveMessage(t.profileUpdated)

      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      console.error("Profile save error:", err)
      setError(t.failedToSave)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value,
      })
    }
  }

  const getSubscriptionBadge = (subscription: { active: string[]; ended: string[] } | null) => {
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
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.myProfile}</h1>
            <p className="text-gray-600 text-lg">{t.manageAccount}</p>
          </div>

          {saveMessage && (
            <Alert className="mb-8 border-emerald-200 bg-emerald-50 shadow-sm">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <AlertDescription className="text-emerald-800 font-medium">{saveMessage}</AlertDescription>
            </Alert>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Profile Card */}
            <div className="lg:col-span-1">
              <Card className="shadow-sm border-0 bg-white sticky top-24">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {profile.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                        {profile.subscription?.active && profile.subscription.active.length > 0 ? (
                          <Crown className="w-6 h-6 text-yellow-500" />
                        ) : (
                          <Star className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="space-y-2 w-full">
                      <h2 className="text-2xl font-bold text-gray-900 break-words">{profile.username}</h2>
                      <p className="text-sm text-gray-600 break-all">{profile.email}</p>
                    </div>

                    <Separator />

                    {/* Subscription Badge */}
                    <div className="w-full">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                        {t.subscriptionStatus}
                      </p>
                      <div className="flex justify-center">{getSubscriptionBadge(profile.subscription)}</div>
                    </div>

                    {/* Edit Button */}
                    {!isEditing && (
                      <Button
                        onClick={handleEdit}
                        variant="outline"
                        className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
                        size="lg"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {t.editProfile}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Information Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Card */}
              <Card className="shadow-sm border-0 bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{t.personalInfo}</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Username Field */}
                    <div className="space-y-3">
                      <Label htmlFor="username" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        {t.username}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="username"
                          value={editedProfile?.username || ""}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
                        />
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium">
                          {profile.username}
                        </div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        {t.emailAddress}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile?.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
                        />
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium break-all">
                          {profile.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons for Edit Mode */}
                  {isEditing && (
                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            {t.savingChanges}
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {t.saveChanges}
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        disabled={saving}
                        className="flex-1 h-12 border-gray-300 hover:bg-gray-50 bg-transparent"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t.cancel}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Subscription Details Card */}
              <Card className="shadow-sm border-0 bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <Shield className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{t.subscriptionStatus}</h3>
                  </div>

                  {/* Subscription Status Display */}
                  {profile.subscription?.active && profile.subscription.active.length > 0 ? (
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                            {t.currentPlan}
                          </p>
                          <div className="flex items-center gap-3">
                            <Crown className="w-6 h-6 text-yellow-500" />
                            <span className="text-2xl font-bold text-gray-900">{t.activePremium}</span>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 px-4 py-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <p className="text-gray-700 font-medium">{t.fullAccess}</p>
                    </div>
                  ) : profile.subscription?.ended && profile.subscription.ended.length > 0 ? (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2">
                              {t.currentPlan}
                            </p>
                            <div className="flex items-center gap-3">
                              <AlertCircle className="w-6 h-6 text-red-500" />
                              <span className="text-2xl font-bold text-gray-900">{t.expired}</span>
                            </div>
                          </div>
                          <Badge variant="destructive" className="px-4 py-1">
                            {t.expired}
                          </Badge>
                        </div>
                        <p className="text-gray-700 font-medium mb-6">{t.limitedAccess}</p>
                        <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
                          <Crown className="w-5 h-5 mr-2" />
                          {t.renewSubscription}
                        </Button>
                      </div>
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
                      <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
                        <Crown className="w-5 h-5 mr-2" />
                        Upgrade to Premium
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

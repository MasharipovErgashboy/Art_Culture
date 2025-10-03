"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { User, Mail, Edit3, Save, X, AlertCircle, CheckCircle, Shield, Calendar, Crown, Star } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

interface UserProfile {
  email: string
  username: string
  subscription: string
}

const translations = {
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

export default function ProfilePage({ params }: { params: { lang: string } }) {
  const lang = params.lang || "uz"
  const t = translations[lang as keyof typeof translations] || translations.uz

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

        const response = await fetch("https://artculture.pythonanywhere.com/auth/me/", {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRFTOKEN": localStorage.getItem("csrf_token") || "",
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            setError(t.sessionExpired)
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
          } else {
            setError(`${t.failedToFetch}: ${response.status}`)
          }
          return
        }

        const data = await response.json()
        setProfile(data)
        setEditedProfile(data)
      } catch (err) {
        console.error("Profile fetch error:", err)
        setError(t.networkError)
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

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription?.toLowerCase()) {
      case "active":
        return (
          <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
            <Crown className="w-3 h-3 mr-1" />
            {t.activePremium}
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
            <Calendar className="w-3 h-3 mr-1" />
            {t.pendingActivation}
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            {t.expired}
          </Badge>
        )
      default:
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 md:h-10 bg-gray-200 rounded-lg w-1/3 mb-6 md:mb-8"></div>
                <Card className="shadow-xl border-0">
                  <CardHeader className="pb-6 md:pb-8">
                    <div className="flex items-center space-x-4 md:space-x-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full"></div>
                      <div className="space-y-3">
                        <div className="h-6 md:h-7 bg-gray-200 rounded w-32 md:w-40"></div>
                        <div className="h-4 md:h-5 bg-gray-200 rounded w-24 md:w-32"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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

  if (error) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <Alert variant="destructive" className="shadow-lg border-red-200 bg-red-50">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
              </Alert>
            </div>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <Alert className="shadow-lg border-blue-200 bg-blue-50">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-800">{t.noProfileData}</AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
        <Footer />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t.myProfile}</h1>
                <p className="text-gray-600 text-base md:text-lg">{t.manageAccount}</p>
              </div>
              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-gray-50 border-gray-300 shadow-sm w-full sm:w-auto"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {t.editProfile}
                </Button>
              )}
            </div>

            {saveMessage && (
              <Alert className="mb-6 md:mb-8 border-emerald-200 bg-emerald-50 shadow-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <AlertDescription className="text-emerald-800 font-medium">{saveMessage}</AlertDescription>
              </Alert>
            )}

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6 md:pb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-white shadow-lg mx-auto sm:mx-0">
                    <AvatarImage src="/diverse-user-avatars.png" />
                    <AvatarFallback className="bg-white text-blue-600 text-xl md:text-2xl font-bold">
                      {profile.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 text-center sm:text-left">
                    <CardTitle className="text-xl md:text-2xl font-bold text-white">{profile.username}</CardTitle>
                    <CardDescription className="flex items-center justify-center sm:justify-start gap-2 text-blue-100">
                      <Mail className="w-4 h-4" />
                      <span className="break-all">{profile.email}</span>
                    </CardDescription>
                    <div className="pt-2 flex justify-center sm:justify-start">
                      {getSubscriptionBadge(profile.subscription)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 md:p-8 space-y-6 md:space-y-8">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">{t.personalInfo}</h3>
                  </div>

                  <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                        {t.username}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="username"
                          value={editedProfile?.username || ""}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 font-medium break-all">
                          {profile.username}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        {t.emailAddress}
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile?.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 font-medium break-all">
                          {profile.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">{t.subscriptionStatus}</h3>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">{t.currentPlan}</p>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                          {getSubscriptionBadge(profile.subscription)}
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-600">
                            {profile.subscription?.toLowerCase() === "active"
                              ? t.fullAccess
                              : profile.subscription?.toLowerCase() === "pending"
                                ? t.activationInProgress
                                : t.limitedAccess}
                          </span>
                        </div>
                      </div>
                    </div>

                    {profile.subscription?.toLowerCase() === "expired" && (
                      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                          <Crown className="w-4 h-4 mr-2" />
                          {t.renewSubscription}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <>
                    <Separator className="bg-gray-200" />
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                        size="lg"
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
                        className="flex-1 bg-white hover:bg-gray-50 border-gray-300 shadow-sm"
                        size="lg"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t.cancel}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </ProtectedRoute>
  )
}

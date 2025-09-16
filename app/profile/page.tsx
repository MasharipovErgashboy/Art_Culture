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

interface UserProfile {
  email: string
  username: string
  subscription: string
}

export default function ProfilePage() {
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

        // Get token from localStorage
        const token = localStorage.getItem("access_token")
        if (!token) {
          setError("Authentication token not found. Please login again.")
          return
        }

        console.log("[v0] Fetching profile with token:", token.substring(0, 20) + "...")

        const response = await fetch("http://127.0.0.1:8000/auth/me/", {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRFTOKEN": localStorage.getItem("csrf_token") || "",
          },
        })

        console.log("[v0] Profile API response status:", response.status)

        if (!response.ok) {
          if (response.status === 401) {
            setError("Session expired. Please login again.")
            // Clear invalid tokens
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
          } else {
            setError(`Failed to fetch profile: ${response.status}`)
          }
          return
        }

        const data = await response.json()
        console.log("[v0] Profile data received:", data)

        setProfile(data)
        setEditedProfile(data)
      } catch (err) {
        console.error("[v0] Profile fetch error:", err)
        setError("Network error. Please check your connection.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

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
        setError("Authentication token not found. Please login again.")
        return
      }

      // Note: This would typically be a PUT/PATCH request to update profile
      // For now, we'll simulate a successful save
      console.log("[v0] Saving profile changes:", editedProfile)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProfile(editedProfile)
      setIsEditing(false)
      setSaveMessage("Profile updated successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err) {
      console.error("[v0] Profile save error:", err)
      setError("Failed to save profile changes.")
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
            Active Premium
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
            <Calendar className="w-3 h-3 mr-1" />
            Pending Activation
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-gray-300 text-gray-600">
            <Star className="w-3 h-3 mr-1" />
            Free Plan
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-8"></div>
                <Card className="shadow-xl border-0">
                  <CardHeader className="pb-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                      <div className="space-y-3">
                        <div className="h-7 bg-gray-200 rounded w-40"></div>
                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <Alert variant="destructive" className="shadow-lg border-red-200 bg-red-50">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <Alert className="shadow-lg border-blue-200 bg-blue-50">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-800">No profile data available.</AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600 text-lg">Manage your account settings and preferences</p>
              </div>
              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-gray-50 border-gray-300 shadow-sm"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            {saveMessage && (
              <Alert className="mb-8 border-emerald-200 bg-emerald-50 shadow-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <AlertDescription className="text-emerald-800 font-medium">{saveMessage}</AlertDescription>
              </Alert>
            )}

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                    <AvatarImage src="/diverse-user-avatars.png" />
                    <AvatarFallback className="bg-white text-blue-600 text-2xl font-bold">
                      {profile.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-white">{profile.username}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-blue-100">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </CardDescription>
                    <div className="pt-2">{getSubscriptionBadge(profile.subscription)}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                        Username
                      </Label>
                      {isEditing ? (
                        <Input
                          id="username"
                          value={editedProfile?.username || ""}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 font-medium">
                          {profile.username}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
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
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 font-medium">
                          {profile.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Shield className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Subscription Status</h3>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Current Plan</p>
                        <div className="flex items-center gap-3">
                          {getSubscriptionBadge(profile.subscription)}
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-600">
                            {profile.subscription?.toLowerCase() === "active"
                              ? "Full access to all features"
                              : profile.subscription?.toLowerCase() === "pending"
                                ? "Activation in progress"
                                : "Limited access"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {profile.subscription?.toLowerCase() === "expired" && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                          <Crown className="w-4 h-4 mr-2" />
                          Renew Premium Subscription
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <>
                    <Separator className="bg-gray-200" />
                    <div className="flex gap-4 pt-6">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                        size="lg"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
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
                        Cancel
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
    </>
  )
}

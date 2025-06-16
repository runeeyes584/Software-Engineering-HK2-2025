"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Users, Shield, Palette, Bell, Save, RotateCcw, Plus, Trash2 } from "lucide-react"

interface UserRole {
  id: string
  name: string
  permissions: string[]
  color: string
  isDefault?: boolean
}

export default function SettingsPage() {
  const { t } = useLanguage()

  // General Settings
  const [siteName, setSiteName] = useState("TravelVista")
  const [siteDescription, setSiteDescription] = useState("Your Ultimate Travel Companion")
  const [adminEmail, setAdminEmail] = useState("admin@travelvista.com")
  const [timezone, setTimezone] = useState("UTC")
  const [defaultLanguage, setDefaultLanguage] = useState("en")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // User Settings
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [emailVerification, setEmailVerification] = useState(true)
  const [defaultRole, setDefaultRole] = useState("user")
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5)

  // User Roles
  const [userRoles, setUserRoles] = useState<UserRole[]>([
    {
      id: "admin",
      name: "Administrator",
      permissions: ["all"],
      color: "red",
      isDefault: true,
    },
    {
      id: "manager",
      name: "Manager",
      permissions: ["tours", "bookings", "users"],
      color: "blue",
    },
    {
      id: "user",
      name: "User",
      permissions: ["booking"],
      color: "green",
      isDefault: true,
    },
  ])
  const [newRoleName, setNewRoleName] = useState("")

  // Content Moderation
  const [autoModeration, setAutoModeration] = useState(true)
  const [requireApproval, setRequireApproval] = useState(false)
  const [reviewModeration, setReviewModeration] = useState(true)
  const [commentModeration, setCommentModeration] = useState(false)
  const [bannedWords, setBannedWords] = useState("spam, inappropriate, offensive")

  // Display Settings
  const [theme, setTheme] = useState("system")
  const [primaryColor, setPrimaryColor] = useState("blue")
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [showAvatars, setShowAvatars] = useState(true)
  const [compactMode, setCompactMode] = useState(false)

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [newBookingAlert, setNewBookingAlert] = useState(true)
  const [newUserAlert, setNewUserAlert] = useState(false)
  const [systemAlerts, setSystemAlerts] = useState(true)

  const handleSaveSettings = () => {
    // Simulate saving settings
    console.log("Settings saved!")
  }

  const handleResetSettings = () => {
    // Reset to default values
    setSiteName("TravelVista")
    setSiteDescription("Your Ultimate Travel Companion")
    setMaintenanceMode(false)
    // ... reset other settings
  }

  const addNewRole = () => {
    if (!newRoleName.trim()) return

    const newRole: UserRole = {
      id: newRoleName.toLowerCase().replace(/\s+/g, "-"),
      name: newRoleName,
      permissions: [],
      color: "purple",
    }

    setUserRoles([...userRoles, newRole])
    setNewRoleName("")
  }

  const deleteRole = (roleId: string) => {
    setUserRoles(userRoles.filter((role) => role.id !== roleId))
  }

  const getRoleColor = (color: string) => {
    const colors = {
      red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cài đặt hệ thống</h1>
      <div className="bg-white p-6 rounded shadow">
        <p className="mb-2">Cấu hình chung, phân quyền, quản lý admin...</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Lưu thay đổi</button>
      </div>
    </div>
  )
}

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("admin.settings.title")}</h1>
            <p className="text-slate-600 dark:text-slate-400">{t("admin.settings.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>{t("admin.settings.general")}</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{t("admin.settings.users")}</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>{t("admin.settings.moderation")}</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>{t("admin.settings.display")}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>{t("admin.settings.notifications")}</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.settings.generalSettings")}</CardTitle>
              <CardDescription>{t("admin.settings.generalDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">{t("admin.settings.siteName")}</Label>
                  <Input
                    id="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="TravelVista"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">{t("admin.settings.adminEmail")}</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@travelvista.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">{t("admin.settings.siteDescription")}</Label>
                <Textarea
                  id="siteDescription"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="Your Ultimate Travel Companion"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">{t("admin.settings.timezone")}</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      <SelectItem value="Asia/Ho_Chi_Minh">Ho Chi Minh City</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">{t("admin.settings.defaultLanguage")}</Label>
                  <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.maintenanceMode")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("admin.settings.maintenanceDescription")}
                  </p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="users">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.settings.userSettings")}</CardTitle>
                <CardDescription>{t("admin.settings.userDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t("admin.settings.allowRegistration")}</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("admin.settings.allowRegistrationDesc")}
                    </p>
                  </div>
                  <Switch checked={allowRegistration} onCheckedChange={setAllowRegistration} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t("admin.settings.emailVerification")}</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t("admin.settings.emailVerificationDesc")}
                    </p>
                  </div>
                  <Switch checked={emailVerification} onCheckedChange={setEmailVerification} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultRole">{t("admin.settings.defaultRole")}</Label>
                    <Select value={defaultRole} onValueChange={setDefaultRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {userRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      {t("admin.settings.sessionTimeout")} ({t("admin.settings.minutes")})
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(Number(e.target.value))}
                      min="5"
                      max="1440"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">{t("admin.settings.maxLoginAttempts")}</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={maxLoginAttempts}
                      onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Roles */}
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.settings.userRoles")}</CardTitle>
                <CardDescription>{t("admin.settings.userRolesDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder={t("admin.settings.roleName")}
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addNewRole} disabled={!newRoleName.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("admin.settings.addNewRole")}
                  </Button>
                </div>

                <div className="space-y-2">
                  {userRoles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getRoleColor(role.color)}>{role.name}</Badge>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {role.permissions.join(", ")}
                        </span>
                      </div>
                      {!role.isDefault && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRole(role.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Moderation */}
        <TabsContent value="moderation">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.settings.contentModeration")}</CardTitle>
              <CardDescription>{t("admin.settings.moderationDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.autoModeration")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t("admin.settings.autoModerationDesc")}</p>
                </div>
                <Switch checked={autoModeration} onCheckedChange={setAutoModeration} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.requireApproval")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("admin.settings.requireApprovalDesc")}
                  </p>
                </div>
                <Switch checked={requireApproval} onCheckedChange={setRequireApproval} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.reviewModeration")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("admin.settings.reviewModerationDesc")}
                  </p>
                </div>
                <Switch checked={reviewModeration} onCheckedChange={setReviewModeration} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.commentModeration")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("admin.settings.commentModerationDesc")}
                  </p>
                </div>
                <Switch checked={commentModeration} onCheckedChange={setCommentModeration} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="bannedWords">{t("admin.settings.bannedWords")}</Label>
                <Textarea
                  id="bannedWords"
                  value={bannedWords}
                  onChange={(e) => setBannedWords(e.target.value)}
                  placeholder={t("admin.settings.bannedWordsPlaceholder")}
                  rows={3}
                />
                <p className="text-sm text-slate-600 dark:text-slate-400">{t("admin.settings.bannedWordsDesc")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.settings.displaySettings")}</CardTitle>
              <CardDescription>{t("admin.settings.displayDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">{t("admin.settings.theme")}</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t("admin.settings.lightTheme")}</SelectItem>
                      <SelectItem value="dark">{t("admin.settings.darkTheme")}</SelectItem>
                      <SelectItem value="system">{t("admin.settings.systemTheme")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">{t("admin.settings.primaryColor")}</Label>
                  <Select value={primaryColor} onValueChange={setPrimaryColor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">{t("admin.settings.blue")}</SelectItem>
                      <SelectItem value="green">{t("admin.settings.green")}</SelectItem>
                      <SelectItem value="purple">{t("admin.settings.purple")}</SelectItem>
                      <SelectItem value="red">{t("admin.settings.red")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemsPerPage">{t("admin.settings.itemsPerPage")}</Label>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.showAvatars")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t("admin.settings.showAvatarsDesc")}</p>
                </div>
                <Switch checked={showAvatars} onCheckedChange={setShowAvatars} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.compactMode")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t("admin.settings.compactModeDesc")}</p>
                </div>
                <Switch checked={compactMode} onCheckedChange={setCompactMode} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.settings.notificationSettings")}</CardTitle>
              <CardDescription>{t("admin.settings.notificationDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.emailNotifications")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("admin.settings.emailNotificationsDesc")}
                  </p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.pushNotifications")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("admin.settings.pushNotificationsDesc")}
                  </p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.newBookingAlert")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t("admin.settings.newBookingAlertDesc")}
                  </p>
                </div>
                <Switch checked={newBookingAlert} onCheckedChange={setNewBookingAlert} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.newUserAlert")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t("admin.settings.newUserAlertDesc")}</p>
                </div>
                <Switch checked={newUserAlert} onCheckedChange={setNewUserAlert} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("admin.settings.systemAlerts")}</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t("admin.settings.systemAlertsDesc")}</p>
                </div>
                <Switch checked={systemAlerts} onCheckedChange={setSystemAlerts} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" onClick={handleResetSettings}>
          <RotateCcw className="h-4 w-4 mr-2" />
          {t("admin.settings.reset")}
        </Button>
        <Button
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {t("admin.settings.save")}
        </Button>
      </div>
    </div>
  )
}

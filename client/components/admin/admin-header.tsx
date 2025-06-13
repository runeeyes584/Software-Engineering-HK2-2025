"use client"

import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider-fixed"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Globe, Moon, Sun, LogOut, User, Search, Plus, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function AdminHeader() {
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Search */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("common.search")}
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600"
              />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Quick Actions */}
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Plus className="h-4 w-4 mr-2" />
              {t("admin.actions.addTour")}
            </Button>

            <Link href="/">
              <Button variant="ghost" size="icon" className="relative">
                <Home className="h-5 w-5" />
              </Button>
            </Link>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-lg">{t("admin.notifications.title")}</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t("admin.notifications.newBooking")}</p>
                        <p className="text-xs text-muted-foreground">Nguyễn Văn A - Hạ Long Bay Tour</p>
                        <p className="text-xs text-muted-foreground">2 {t("common.minutesAgo")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t("admin.notifications.newReview")}</p>
                        <p className="text-xs text-muted-foreground">5-star review for Sapa Trekking</p>
                        <p className="text-xs text-muted-foreground">1 {t("common.hourAgo")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t("admin.notifications.systemUpdate")}</p>
                        <p className="text-xs text-muted-foreground">New features available</p>
                        <p className="text-xs text-muted-foreground">3 {t("common.hoursAgo")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-muted" : ""}>
                  <span className="mr-2">🇺🇸</span> English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("vi")} className={language === "vi" ? "bg-muted" : ""}>
                  <span className="mr-2">🇻🇳</span> Tiếng Việt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  {t("theme.light")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  {t("theme.dark")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <span className="mr-2">💻</span>
                  {t("theme.system")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {user?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 m-1 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {user?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[180px] truncate text-sm text-muted-foreground">{user?.email}</p>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {user?.role === "admin" ? "Administrator" : "User"}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  {t("admin.profile")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("auth.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

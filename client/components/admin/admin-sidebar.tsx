"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MapPin,
  FileText,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  Calendar,
  Star,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const sidebarItems = [
  {
    title: "dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "tours",
    href: "/admin/tours",
    icon: MapPin,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "blogs",
    href: "/admin/blogs",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "chat",
    href: "/admin/chat",
    icon: MessageSquare,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    title: "users",
    href: "/admin/users",
    icon: Users,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    title: "bookings",
    href: "/admin/bookings",
    icon: Calendar,
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  {
    title: "reviews",
    href: "/admin/reviews",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    title: "payments",
    href: "/admin/payments",
    icon: CreditCard,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    title: "analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    title: "settings",
    href: "/admin/settings",
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
  },
]

export function AdminSidebar() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col relative",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TravelVista</h1>
                <p className="text-blue-100 text-sm">{t("admin.title")}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10 ml-auto"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? `${item.bgColor} ${item.color} shadow-md border border-current/20`
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white",
                  isCollapsed ? "justify-center" : "",
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "scale-110" : "group-hover:scale-105")} />
                {!isCollapsed && <span className="ml-4 font-medium text-sm">{t(`admin.nav.${item.title}`)}</span>}
                {isActive && !isCollapsed && <div className="ml-auto w-2 h-2 bg-current rounded-full opacity-60"></div>}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {t(`admin.nav.${item.title}`)}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">TravelVista Admin v2.0</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">© 2024 All rights reserved</p>
          </div>
        </div>
      )}
    </div>
  )
}

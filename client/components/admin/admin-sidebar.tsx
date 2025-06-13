"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
<<<<<<< HEAD
import { MapPin, FileText, MessageSquare, Users, Settings, BarChart3, Calendar, Star, CreditCard, LayoutDashboard } from "lucide-react"
=======
import { useLanguage } from "@/components/language-provider-fixed"
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
>>>>>>> 88e14c91d27da58ff1998bb65d5db7dcb76e3237

const sidebarItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Tours", href: "/admin/tours", icon: MapPin },
  { title: "Blogs", href: "/admin/blogs", icon: FileText },
  { title: "Chat", href: "/admin/chat", icon: MessageSquare },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Bookings", href: "/admin/bookings", icon: Calendar },
  { title: "Reviews", href: "/admin/reviews", icon: Star },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="h-screen w-20 md:w-64 bg-white dark:bg-gray-950 shadow-lg flex flex-col items-center py-6 px-2 md:px-4 border-r border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center w-full">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold mb-2">T</div>
        <span className="hidden md:block text-xl font-bold text-gray-800 dark:text-white tracking-wide">Admin</span>
      </div>
      {/* Nav */}
      <nav className="flex flex-col gap-2 w-full flex-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link href={item.href} key={item.href} className="group">
              <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                <item.icon className="w-7 h-7" />
                <span className="hidden md:inline text-base font-medium truncate">{item.title}</span>
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

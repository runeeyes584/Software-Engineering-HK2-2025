"use client"

import { Button } from "@/components/ui/button"
import { useClerk } from "@clerk/nextjs"
import {
    Calendar,
    ChevronLeft,
    DollarSign,
    LayoutDashboard,
    LayoutGrid,
    LogOut,
    Package,
    Users
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { title: "Quản lý tour", icon: Package, href: "/admin/tours" },
  { title: "Quản lý danh mục", icon: LayoutGrid, href: "/admin/categories" },
  { title: "Quản lý người dùng", icon: Users, href: "/admin/users" },
  { title: "Đặt chỗ", icon: Calendar, href: "/admin/bookings" },
  { title: "Doanh thu", icon: DollarSign, href: "/admin/revenue" },
]

interface AdminSidebarProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

export function AdminSidebar({ isSidebarOpen, setIsSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-card border-r transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
      } lg:w-64 lg:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b h-16">
          <Link href="/admin" className="text-xl font-bold text-primary">
            TravelVista
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} legacyBehavior passHref>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-start text-base"
                size="lg"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 text-base"
            size="lg"
            onClick={() => signOut({ redirectUrl: '/' })}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </aside>
  )
}

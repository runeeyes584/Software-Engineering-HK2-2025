import type React from "react"
import { Inter } from "next/font/google"
import AdminNavbar from "@/components/admin/admin-navbar"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminFooter from "@/components/admin/admin-footer"
import RealTimeChatbox from "@/components/admin/real-time-chatbox"

const inter = Inter({ subsets: ["latin"] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
      <AdminFooter />
      <RealTimeChatbox />
    </div>
  )
}

"use client"

import { useState } from "react"
import { AdminHeader } from './admin-header'
import { AdminSidebar } from './admin-sidebar'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 lg:pl-64">
        <AdminHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  )
} 
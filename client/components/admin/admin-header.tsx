"use client"

import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { NotificationListener } from '../notification-listener'

interface AdminHeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void
}

export function AdminHeader({ setIsSidebarOpen }: AdminHeaderProps) {
  return (
    <>
      <NotificationListener />
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </header>
    </>
  )
}

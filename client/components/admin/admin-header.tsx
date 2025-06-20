"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Menu, Search } from 'lucide-react'

interface AdminHeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void
}

export function AdminHeader({ setIsSidebarOpen }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm..."
          className="pl-10 w-full md:w-1/3 lg:w-1/3"
        />
      </div>
    </header>
  )
}

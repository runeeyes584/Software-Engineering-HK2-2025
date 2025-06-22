"use client"

import { AdminGuard } from "@/components/admin-guard"
import { AdminLayout } from "@/components/admin/layout"

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  )
}

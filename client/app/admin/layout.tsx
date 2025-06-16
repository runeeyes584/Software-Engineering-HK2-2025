import { Metadata } from "next"
import { AdminLayout } from "@/components/admin/layout"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Quản lý hệ thống tour du lịch",
}

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}

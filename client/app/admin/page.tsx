import { Metadata } from "next"
import { DashboardContent } from "@/components/admin/dashboard-content"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Quản lý hệ thống tour du lịch",
}

export default function AdminPage() {
  return <DashboardContent />
}

"use client"

import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PaymentSuccessPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const handleViewOrder = () => {
    // Cách 1: Dùng query param
    router.push("/account?tab=bookings")
    // Cách 2: Nếu trang account không đọc query, có thể dùng localStorage
    // localStorage.setItem("accountTab", "bookings");
    // router.push("/account")
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-emerald-50 to-white text-center px-4">
      <CheckCircle className="h-20 w-20 text-emerald-500 mb-6 animate-bounce" />
      <h1 className="text-4xl font-extrabold mb-3 text-emerald-700 drop-shadow">{t("orderSuccess.title")}</h1>
      <p className="mb-6 text-lg text-gray-700">{t("orderSuccess.message")}</p>
      <div className="flex gap-4 mb-8">
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleViewOrder}>
          {t("orderSuccess.viewOrder")}
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">{t("orderSuccess.goHome")}</Link>
        </Button>
      </div>
      <div className="text-sm text-gray-400">{t("orderSuccess.support")}</div>
    </div>
  )
} 
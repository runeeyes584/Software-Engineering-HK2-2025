"use client"

import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const gigId = searchParams.get("gig");
  const { t } = useLanguage()
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-red-50 to-white text-center px-4">
      <XCircle className="h-20 w-20 text-red-500 mb-6 animate-bounce" />
      <h1 className="text-4xl font-extrabold mb-3 text-red-700 drop-shadow">{t("orderFailed.title")}</h1>
      <p className="mb-6 text-lg text-gray-700">{t("orderFailed.message")}</p>
      <div className="flex gap-4 mb-8">
        <Button asChild size="lg" variant="outline">
          <Link href="/">{t("orderFailed.goHome")}</Link>
        </Button>
      </div>
      <div className="text-sm text-gray-400">{t("orderFailed.support")}</div>
    </div>
  )
} 
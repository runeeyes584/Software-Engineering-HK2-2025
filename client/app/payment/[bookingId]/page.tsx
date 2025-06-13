'use client'
import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const { getToken } = useAuth()
  const bookingId = params.bookingId as string

  useEffect(() => {
    const createPayment = async () => {
      if (!bookingId) return
      try {
        const token = await getToken()
        const res = await fetch("http://localhost:5000/api/payments/create-qr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ bookingId }),
        })
        const text = await res.text()
        if (!res.ok) throw new Error("Không tạo được link thanh toán")
        let data
        try { data = JSON.parse(text) } catch { data = text }
        if (data && data.paymentUrl) {
          window.location.href = data.paymentUrl
        } else if (data && data.data) {
          // vnpay lib có thể trả về { data: url }
          window.location.href = data.data
        } else if (typeof data === 'string' && data.startsWith('http')) {
          window.location.href = data
        } else {
          throw new Error("Không nhận được link thanh toán")
        }
      } catch (err) {
        alert("Không tạo được link thanh toán!")
        router.push("/account")
      }
    }
    createPayment()
  }, [bookingId, router, getToken])

  if (!bookingId) return <div>Không tìm thấy bookingId</div>
  return <div>Đang chuyển hướng đến cổng thanh toán...</div>
} 
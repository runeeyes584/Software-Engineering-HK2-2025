"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"

export default function BookingPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getToken } = useAuth()
  const { user } = useUser()

  const [formData, setFormData] = useState({
    note: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  // Lấy các trường từ query params
  const tourId = searchParams.get("tourId")
  const departureDate = searchParams.get("departureDate")
  const returnDate = searchParams.get("returnDate")
  const transportType = searchParams.get("transportType")
  const ticketClass = searchParams.get("ticketClass")
  const adults = searchParams.get("adults")
  const children = searchParams.get("children")
  const infants = searchParams.get("infants")

  // Tính guests và totalPrice (giống trang chi tiết tour)
  const guests = (adults ? parseInt(adults) : 0) + (children ? parseInt(children) : 0) + (infants ? parseInt(infants) : 0)
  // Lấy totalPrice từ query params
  const totalPrice = Number(searchParams.get("totalPrice")) || 0

  // Kiểm tra các trường bắt buộc
  const isBookingReady = !!(user?.id && tourId && guests > 0 && totalPrice > 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isBookingReady) {
      alert("Thiếu thông tin bắt buộc: user, tour, số khách, tổng tiền!")
      return
    }
    setIsLoading(true)
    try {
      const token = await getToken()
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          user: user.id,
          tour: tourId,
          guests,
          totalPrice,
          note: formData.note,
          departureDate,
          returnDate,
          transportType,
          ticketClass,
          adults: adults ? parseInt(adults) : 0,
          children: children ? parseInt(children) : 0,
          infants: infants ? parseInt(infants) : 0,
        }),
      })
      if (!res.ok) throw new Error("Đặt tour thất bại")
      const data = await res.json()
      router.push(data.paymentUrl)
    } catch (error) {
      alert("Có lỗi khi đặt tour!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Đặt tour</h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 py-8">
            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea id="note" name="note" value={formData.note} onChange={handleChange} placeholder="Ghi chú thêm (nếu có)" />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isLoading || !isBookingReady}>
              {isLoading ? "Đang gửi..." : "Đặt tour"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function BookingPage() {
  const { t } = useLanguage()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    note: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Gửi dữ liệu booking đơn giản lên backend
      // await fetch(...)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Đặt tour thành công!")
      router.push("/")
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
              <Label htmlFor="firstName">Họ</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Tên</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea id="note" name="note" value={formData.note} onChange={handleChange} placeholder="Ghi chú thêm (nếu có)" />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isLoading}>
              {isLoading ? "Đang gửi..." : "Đặt tour"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

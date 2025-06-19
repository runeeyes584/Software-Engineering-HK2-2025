"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { User, Phone, Mail, StickyNote, Loader2 } from "lucide-react"

interface ModalBookingProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tourId: string
  departureDate: string
  returnDate?: string
  transportType: string
  ticketClass: string
  adults: number
  children: number
  infants: number
  totalPrice: number
}

export function ModalBooking({
  open,
  onOpenChange,
  tourId,
  departureDate,
  returnDate,
  transportType,
  ticketClass,
  adults,
  children,
  infants,
  totalPrice,
}: ModalBookingProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const { getToken } = useAuth()
  const { user } = useUser()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const guests = adults + children + infants
  const isBookingReady = !!(user?.id && tourId && guests > 0 && totalPrice > 0 && formData.name.trim() && formData.phone.trim())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isBookingReady) {
      setError("Vui lòng nhập đầy đủ họ tên và số điện thoại!")
      return
    }
    setError("")
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
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          note: formData.note,
          departureDate,
          returnDate,
          transportType,
          ticketClass,
          adults,
          children,
          infants,
        }),
      })
      if (!res.ok) throw new Error("Đặt tour thất bại")
      const data = await res.json()
      onOpenChange(false)
      router.push(data.paymentUrl)
    } catch (error) {
      setError("Có lỗi khi đặt tour!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle>{t("booking.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t("booking.name")} <span className="text-red-500">*</span></Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder={t("booking.namePlaceholder") || ""} required className="pl-10 rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("booking.phone")} <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder={t("booking.phonePlaceholder") || ""} required className="pl-10 rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("booking.email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input id="email" name="email" value={formData.email} onChange={handleChange} placeholder={t("booking.emailPlaceholder") || ""} type="email" className="pl-10 rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">{t("booking.note")}</Label>
            <div className="relative">
              <StickyNote className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
              <Textarea id="note" name="note" value={formData.note} onChange={handleChange} placeholder={t("booking.notePlaceholder") || ""} className="pl-10 pt-2 rounded-lg min-h-[70px]" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <Button type="submit" className="w-full h-12 text-lg font-bold rounded-lg bg-primary hover:bg-primary/90 transition flex items-center justify-center gap-2" disabled={isLoading || !isBookingReady}>
            {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
            {isLoading ? t("booking.submitting") : t("booking.submit")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus("idle")

    try {
      const response = await fetch('https://formspree.io/f/xvgrlalr', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        })
      })

      if (response.ok) {
        setStatus("success")
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">{t("nav.contact")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">{t("contact.getInTouch")}</h2>
              
              {/* Success Message */}
              {status === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 font-medium">{t("contact.form.success")}</p>
                </div>
              )}

              {/* Error Message */}
              {status === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 font-medium">{t("contact.form.error")}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("contact.name")}</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.email")}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{t("contact.subject")}</Label>
                  <Select value={formData.subject} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("contact.selectSubject")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">{t("contact.subjects.general")}</SelectItem>
                      <SelectItem value="booking">{t("contact.subjects.booking")}</SelectItem>
                      <SelectItem value="support">{t("contact.subjects.support")}</SelectItem>
                      <SelectItem value="feedback">{t("contact.subjects.feedback")}</SelectItem>
                      <SelectItem value="partnership">{t("contact.subjects.partnership")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t("contact.message")}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t("contact.sending") : t("contact.send")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">{t("contact.contactInfo")}</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium">{t("contact.email")}</h3>
                    <p className="text-sm text-muted-foreground">anhtienle428@gmail.com</p>
                    <p className="text-sm text-muted-foreground">anhtienle428@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium">{t("contact.phone")}</h3>
                    <p className="text-sm text-muted-foreground">+84 (0) 971825026</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 453-14584</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium">{t("contact.headquarters")}</h3>
                    <p className="text-sm text-muted-foreground">
                      123 Mac Dinh Chi Street
                      <br />
                      Linh Trung Ward
                      <br />
                      Thu Duc city, Vietnam
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">{t("contact.officeHours")}</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("contact.weekdays")}</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("contact.saturday")}</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("contact.sunday")}</span>
                  <span>{t("contact.closed")}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">{t("contact.timeZoneNote")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">{t("contact.faq.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: t("contact.faq.q1"),
              answer: t("contact.faq.a1"),
            },
            {
              question: t("contact.faq.q2"),
              answer: t("contact.faq.a2"),
            },
            {
              question: t("contact.faq.q3"),
              answer: t("contact.faq.a3"),
            },
            {
              question: t("contact.faq.q4"),
              answer: t("contact.faq.a4"),
            },
          ].map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

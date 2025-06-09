"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch("https://localhost:7129/api/users/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Email: email }),
    })

    if (response.ok) {
      setIsSubmitted(true)
    } else {
      alert("Đã có lỗi xảy ra. Vui lòng thử lại.")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu
        </CardDescription>
      </CardHeader>

      {isSubmitted ? (
        <CardContent>
          <Alert className="bg-primary/10 border-primary">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertTitle>Liên kết đã được gửi</AlertTitle>
            <AlertDescription>
              Chúng tôi đã gửi một liên kết thay đổi mật khẩu đến email {email}. Hãy kiểm tra hộp thư đến của bạn.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Link href="/auth/login" className="text-primary hover:underline">
              Quay lại trang đăng nhập
            </Link>
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Gửi liên kết thay đổi mật khẩu
            </Button>
            <div className="text-center text-sm">
              <Link href="/auth/login" className="text-primary hover:underline">
                Quay lại trang đăng nhập
              </Link>
            </div>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}

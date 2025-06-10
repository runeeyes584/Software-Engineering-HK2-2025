"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const { t } = useLanguage()
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const success = await login(formData.email, formData.password)

      if (success) {
        // Check if user is admin and redirect accordingly
        if (formData.email === "admin@travelvista.com") {
          router.push("/admin")
        } else {
          router.push("/account")
        }
      } else {
        setError(t("login.error.invalidCredentials"))
      }
    } catch (error) {
      console.error("Login failed:", error)
      setError(t("login.error.general"))
    }
  }

  const handleDemoLogin = async (type: "admin" | "user") => {
    setError("")

    const credentials =
      type === "admin"
        ? { email: "admin@travelvista.com", password: "admin123" }
        : { email: "user@example.com", password: "user123" }

    try {
      const success = await login(credentials.email, credentials.password)

      if (success) {
        router.push(type === "admin" ? "/admin" : "/account")
      }
    } catch (error) {
      console.error("Demo login failed:", error)
      setError(t("login.error.general"))
    }
  }

  return (
    <div className="container py-10 md:py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("auth.login")}</CardTitle>
          <CardDescription>{t("login.description")}</CardDescription>
        </CardHeader>

        {error && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("login.password")}</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  {t("login.forgotPassword")}
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="remember" className="text-sm">
                {t("login.rememberMe")}
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("login.loggingIn") : t("auth.login")}
            </Button>

            <div className="w-full">
              <Separator className="my-4" />
              <p className="text-center text-sm text-muted-foreground mb-4">{t("login.demoAccounts")}</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {t("login.adminDemo")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDemoLogin("user")}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {t("login.userDemo")}
                </Button>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t("login.noAccount")}{" "}
              <Link href="/register" className="text-primary hover:underline">
                {t("auth.register")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth, useUser } from "@clerk/nextjs"
import { AlertTriangle, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user?.id) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const token = await getToken()
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          const userRole = data.user?.role
          setIsAdmin(userRole === "admin")
          
          // Auto redirect non-admin users away from admin pages
          if (userRole !== "admin") {
            router.push("/")
          }
        } else {
          setIsAdmin(false)
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking admin role:", error)
        setIsAdmin(false)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkAdminRole()
  }, [user?.id, getToken, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Kiểm tra quyền truy cập
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Truy cập bị từ chối
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập với tài khoản admin.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
} 
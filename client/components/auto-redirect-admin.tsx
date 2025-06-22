"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function AutoRedirectAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Chỉ kiểm tra khi ở trang chủ và chưa kiểm tra
      if (pathname !== "/" || checked || !user?.id) {
        setChecked(true)
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
          
          // Tự động chuyển hướng admin đến trang admin
          if (userRole === "admin") {
            router.push("/admin")
            return
          }
        }
      } catch (error) {
        console.error("Error checking user role for auto-redirect:", error)
      } finally {
        setChecked(true)
      }
    }

    checkAndRedirect()
  }, [user?.id, pathname, getToken, router, checked])

  return <>{children}</>
} 
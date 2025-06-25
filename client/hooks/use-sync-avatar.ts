"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export function useSyncAvatar() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [syncing, setSyncing] = useState(false)
  const syncAvatarToDatabase = async () => {
    if (!user?.id || !user?.imageUrl) return

    setSyncing(true)
    try {
      // Trước tiên, kiểm tra xem API có đang hoạt động không
      try {
        const healthCheck = await fetch("http://localhost:5000/api/users", { 
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        if (!healthCheck.ok) {
          // Nếu API không hoạt động, chỉ bỏ qua việc đồng bộ mà không hiển thị lỗi
          setSyncing(false)
          return
        }
      } catch (err) {
        // API không hoạt động, bỏ qua đồng bộ một cách im lặng
        setSyncing(false)
        return
      }
      
      const token = await getToken()
      const res = await fetch("http://localhost:5000/api/users/update-avatar", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatar: user.imageUrl,
        }),
      })

      if (!res.ok) {
        // Lỗi nhưng không hiển thị ra console để tránh làm phiền người dùng
      }
    } catch (error) {
      // Lỗi nhưng không hiển thị ra console để tránh làm phiền người dùng
    } finally {
      setSyncing(false)
    }
  }

  // Auto sync when user imageUrl changes
  useEffect(() => {
    if (user?.imageUrl) {
      syncAvatarToDatabase()
    }
  }, [user?.imageUrl])

  return { syncAvatarToDatabase, syncing }
} 
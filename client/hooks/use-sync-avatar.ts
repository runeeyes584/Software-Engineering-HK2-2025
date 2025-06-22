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
        console.error("Failed to sync avatar to database")
      }
    } catch (error) {
      console.error("Error syncing avatar:", error)
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
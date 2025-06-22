"use client"

import { useAuth } from "@clerk/nextjs"
import useSWR from "swr"

const fetcher = async ([url, token]: [string, string | null]) => {
  if (!token) {
    throw new Error("Not authorized")
  }

  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.")
    error.info = await res.json()
    error.status = res.status
    throw error
  }

  const data = await res.json()
  return data.user?.role === "admin"
}

export function useAdminRole() {
  const { getToken, userId } = useAuth()
  
  // The key will include the userId. If userId is null, SWR will not fetch.
  // When userId becomes available, SWR will trigger the fetch.
  const key = userId ? ["http://localhost:5000/api/users/profile", userId] : null

  const { data: isAdmin, error } = useSWR(
    key,
    async ([url]) => {
      const token = await getToken()
      return fetcher([url, token])
    },
    {
      // Optional: Fine-tune SWR behavior
      shouldRetryOnError: false,
      revalidateOnFocus: true, // Re-check when the user focuses the window
    }
  )

  const loading = !isAdmin && !error && !!userId

  return { isAdmin: !!isAdmin, loading }
} 
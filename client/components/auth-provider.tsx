"use client"

import { useSyncAvatar } from "@/hooks/use-sync-avatar"
import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  loginAsDemo: (role: "admin" | "user") => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo
const mockUsers = {
  admin: {
    id: "admin-1",
    name: "Admin User",
    email: "admin@travelvista.com",
    role: "admin" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  user: {
    id: "user-1",
    name: "John Doe",
    email: "user@example.com",
    role: "user" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user: clerkUser, isSignedIn } = useUser()
  const { getToken } = useClerkAuth()
  
  // Auto sync avatar from Clerk to database
  useSyncAvatar()

  useEffect(() => {
    const checkUserFromDatabase = async () => {
      if (!isSignedIn || !clerkUser?.id) {
        setIsLoading(false)
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
          const dbUser = data.user
          
          if (dbUser) {
            const userData: User = {
              id: dbUser._id,
              name: dbUser.username || `${dbUser.firstname || ''} ${dbUser.lastname || ''}`.trim(),
              email: dbUser.email,
              role: dbUser.role,
              avatar: dbUser.avatar,
            }
            setUser(userData)
            
            // Auto redirect admin to admin page if on home page
            if (dbUser.role === "admin" && window.location.pathname === "/") {
              router.push("/admin")
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user from database:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserFromDatabase()
  }, [isSignedIn, clerkUser?.id, getToken, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "admin@travelvista.com" && password === "admin123") {
      const adminUser = mockUsers.admin
      setUser(adminUser)
      localStorage.setItem("user", JSON.stringify(adminUser))
      setIsLoading(false)
      
      // Auto redirect admin to admin page
      router.push("/admin")
      return true
    } else if (email === "user@example.com" && password === "user123") {
      const regularUser = mockUsers.user
      setUser(regularUser)
      localStorage.setItem("user", JSON.stringify(regularUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const loginAsDemo = (role: "admin" | "user") => {
    const demoUser = mockUsers[role]
    setUser(demoUser)
    localStorage.setItem("user", JSON.stringify(demoUser))
    
    // Auto redirect admin to admin page
    if (role === "admin") {
      router.push("/admin")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, loginAsDemo }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

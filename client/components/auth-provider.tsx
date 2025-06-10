"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "admin@travelvista.com" && password === "admin123") {
      const adminUser = mockUsers.admin
      setUser(adminUser)
      localStorage.setItem("user", JSON.stringify(adminUser))
      setIsLoading(false)
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
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
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

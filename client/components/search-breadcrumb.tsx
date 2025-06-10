"use client"

import { useSearchParams } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

export default function SearchBreadcrumb() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")
  const category = searchParams.get("category")
  const location = searchParams.get("location")

  const breadcrumbItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/search" },
  ]

  if (category) {
    breadcrumbItems.push({ label: category, href: `/search?category=${category}` })
  }

  if (location) {
    breadcrumbItems.push({ label: location, href: `/search?location=${location}` })
  }

  if (query) {
    breadcrumbItems.push({ label: `"${query}"`, href: `/search?q=${query}` })
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          <Link
            href={item.href}
            className={`flex items-center hover:text-foreground transition-colors ${
              index === breadcrumbItems.length - 1 ? "text-foreground font-medium" : ""
            }`}
          >
            {item.icon && <item.icon className="h-4 w-4 mr-1" />}
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}

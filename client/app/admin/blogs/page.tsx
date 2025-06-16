"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  User,
  Calendar,
  MessageCircle,
  TrendingUp,
} from "lucide-react"

export default function BlogsPage() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const blogs = [
    {
      id: "B-001",
      title: "Top 10 Hidden Gems in Vietnam",
      author: "Sarah Johnson",
      category: "Travel Tips",
      status: "published",
      views: 2847,
      comments: 23,
      published: "2024-01-10",
      featured: true,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "B-002",
      title: "Best Time to Visit Southeast Asia",
      author: "David Chen",
      category: "Travel Guide",
      status: "published",
      views: 1923,
      comments: 15,
      published: "2024-01-08",
      featured: false,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "B-003",
      title: "Local Cuisine You Must Try in Thailand",
      author: "Maria Rodriguez",
      category: "Food & Culture",
      status: "draft",
      views: 0,
      comments: 0,
      published: "-",
      featured: false,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "B-004",
      title: "Budget Travel Tips for Backpackers",
      author: "James Wilson",
      category: "Travel Tips",
      status: "published",
      views: 3421,
      comments: 31,
      published: "2024-01-05",
      featured: true,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "B-005",
      title: "Photography Guide for Travel Enthusiasts",
      author: "Lisa Park",
      category: "Photography",
      status: "archived",
      views: 1567,
      comments: 12,
      published: "2023-12-28",
      featured: false,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("admin.blogs.status.published")}</Badge>
        )
      case "draft":
        return <Badge variant="secondary">{t("admin.blogs.status.draft")}</Badge>
      case "archived":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            {t("admin.blogs.status.archived")}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Quản lý Blog</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Tiêu đề</th>
            <th className="border px-4 py-2">Tác giả</th>
            <th className="border px-4 py-2">Ngày đăng</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Khám phá Đà Lạt</td>
            <td className="border px-4 py-2">Admin</td>
            <td className="border px-4 py-2">01/07/2024</td>
            <td className="border px-4 py-2">
              <button className="text-blue-600 mr-2">Sửa</button>
              <button className="text-red-600">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Thêm blog mới</button>
    </div>
  )
}

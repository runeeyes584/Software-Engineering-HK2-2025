"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
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

export default function AdminBlogs() {
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("admin.blogs.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">{t("admin.blogs.subtitle")}</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.blogs.addNew")}
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5 text-purple-600" />
            {t("admin.blogs.search.title")}
          </CardTitle>
          <CardDescription>{t("admin.blogs.search.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t("admin.blogs.search.placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              {t("admin.blogs.filter")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blogs List */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            {t("admin.blogs.list.title")}
          </CardTitle>
          <CardDescription>
            {t("admin.blogs.list.showing")} {filteredBlogs.length} {t("admin.blogs.list.results")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableHead className="font-semibold">{t("admin.blogs.table.title")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.blogs.table.author")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.blogs.table.category")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.blogs.table.status")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.blogs.table.views")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.blogs.table.comments")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.blogs.table.published")}</TableHead>
                  <TableHead className="font-semibold text-right">{t("admin.blogs.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.map((blog) => (
                  <TableRow key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={blog.image || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{blog.title}</p>
                            {blog.featured && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">
                                {t("admin.blogs.featured")}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {blog.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm">{blog.author}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {blog.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(blog.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="font-medium">{blog.views.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 text-green-600 mr-1" />
                        <span className="font-medium">{blog.comments}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {blog.published !== "-" ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm">{blog.published}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("admin.blogs.actions.view")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("admin.blogs.actions.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("admin.blogs.actions.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

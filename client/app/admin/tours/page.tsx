"use client"

import { useState, useEffect } from "react"
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
  MapPin,
  Star,
  Calendar,
  DollarSign,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminTours() {
  const { t } = useLanguage()
  const tt = (key: string, fallback: string) => t(key) === key ? fallback : t(key);
  const [searchTerm, setSearchTerm] = useState("")
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:5000/api/tours")
      .then((res) => res.json())
      .then((data) => {
        setTours(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        setError("Không thể tải danh sách tour.")
        setLoading(false)
      })
  }, [])

  const filteredTours = tours.filter(
    (tour) =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tour.category || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("admin.tours.status.active")}</Badge>
        )
      case "draft":
        return <Badge variant="secondary">{t("admin.tours.status.draft")}</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            {t("admin.tours.status.inactive")}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {tt("admin.tours.title", "Quản lý Tour")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">{tt("admin.tours.subtitle", "Danh sách, tìm kiếm và quản lý tour du lịch")}</p>
        </div>
        <Button
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-bold px-6 py-3 rounded-xl shadow-lg"
          onClick={() => router.push("/admin/tours/new")}
        >
          <Plus className="mr-2 h-5 w-5" />
          {tt("admin.tours.addNew", "Thêm tour mới")}
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-xl border-0 rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-t-2xl">
          <CardTitle className="flex items-center text-xl font-bold">
            <Search className="mr-2 h-6 w-6 text-green-600" />
            {tt("admin.tours.search.title", "Tìm kiếm tour")}
          </CardTitle>
          <CardDescription>{tt("admin.tours.search.description", "Tìm kiếm tour theo tên, loại, trạng thái...")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={tt("admin.tours.search.placeholder", "Nhập tên hoặc loại tour...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg"
              />
            </div>
            <Button variant="outline" className="flex items-center rounded-lg border-green-600 text-green-700 font-semibold hover:bg-green-50">
              <Filter className="mr-2 h-5 w-5" />
              {tt("admin.tours.filter", "Lọc")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tours List */}
      <Card className="shadow-2xl border-0 rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-2xl">
          <CardTitle className="flex items-center text-xl font-bold">
            <MapPin className="mr-2 h-6 w-6 text-blue-600" />
            {tt("admin.tours.list.title", "Danh sách tour")}
          </CardTitle>
          <CardDescription>
            {tt("admin.tours.list.showing", "Hiển thị")} {filteredTours.length} {tt("admin.tours.list.results", "kết quả")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-lg text-muted-foreground">Đang tải danh sách tour...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 font-semibold">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="font-bold text-base">{tt("admin.tours.table.name", "Tên tour")}</TableHead>
                    <TableHead className="font-bold text-base">{tt("admin.tours.table.category", "Loại tour")}</TableHead>
                    <TableHead className="font-bold text-base">{tt("admin.tours.table.price", "Giá")}</TableHead>
                    <TableHead className="font-bold text-base">{tt("admin.tours.table.duration", "Thời lượng")}</TableHead>
                    <TableHead className="font-bold text-base">{tt("admin.tours.table.status", "Trạng thái")}</TableHead>
                    <TableHead className="font-bold text-base">{tt("admin.tours.table.bookings", "Đặt chỗ")}</TableHead>
                    <TableHead className="font-bold text-base">{tt("admin.tours.table.rating", "Đánh giá")}</TableHead>
                    <TableHead className="font-bold text-base text-right">{tt("admin.tours.table.actions", "Thao tác")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTours.map((tour) => (
                    <TableRow key={tour.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors rounded-xl">
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <img
                            src={tour.image || "/placeholder.svg"}
                            alt={tour.name}
                            className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shadow"
                          />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{tour.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {tour.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-semibold px-3 py-1 rounded-full text-base">
                          {tour.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-green-600 font-bold text-lg flex items-center gap-1">
                          <DollarSign className="inline h-5 w-5" /> {tour.price}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-blue-600 font-semibold flex items-center gap-1">
                          <Calendar className="inline h-5 w-5" /> {tour.duration}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tour.status)}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-base">{tour.bookings}</span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 font-semibold text-base">
                          <Star className="h-5 w-5 text-yellow-500" /> {tour.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Eye className="h-4 w-4" /> {tt("admin.tours.actions.view", "Xem chi tiết")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Edit className="h-4 w-4" /> {tt("admin.tours.actions.edit", "Chỉnh sửa")}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                              <Trash2 className="h-4 w-4" /> {tt("admin.tours.actions.delete", "Xóa")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

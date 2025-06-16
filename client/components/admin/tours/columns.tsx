"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"

export type Tour = {
  id: string
  name: string
  category: string
  price: number
  duration: string
  status: "active" | "draft" | "inactive"
  bookings: number
  rating: number
  image: string
}

export const columns: ColumnDef<Tour>[] = [
  {
    accessorKey: "name",
    header: "Tên tour",
    cell: ({ row }) => {
      const tour = row.original
      return (
        <div className="flex items-center space-x-4">
          <img
            src={tour.image || "/placeholder.svg"}
            alt={tour.name}
            className="w-14 h-14 rounded-xl object-cover border border-gray-200"
          />
          <div>
            <p className="font-semibold text-gray-900">{tour.name}</p>
            <p className="text-sm text-gray-500">ID: {tour.id}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Loại tour",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="font-semibold px-3 py-1 rounded-full">
          {row.getValue("category")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price)
      return <span className="text-green-600 font-bold">{formatted}</span>
    },
  },
  {
    accessorKey: "duration",
    header: "Thời lượng",
    cell: ({ row }) => {
      return <span className="text-blue-600 font-semibold">{row.getValue("duration")}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      switch (status) {
        case "active":
          return (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Đang hoạt động
            </Badge>
          )
        case "draft":
          return <Badge variant="secondary">Bản nháp</Badge>
        case "inactive":
          return (
            <Badge variant="outline" className="text-red-600 border-red-200">
              Không hoạt động
            </Badge>
          )
        default:
          return <Badge variant="secondary">{status}</Badge>
      }
    },
  },
  {
    accessorKey: "bookings",
    header: "Đặt chỗ",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.getValue("bookings")}</span>
    },
  },
  {
    accessorKey: "rating",
    header: "Đánh giá",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="font-semibold">{row.getValue("rating")}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tour = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Edit className="h-4 w-4" /> Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-4 w-4" /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 
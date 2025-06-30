"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@clerk/nextjs"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export type Category = {
  _id: string
  name: string
  description: string
  tourCount: number
  status: "active" | "inactive"
}

function CellActions({ category, onDeleteCategory }: { category: Category, onDeleteCategory?: (id: string) => void }) {
  const router = useRouter()
  const { getToken } = useAuth()

  const handleDelete = async () => {
    try {
      const token = await getToken()
      await fetch(`http://localhost:5000/api/categories/${category._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Danh mục đã được xóa.")
      if (onDeleteCategory) onDeleteCategory(category._id)
    } catch (error) {
      toast.error("Không thể xóa danh mục.")
    }
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <Link href={`/admin/categories/${category._id}`}>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
          </Link>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const getCategoryColumns = (onDeleteCategory?: (id: string) => void): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: () => <div className="text-center">Tên danh mục</div>,
    cell: ({ row }) => (
      <div className="text-center font-semibold text-foreground">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center">Mô tả</div>,
    cell: ({ row }) => {
      const desc = row.getValue("description") as string
      return (
        <div className="text-center text-sm text-muted-foreground max-w-xs mx-auto truncate" title={desc} style={{ cursor: 'pointer' }}>
          {desc}
        </div>
      )
    },
  },
  {
    accessorKey: "tourCount",
    header: () => <div className="text-center pr-6">Số lượng tour</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium pr-6">{row.getValue("tourCount")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Trạng thái</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="text-center">
          <Badge
            className={
              status === "active"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "text-red-600 border-red-200 bg-red-50 hover:bg-red-50"
            }
          >
            {status === "active" ? "Đang hoạt động" : "Không hoạt động"}
          </Badge>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions category={row.original} onDeleteCategory={onDeleteCategory} />,
  },
] 
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@clerk/nextjs"
import { ColumnDef } from "@tanstack/react-table"
import { Ban, CheckCircle2, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

export interface Tour {
  id: string
  name: string
  destination: string
  description: string
  category: {
    _id: string;
    name: string;
  }[]
  price: number
  duration: number
  bookings?: number
  rating?: number
  images?: string[]
  videos?: string[]
  image?: string
  status?: 'active' | 'inactive'
  createdAt?: string
  departureOptions?: {
      departureDate: string;
      returnDate: string;
  }[];
  maxGuests?: number;
  availableSlots?: number;
}

interface ColumnsProps {
  onStatusChange: (id: string, currentStatus: 'active' | 'inactive' | undefined) => void;
  onDelete: (id: string) => void;
  onViewDetails: (tour: Tour) => void;
}

const ActionsCell = ({ tour, onStatusChange, onDelete, onViewDetails }: { tour: Tour, onStatusChange: ColumnsProps['onStatusChange'], onDelete: ColumnsProps['onDelete'], onViewDetails: ColumnsProps['onViewDetails'] }) => {
  const { getToken } = useAuth();

  const handleDelete = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/tours/${tour.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Xóa tour thất bại.");
      }

      toast.success("Đã xóa tour thành công.");
      onDelete(tour.id);

    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewDetails(tour)} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            <span>Xem chi tiết</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/tours/edit/${tour.id}`} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              <span>Chỉnh sửa</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusChange(tour.id, tour.status)} className="cursor-pointer">
            {tour.status === 'active' ? (
              <><Ban className="mr-2 h-4 w-4" /><span>Vô hiệu hóa</span></>
            ) : (
              <><CheckCircle2 className="mr-2 h-4 w-4" /><span>Kích hoạt</span></>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-100 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Xóa</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Tour "{tour.name}" sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const columns = ({ onStatusChange, onDelete, onViewDetails }: ColumnsProps): ColumnDef<Tour>[] => [
  {
    accessorKey: "name",
    header: "Tên tour",
    cell: ({ row }) => {
      const tour = row.original;
      const name = tour.name;
      const id = tour.id;
      const imageUrl = (tour.images && tour.images.length > 0) ? tour.images[0] : tour.image || "/placeholder.jpg";

      return (
        <div className="flex items-center gap-4">
          <Image
            src={imageUrl}
            alt={name}
            width={64}
            height={64}
            className="rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-semibold max-w-[350px] truncate block cursor-default">
                    {name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-xs text-muted-foreground">ID: {id}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ row }) => {
      const categories = row.original.category as any[];
      if (!categories || categories.length === 0) {
        return <span className="text-muted-foreground">Không có</span>;
      }
      return (
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <Badge key={cat._id} variant="outline" className="w-fit">
              {cat.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Giá</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <span className="text-green-600 font-bold text-center block">{formatted}</span>
    },
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-center">Thời lượng</div>,
    cell: ({ row }) => {
      const duration = row.getValue("duration");
      return <span className="text-blue-600 font-semibold text-center block">{`${duration} ngày`}</span>
    },
  },
  {
    accessorKey: "bookings",
    header: () => <div className="text-center">Đặt chỗ</div>,
    cell: ({ row }) => {
      const value = row.getValue("bookings")
      return <span className="font-semibold text-center block">{value === undefined || value === null || value === '' ? 0 : String(value)}</span>
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = status === 'active' ? 'default' : 'destructive';
      const text = status === 'active' ? 'Hoạt động' : 'Không hoạt động';

      return (
        <Badge variant={variant} className="capitalize">
          {text}
        </Badge>
      )
    },
  },
  {
    accessorKey: "rating",
    header: () => <div className="text-center">Đánh giá</div>,
    cell: ({ row }) => {
      let value = row.getValue("rating")
      if (value === undefined || value === null || value === "") value = 0
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="font-semibold">{String(value)}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tour = row.original
      return <ActionsCell tour={tour} onStatusChange={onStatusChange} onDelete={onDelete} onViewDetails={onViewDetails} />
    },
  },
] 
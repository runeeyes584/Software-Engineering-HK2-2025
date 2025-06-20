"use client"

import { PlusCircle, ListFilter, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { columns, Tour } from '@/components/admin/tours/columns'
import { DataTable } from '@/components/admin/tours/data-table'
import Link from 'next/link'

const sampleTours: Tour[] = [
  {
    id: 'TOUR001',
    name: 'Khám phá Vịnh Hạ Long',
    category: 'Biển',
    price: 2500000,
    duration: '2 ngày 1 đêm',
    status: 'active',
    bookings: 120,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1543862415-961d157a43f2?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'TOUR002',
    name: 'Chinh phục Fansipan',
    category: 'Leo núi',
    price: 3200000,
    duration: '3 ngày 2 đêm',
    status: 'active',
    bookings: 85,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1590664287413-53d99a9a0f78?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'TOUR003',
    name: 'Nghỉ dưỡng tại Phú Quốc',
    category: 'Biển',
    price: 4500000,
    duration: '4 ngày 3 đêm',
    status: 'inactive',
    bookings: 210,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1616767597590-584c833a69a2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'TOUR004',
    name: 'City tour Hà Nội',
    category: 'Thành phố',
    price: 1200000,
    duration: '1 ngày',
    status: 'draft',
    bookings: 350,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1596395984235-908a8a4f91be?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]

export default function ToursPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
          <TabsTrigger value="draft">Bản nháp</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Đã lưu trữ
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Lọc
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Lọc theo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Đang hoạt động
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Bản nháp</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Đã lưu trữ
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Xuất file
            </span>
          </Button>
          <Link href="/admin/tours/new">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Thêm tour
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Danh sách tour</CardTitle>
            <CardDescription>
              Quản lý tất cả các tour trong hệ thống của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={sampleTours} />
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Hiển thị <strong>1-10</strong> trên <strong>32</strong> sản phẩm
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

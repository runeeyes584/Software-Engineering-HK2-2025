"use client"

import { columns, Tour } from "@/components/admin/tours/columns"
import { DataTable } from "@/components/admin/tours/data-table"
import { TourDetailModal } from "@/components/admin/tours/TourDetailModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from "sonner"

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tours')
        const data = await res.json()
        setTours(data)
      } catch (error) {
        console.error('Failed to fetch tours', error)
        toast.error("Không thể tải danh sách tour.")
      } finally {
        setLoading(false)
      }
    }
    fetchTours()
  }, [])

  const handleStatusChange = async (tourId: string, currentStatus: 'active' | 'inactive' | undefined) => {
    if (!currentStatus) return;

    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    const originalTours = [...tours];
    const updatedTours = tours.map(t => 
      t.id === tourId ? { ...t, status: newStatus } : t
    ) as Tour[];
    setTours(updatedTours);

    try {
      const res = await fetch(`http://localhost:5000/api/tours/status/${tourId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Cập nhật trạng thái thất bại");
      }
      
      toast.success(`Đã thay đổi trạng thái tour thành công.`);

    } catch (error) {
      setTours(originalTours);
      toast.error((error as Error).message);
    }
  };

  const handleDelete = (tourId: string) => {
    setTours(prevTours => prevTours.filter(t => t.id !== tourId));
  }

  const handleViewDetails = (tour: Tour) => {
    setSelectedTour(tour)
    setIsModalOpen(true)
  }

  const filteredAndSortedTours = useMemo(() => {
    let result = [...tours];

    if (statusFilter !== 'all') {
      result = result.filter(tour => tour.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [tours, statusFilter, sortBy]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Tour</CardTitle>
          <CardDescription>Xem, tạo mới, chỉnh sửa và quản lý tất cả các tour trong hệ thống của bạn.</CardDescription>
          <div className="flex justify-between items-center pt-4">
              <div className="flex gap-4">
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                      <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Lọc theo trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">Tất cả trạng thái</SelectItem>
                          <SelectItem value="active">Hoạt động</SelectItem>
                          <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                  </Select>
                   <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                      <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sắp xếp theo" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="newest">Mới nhất</SelectItem>
                          <SelectItem value="oldest">Cũ nhất</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <Button asChild>
                  <Link href="/admin/tours/new">
                      <PlusCircle className="mr-2 h-4 w-4" /> Thêm tour mới
                  </Link>
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Đang tải...</div>
          ) : (
            <DataTable 
              columns={columns({ 
                onStatusChange: handleStatusChange,
                onDelete: handleDelete,
                onViewDetails: handleViewDetails,
              })} 
              data={filteredAndSortedTours} 
            />
          )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Hiện có <strong>{filteredAndSortedTours.length}</strong> tour.
          </div>
        </CardFooter>
      </Card>
      
      <TourDetailModal 
        tour={selectedTour}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

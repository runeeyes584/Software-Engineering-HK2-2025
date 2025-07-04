'use client'

import BookingDetailModal from '@/components/admin/bookings/BookingDetailModal'
import { useLanguage } from "@/components/language-provider-fixed"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Booking {
  _id: string
  customerName: string
  tourName: string
  bookingDate: string
  status: string
  user?: {
    firstname?: string
    lastname?: string
    username?: string
  }
  tour?: {
    name?: string
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString('vi-VN', { hour12: false })
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const { user } = useUser()
  const { t } = useLanguage()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{
    bookingId: string
    status: string
  } | null>(null)

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    setActionLoading(bookingId + status)
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
        if (status === 'confirmed') {
          toast.success('Xác nhận đặt tour thành công!')
        } else if (status === 'completed') {
          toast.success('Đã xác nhận hoàn thành tour thành công!')
        }
      } else {
        if (status === 'confirmed') {
          toast.error('Xác nhận đặt tour thất bại. Vui lòng thử lại.')
        } else if (status === 'completed') {
          toast.error('Hoàn thành đặt tour thất bại. Vui lòng thử lại.')
        } else {
          toast.error('Cập nhật trạng thái thất bại!');
        }
      }
    } catch {
      toast.error('Có lỗi khi cập nhật trạng thái!')
    } finally {
      setActionLoading(null)
      setDialogOpen(false)
      setPendingAction(null)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return t('booking.status.completed')
      case 'pending':
        return t('booking.status.pending')
      case 'confirmed':
        return t('booking.status.confirmed')
      case 'cancelled':
        return t('booking.status.cancelled')
      default:
        return status
    }
  }

  const handleActionButtonClick = (bookingId: string, status: string) => {
    setPendingAction({ bookingId, status })
    setDialogOpen(true)
  }

  const getDialogTexts = () => {
    if (!pendingAction) return { title: '', description: '', confirm: '' }
    switch (pendingAction.status) {
      case 'confirmed':
        return {
          title: 'Xác nhận đặt tour?',
          description: 'Bạn có chắc chắn muốn xác nhận đặt tour này không?',
          confirm: 'Xác nhận',
        }
      case 'completed':
        return {
          title: 'Hoàn thành đặt tour?',
          description: 'Bạn có chắc chắn muốn đánh dấu đặt tour này là đã hoàn thành không?',
          confirm: 'Hoàn thành',
        }
      default:
        return { title: '', description: '', confirm: '' }
    }
  }

  const dialogTexts = getDialogTexts()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const token = await getToken()
        const res = await fetch('http://localhost:5000/api/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setBookings(Array.isArray(data) ? data : [])
      } catch (err) {
        setBookings([])
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [getToken])

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.id) return;
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.user?.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch { setIsAdmin(false); }
    };
    fetchRole();
  }, [user, getToken]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Quản lý Đặt chỗ</h1>
        <p className="text-gray-500">Xem, tìm kiếm và quản lý các booking tour của khách hàng.</p>
      </div>
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Danh sách đặt chỗ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Khách hàng</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Tour</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Ngày đặt</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Trạng thái</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3"><Skeleton className="h-6 w-32" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-6 w-40" /></td>
                      <td className="px-4 py-3 text-center"><Skeleton className="h-6 w-32 mx-auto" /></td>
                      <td className="px-4 py-3 text-center"><Skeleton className="h-6 w-20 mx-auto" /></td>
                      <td className="px-4 py-3 text-center"><Skeleton className="h-6 w-20 mx-auto" /></td>
                    </tr>
                  ))
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-6 text-gray-500">Không có đặt chỗ nào.</td></tr>
                ) : (
                  bookings.map(booking => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {booking.user
                          ? [booking.user.firstname, booking.user.lastname].filter(Boolean).join(' ') || booking.user.username || '(trống)'
                          : '(trống)'}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{booking.tour?.name || booking.tourName || '(trống)'}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{formatDate(booking.bookingDate)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={cn('font-medium', getStatusStyle(booking.status))}>
                          {getStatusText(booking.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowModal(true)
                          }}
                        >
                          Xem
                        </Button>
                        {isAdmin && booking.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 border-green-500 text-green-600 bg-white hover:bg-green-50"
                            disabled={!!actionLoading}
                            onClick={() => handleActionButtonClick(booking._id, 'confirmed')}
                          >
                            Xác nhận
                          </Button>
                        )}
                        {isAdmin && booking.status === 'confirmed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 border-green-500 text-green-600 bg-white hover:bg-green-50"
                            disabled={!!actionLoading}
                            onClick={() => handleActionButtonClick(booking._id, 'completed')}
                          >
                            Hoàn thành
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTexts.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogTexts.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={!!actionLoading}
              onClick={() => {
                if (pendingAction) {
                  handleUpdateStatus(pendingAction.bookingId, pendingAction.status)
                }
              }}
            >
              {actionLoading ? 'Đang xử lý...' : dialogTexts.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <BookingDetailModal
        booking={selectedBooking}
        open={showModal}
        onOpenChange={setShowModal}
        onStatusChange={(newStatus, bookingId) => {
          setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        }}
      />
    </div>
  )
} 
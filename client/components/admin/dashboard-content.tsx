"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from "@clerk/nextjs"
import dayjs from "dayjs"
import {
  ArrowUpRight,
  DollarSign,
  Package,
  User2,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '../ui/button'

const chartData = [
  { month: 'Tháng 1', revenue: 4000 },
  { month: 'Tháng 2', revenue: 3000 },
  { month: 'Tháng 3', revenue: 5000 },
  { month: 'Tháng 4', revenue: 4500 },
  { month: 'Tháng 5', revenue: 6000 },
  { month: 'Tháng 6', revenue: 5500 },
]

export function DashboardContent() {
  const [bookings, setBookings] = useState<any[]>([])
  const [tours, setTours] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchAll = async () => {
      const token = await getToken();
      const [bookingsRes, toursRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/tours'),
        fetch('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const bookingsData = await bookingsRes.json();
      const toursData = await toursRes.json();
      const usersData = await usersRes.json();
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setTours(Array.isArray(toursData) ? toursData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setLoading(false);
    };
    fetchAll();
  }, [getToken]);

  // Booking completed để tính doanh thu
  const completedBookings = useMemo(() => (Array.isArray(bookings) ? bookings : []).filter((b) => b.status === 'completed'), [bookings])
  const totalRevenue = useMemo(() => completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0), [completedBookings])
  // Booking count: confirmed hoặc completed
  const bookingCount = useMemo(() => (Array.isArray(bookings) ? bookings : []).filter((b) => b.status === 'confirmed' || b.status === 'completed').length, [bookings])
  const tourCount = Array.isArray(tours) ? tours.length : 0
  const userCount = useMemo(() => (Array.isArray(users) ? users : []).filter((u) => u.role === 'user').length, [users])

  // Tính doanh thu 6 tháng gần nhất cho biểu đồ
  const chartData = useMemo(() => {
    // 6 tháng gần nhất
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = dayjs().subtract(5 - i, 'month');
      return { key: d.format('YYYY-MM'), label: `Tháng ${d.month() + 1}` };
    });
    return months.map(({ key, label }) => {
      const monthRevenue = completedBookings
        .filter(b => dayjs(b.createdAt).format('YYYY-MM') === key)
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      return { month: label, revenue: monthRevenue };
    });
  }, [completedBookings]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-6 py-8 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Doanh thu */}
        <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 hover:scale-[1.02] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-blue-900 dark:text-cyan-200">Tổng doanh thu</CardTitle>
              <CardDescription className="text-xs font-medium">Tổng doanh thu từ các booking đã xác nhận/hoàn thành</CardDescription>
            </div>
            <div className="bg-gradient-to-tr from-blue-400 to-cyan-400 p-3 rounded-xl shadow-lg">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-800 dark:text-cyan-200 tracking-tight">
              {loading ? <span className="animate-pulse">...</span> : '$' + totalRevenue.toLocaleString('en-US')}
            </div>
          </CardContent>
        </Card>
        {/* Lượt đặt tour */}
        <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-white dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 hover:scale-[1.02] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-cyan-900 dark:text-blue-200">Lượt đặt tour</CardTitle>
              <CardDescription className="text-xs font-medium">Tổng số booking đã xác nhận/hoàn thành</CardDescription>
            </div>
            <div className="bg-gradient-to-tr from-cyan-400 to-blue-400 p-3 rounded-xl shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-cyan-800 dark:text-blue-200 tracking-tight">
              {loading ? <span className="animate-pulse">...</span> : '+' + bookingCount.toLocaleString('en-US')}
            </div>
          </CardContent>
        </Card>
        {/* Tour đang bán */}
        <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-teal-50 via-blue-50 to-white dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 hover:scale-[1.02] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-teal-900 dark:text-blue-200">Tour đang bán</CardTitle>
              <CardDescription className="text-xs font-medium">Tổng số tour hiện có</CardDescription>
            </div>
            <div className="bg-gradient-to-tr from-teal-400 to-blue-400 p-3 rounded-xl shadow-lg">
              <Package className="h-7 w-7 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-teal-800 dark:text-blue-200 tracking-tight">
              {loading ? <span className="animate-pulse">...</span> : '+' + tourCount.toLocaleString('en-US')}
            </div>
          </CardContent>
        </Card>
        {/* Tài khoản người dùng */}
        <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 hover:scale-[1.02] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-blue-900 dark:text-cyan-200">Tài khoản người dùng</CardTitle>
              <CardDescription className="text-xs font-medium">Chỉ tính tài khoản role user</CardDescription>
            </div>
            <div className="bg-gradient-to-tr from-blue-400 to-cyan-400 p-3 rounded-xl shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-800 dark:text-cyan-200 tracking-tight">
              {loading ? <span className="animate-pulse">...</span> : '+' + userCount.toLocaleString('en-US')}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Chart & Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Chart */}
        <Card className="xl:col-span-2 rounded-3xl shadow-2xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-blue-900 dark:text-cyan-200">Biểu đồ tăng trưởng doanh thu</CardTitle>
              <CardDescription className="text-sm font-medium">Hiển thị doanh thu trong 6 tháng gần nhất.</CardDescription>
            </div>
            <Badge className="bg-gradient-to-tr from-blue-400 to-cyan-400 text-white px-3 py-1 rounded-xl shadow">6 tháng</Badge>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: 12, background: '#fff', boxShadow: '0 4px 24px #0001' }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#colorUv)"
                  strokeWidth={3}
                  dot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 10, fill: '#06b6d4', stroke: '#fff', strokeWidth: 3 }}
                />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Recent Transactions */}
        <Card className="rounded-3xl shadow-2xl border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center pb-2">
            <div className="grid gap-2">
              <CardTitle className="text-lg font-bold text-blue-900 dark:text-cyan-200">Giao dịch gần đây</CardTitle>
              <CardDescription className="text-sm font-medium">Các lượt đặt tour gần đây nhất.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1 bg-gradient-to-tr from-blue-400 to-cyan-400 text-white font-semibold shadow hover:scale-105 transition-transform">
              <Link href="/admin/bookings">
                Xem tất cả
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-6">
                      <span className="animate-pulse text-muted-foreground">Đang tải...</span>
                    </TableCell>
                  </TableRow>
                ) : bookings && bookings.length > 0 ? (
                  [...bookings]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((b, idx) => {
                      const user = b.user || {};
                      const name = (user.firstname || user.lastname) ? `${user.firstname || ''} ${user.lastname || ''}`.trim() : (user.username || user.email || 'Ẩn danh');
                      const email = user.email || '';
                      return (
                        <TableRow key={b._id || idx} className="hover:bg-cyan-50 dark:hover:bg-zinc-800/60 transition">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={user.avatar || '/placeholder-user.jpg'} alt={name} />
                                <AvatarFallback><User2 className="h-5 w-5" /></AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-bold text-blue-900 dark:text-cyan-200">{name}</div>
                                <div className="text-xs text-muted-foreground">{email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-blue-700 dark:text-cyan-300">
                            {b.totalPrice ? `$${b.totalPrice.toLocaleString('en-US')}` : '$0'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                      Không có giao dịch gần đây.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  )
} 
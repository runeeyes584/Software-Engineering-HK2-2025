'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Eye, User as UserIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface User {
  _id: string
  username: string
  email: string
  role: string
  avatar?: string
  clerkId: string
  firstname?: string
  lastname?: string
  phone?: string
  address?: {
    province?: string
    district?: string
    ward?: string
    detailedAddress?: string
  }
  dateOfBirth?: {
    day?: number
    month?: number
    year?: number
  }
  gender?: string
  createdAt: string
  updatedAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const res = await fetch('http://localhost:5000/api/users')
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Quản lý Người dùng</h1>
        <p className="text-gray-500">Xem, tìm kiếm và quản lý tài khoản người dùng trong hệ thống.</p>
      </div>
      <Card className="shadow-md">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-50"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Người dùng</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Vai trò</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3"><Skeleton className="h-8 w-40 rounded-full" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-6 w-48" /></td>
                      <td className="px-4 py-3 text-center"><Skeleton className="h-6 w-20 mx-auto" /></td>
                      <td className="px-4 py-3 text-center"><Skeleton className="h-6 w-20 mx-auto" /></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-6 text-gray-500">Không có người dùng nào.</td></tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} className="w-9 h-9 rounded-full object-cover border" />
                        ) : (
                          <span className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border">
                            <UserIcon size={20} />
                          </span>
                        )}
                        <span className="font-medium text-gray-900">
                          {user.firstname || user.lastname
                            ? [user.firstname, user.lastname].filter(Boolean).join(' ')
                            : user.username || '(trống)'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{user.email}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={user.role === 'admin' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                          {user.role === 'admin' ? 'Admin' : 'Người dùng'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" title="Xem chi tiết" onClick={() => setSelectedUser(user)}>
                          <Eye size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal chi tiết user */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in overflow-y-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setSelectedUser(null)}
              title="Đóng"
            >
              <X size={26} />
            </button>
            <div className="flex flex-col items-center gap-3 mb-8">
              {selectedUser.avatar ? (
                <img src={selectedUser.avatar} alt={selectedUser.username} className="w-24 h-24 rounded-full object-cover border" />
              ) : (
                <span className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border">
                  <UserIcon size={40} />
                </span>
              )}
              <div className="text-2xl font-bold text-gray-900">{selectedUser.username}</div>
              <Badge className={selectedUser.role === 'admin' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                {selectedUser.role === 'admin' ? 'Admin' : 'Người dùng'}
              </Badge>
            </div>
            <div className="space-y-8">
              {/* Thông tin cá nhân */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Thông tin cá nhân</div>
                <div className="space-y-2">
                  <InfoRow label="ID" value={selectedUser._id} />
                  <InfoRow label="Clerk ID" value={selectedUser.clerkId} />
                  <InfoRow label="Tên đăng nhập" value={selectedUser.username} />
                  <InfoRow label="Họ" value={selectedUser.firstname} />
                  <InfoRow label="Tên lót" value={selectedUser.lastname} />
                  <InfoRow label="Giới tính" value={selectedUser.gender} />
                  <InfoRow label="Ngày sinh" value={(selectedUser.dateOfBirth?.day || selectedUser.dateOfBirth?.month || selectedUser.dateOfBirth?.year)
                    ? `${selectedUser.dateOfBirth?.day || '--'}/${selectedUser.dateOfBirth?.month || '--'}/${selectedUser.dateOfBirth?.year || '----'}`
                    : ''} />
                </div>
              </div>
              {/* Liên hệ */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Liên hệ</div>
                <div className="space-y-2">
                  <InfoRow label="Email" value={selectedUser.email} />
                  <InfoRow label="Số điện thoại" value={selectedUser.phone} />
                </div>
              </div>
              {/* Địa chỉ */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Địa chỉ</div>
                <div className="space-y-2">
                  <InfoRow label="Tỉnh/TP" value={selectedUser.address?.province} />
                  <InfoRow label="Quận/Huyện" value={selectedUser.address?.district} />
                  <InfoRow label="Phường/Xã" value={selectedUser.address?.ward} />
                  <InfoRow label="Chi tiết" value={selectedUser.address?.detailedAddress} />
                </div>
              </div>
              {/* Hệ thống */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Hệ thống</div>
                <div className="space-y-2">
                  <InfoRow label="Vai trò" value={selectedUser.role === 'admin' ? 'Admin' : 'Người dùng'} />
                  {selectedUser.createdAt && <InfoRow label="Ngày tạo" value={new Date(selectedUser.createdAt).toLocaleString()} />}
                  {selectedUser.updatedAt && <InfoRow label="Cập nhật" value={new Date(selectedUser.updatedAt).toLocaleString()} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper component cho 1 dòng thông tin
function InfoRow({ label, value }: { label: string, value?: string }) {
  return (
    <div className="flex flex-row gap-2 items-baseline">
      <span className="w-40 min-w-[120px] font-semibold text-gray-700">{label}:</span>
      <span className={value ? 'text-gray-900' : 'italic text-gray-400'}>{value || '(trống)'}</span>
    </div>
  )
} 
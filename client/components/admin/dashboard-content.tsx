"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function DashboardContent() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        <TabsTrigger value="analytics">Phân tích</TabsTrigger>
        <TabsTrigger value="reports">Báo cáo</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Tổng người dùng</h3>
            <p className="text-2xl font-bold mt-2">1,234</p>
            <p className="text-sm text-green-500 mt-2">+12% so với tháng trước</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Tour đang hoạt động</h3>
            <p className="text-2xl font-bold mt-2">56</p>
            <p className="text-sm text-green-500 mt-2">+5% so với tuần trước</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Doanh thu</h3>
            <p className="text-2xl font-bold mt-2">12,345,000₫</p>
            <p className="text-sm text-green-500 mt-2">+8% so với tháng trước</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Phản hồi chờ xử lý</h3>
            <p className="text-2xl font-bold mt-2">23</p>
            <p className="text-sm text-red-500 mt-2">-3% so với tuần trước</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Hoạt động gần đây</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Nguyễn Văn A đã đặt tour</p>
                    <p className="text-sm text-gray-500">2 giờ trước</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Xem chi tiết
                </Button>
              </div>
              {/* Add more activity items here */}
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="analytics">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Phân tích dữ liệu</h2>
          {/* Add analytics content here */}
        </Card>
      </TabsContent>

      <TabsContent value="reports">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Báo cáo</h2>
          {/* Add reports content here */}
        </Card>
      </TabsContent>
    </Tabs>
  )
} 
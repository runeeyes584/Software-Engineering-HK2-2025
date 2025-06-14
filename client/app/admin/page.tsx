"use client"

import { useLanguage } from "@/components/language-provider-fixed"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Star,
  Globe,
  ArrowUpRight,
  Activity,
} from "lucide-react"

export default function AdminDashboard() {
  const { t } = useLanguage()

  const stats = [
    {
      title: t("admin.stats.totalUsers"),
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      trend: "up",
    },
    {
      title: t("admin.stats.activeTours"),
      value: "156",
      change: "+8%",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      trend: "up",
    },
    {
      title: t("admin.stats.totalBookings"),
      value: "1,234",
      change: "+23%",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      trend: "up",
    },
    {
      title: t("admin.stats.revenue"),
      value: "$89,432",
      change: "+15%",
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      trend: "up",
    },
  ]

  const recentBookings = [
    {
      id: "B-001",
      customer: "Nguyễn Văn A",
      tour: "Hạ Long Bay Cruise",
      date: "2024-01-15",
      status: "confirmed",
      amount: "$299",
      avatar: "NA",
    },
    {
      id: "B-002",
      customer: "John Smith",
      tour: "Sapa Trekking Adventure",
      date: "2024-01-14",
      status: "pending",
      amount: "$199",
      avatar: "JS",
    },
    {
      id: "B-003",
      customer: "Trần Thị B",
      tour: "Ho Chi Minh City Tour",
      date: "2024-01-13",
      status: "confirmed",
      amount: "$149",
      avatar: "TB",
    },
  ]

  const recentMessages = [
    {
      id: 1,
      user: "Lê Văn C",
      message: "Tôi muốn hỏi về tour Đà Nẵng",
      time: "5 phút trước",
      unread: true,
      avatar: "LC",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      message: "Can I change my booking date?",
      time: "15 phút trước",
      unread: true,
      avatar: "SJ",
    },
    {
      id: 3,
      user: "Phạm Thị D",
      message: "Cảm ơn về chuyến đi tuyệt vời!",
      time: "1 giờ trước",
      unread: false,
      avatar: "PD",
    },
  ]

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl p-10 shadow-xl mb-6">
        <div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            {t("admin.dashboard.welcome")}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-2xl font-medium">{t("admin.dashboard.subtitle")}</p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" className="hidden md:flex border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 px-6 py-3 text-lg">
            <Globe className="mr-2 h-6 w-6" />
            {t("admin.dashboard.viewSite")}
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xl font-bold px-8 py-4 shadow-xl rounded-2xl">
            <Activity className="mr-2 h-6 w-6" />
            {t("admin.actions.generateReport")}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group rounded-3xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950"
            >
              <div className={`absolute inset-0 ${stat.bgColor} opacity-30`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-lg font-bold text-gray-700 dark:text-gray-200">{stat.title}</CardTitle>
                <div
                  className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="flex items-center text-lg">
                  <TrendingUp className="mr-2 h-6 w-6 text-green-500" />
                  <span className="text-green-600 font-bold">{stat.change}</span>
                  <span className="text-gray-500 ml-3">{t("admin.dashboard.fromLastMonth")}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Bookings */}
        <Card className="shadow-2xl border-0 rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-3xl">
            <CardTitle className="flex items-center text-2xl font-bold">
              <Calendar className="mr-3 h-7 w-7 text-blue-600" />
              {t("admin.dashboard.recentBookings")}
            </CardTitle>
            <CardDescription className="text-lg">{t("admin.dashboard.latestBookings")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-7 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                >
                  <div className="flex items-center space-x-6 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-xl">
                      {booking.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{booking.customer}</p>
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="ml-2 px-4 py-2 text-base font-bold rounded-full">
                          {t(`admin.booking.status.${booking.status}`)}
                        </Badge>
                      </div>
                      <p className="text-base text-gray-600 dark:text-gray-400">{booking.tour}</p>
                    </div>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <div className="font-bold text-xl text-blue-700 dark:text-blue-300">{booking.amount}</div>
                    <div className="text-sm text-gray-400 mt-2">{booking.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Recent Messages */}
        <Card className="shadow-2xl border-0 rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-t-3xl">
            <CardTitle className="flex items-center text-2xl font-bold">
              <MessageSquare className="mr-3 h-7 w-7 text-indigo-600" />
              {t("admin.dashboard.recentMessages")}
            </CardTitle>
            <CardDescription className="text-lg">{t("admin.dashboard.latestMessages")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentMessages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex items-center justify-between p-7 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors ${msg.unread ? "bg-indigo-50/60 dark:bg-indigo-900/10" : ""}`}
                >
                  <div className="flex items-center space-x-6 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-xl">
                      {msg.avatar}
                  </div>
                    <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{msg.user}</p>
                        {msg.unread && <span className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full">New</span>}
                      </div>
                      <p className="text-base text-gray-600 dark:text-gray-400 line-clamp-2">{msg.message}</p>
                    </div>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <div className="text-sm text-gray-400 mt-2">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-2xl border-0 rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-t-3xl">
          <CardTitle className="flex items-center text-2xl font-bold">
            <Star className="mr-3 h-7 w-7 text-purple-600" />
            {t("admin.dashboard.quickActions")}
          </CardTitle>
          <CardDescription className="text-lg">{t("admin.dashboard.commonTasks")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 transition-all duration-300"
            >
              <MapPin className="h-6 w-6 text-blue-600" />
              <span className="font-medium">{t("admin.actions.addTour")}</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 transition-all duration-300"
            >
              <Users className="h-6 w-6 text-green-600" />
              <span className="font-medium">{t("admin.actions.manageUsers")}</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 transition-all duration-300"
            >
              <MessageSquare className="h-6 w-6 text-purple-600" />
              <span className="font-medium">{t("admin.actions.respondChat")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

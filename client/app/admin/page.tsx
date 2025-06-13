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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t("admin.dashboard.welcome")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">{t("admin.dashboard.subtitle")}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="hidden md:flex">
            <Globe className="mr-2 h-4 w-4" />
            {t("admin.dashboard.viewSite")}
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Activity className="mr-2 h-4 w-4" />
            {t("admin.actions.generateReport")}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`absolute inset-0 ${stat.bgColor} opacity-50`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
                <div
                  className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">{stat.change}</span>
                  <span className="text-gray-500 ml-1">{t("admin.dashboard.fromLastMonth")}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              {t("admin.dashboard.recentBookings")}
            </CardTitle>
            <CardDescription>{t("admin.dashboard.latestBookings")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {recentBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${index !== recentBookings.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""}`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {booking.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 dark:text-white">{booking.customer}</p>
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="ml-2">
                          {t(`admin.booking.status.${booking.status}`)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{booking.tour}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{booking.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">{booking.amount}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button variant="ghost" className="w-full justify-center">
                {t("admin.dashboard.viewAllBookings")}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-green-600" />
              {t("admin.dashboard.recentMessages")}
            </CardTitle>
            <CardDescription>{t("admin.dashboard.customerMessages")}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {recentMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${index !== recentMessages.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""}`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {message.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{message.user}</p>
                      {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{message.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button variant="ghost" className="w-full justify-center">
                {t("admin.dashboard.viewAllMessages")}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5 text-purple-600" />
            {t("admin.dashboard.quickActions")}
          </CardTitle>
          <CardDescription>{t("admin.dashboard.commonTasks")}</CardDescription>
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

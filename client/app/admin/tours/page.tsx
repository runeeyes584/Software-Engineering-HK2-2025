"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Star,
  Calendar,
  DollarSign,
} from "lucide-react"

export default function AdminTours() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const tours = [
    {
      id: "T-001",
      name: "Halong Bay Cruise Adventure",
      category: "Cruise",
      price: "$299",
      duration: "3 days",
      status: "active",
      bookings: 45,
      rating: 4.8,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "T-002",
      name: "Sapa Trekking Experience",
      category: "Adventure",
      price: "$199",
      duration: "2 days",
      status: "active",
      bookings: 32,
      rating: 4.6,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "T-003",
      name: "Ho Chi Minh City Discovery",
      category: "Cultural",
      price: "$149",
      duration: "1 day",
      status: "draft",
      bookings: 0,
      rating: 0,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "T-004",
      name: "Mekong Delta Boat Tour",
      category: "Cultural",
      price: "$89",
      duration: "1 day",
      status: "active",
      bookings: 28,
      rating: 4.5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "T-005",
      name: "Phu Quoc Beach Relaxation",
      category: "Beach",
      price: "$399",
      duration: "5 days",
      status: "inactive",
      bookings: 12,
      rating: 4.2,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const filteredTours = tours.filter(
    (tour) =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t("admin.tours.status.active")}</Badge>
        )
      case "draft":
        return <Badge variant="secondary">{t("admin.tours.status.draft")}</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            {t("admin.tours.status.inactive")}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t("admin.tours.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">{t("admin.tours.subtitle")}</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.tours.addNew")}
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5 text-green-600" />
            {t("admin.tours.search.title")}
          </CardTitle>
          <CardDescription>{t("admin.tours.search.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t("admin.tours.search.placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              {t("admin.tours.filter")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tours List */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-blue-600" />
            {t("admin.tours.list.title")}
          </CardTitle>
          <CardDescription>
            {t("admin.tours.list.showing")} {filteredTours.length} {t("admin.tours.list.results")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableHead className="font-semibold">{t("admin.tours.table.name")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.tours.table.category")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.tours.table.price")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.tours.table.duration")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.tours.table.status")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.tours.table.bookings")}</TableHead>
                  <TableHead className="font-semibold">{t("admin.tours.table.rating")}</TableHead>
                  <TableHead className="font-semibold text-right">{t("admin.tours.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTours.map((tour) => (
                  <TableRow key={tour.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={tour.image || "/placeholder.svg"}
                          alt={tour.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{tour.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {tour.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {tour.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                        <span className="font-semibold text-green-600">{tour.price.replace("$", "")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                        <span>{tour.duration}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(tour.status)}</TableCell>
                    <TableCell>
                      <span className="font-medium">{tour.bookings}</span>
                    </TableCell>
                    <TableCell>
                      {tour.rating > 0 ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                          <span className="font-medium">{tour.rating}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("admin.tours.actions.view")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("admin.tours.actions.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("admin.tours.actions.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

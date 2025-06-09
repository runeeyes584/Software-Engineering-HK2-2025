"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Settings, CreditCard, Heart, Clock, Calendar, MapPin, Edit, Trash2 } from "lucide-react"

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+84 123 456 789",
  avatar: "/placeholder.svg?height=100&width=100",
  memberSince: "January 2022",
}

// Mock bookings data
const bookingsData = [
  {
    id: "B12345",
    tourName: "Halong Bay Cruise",
    location: "Halong Bay, Vietnam",
    status: "upcoming",
    date: "June 15, 2025 - June 18, 2025",
    price: 897,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "B12346",
    tourName: "Hoi An Ancient Town",
    location: "Hoi An, Vietnam",
    status: "completed",
    date: "March 10, 2025 - March 12, 2025",
    price: 398,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "B12347",
    tourName: "Sapa Trekking Adventure",
    location: "Sapa, Vietnam",
    status: "cancelled",
    date: "April 5, 2025 - April 9, 2025",
    price: 698,
    image: "/placeholder.svg?height=100&width=150",
  },
]

// Mock wishlist data
const wishlistData = [
  {
    id: 1,
    title: "Mekong Delta Exploration",
    location: "Mekong Delta, Vietnam",
    price: 179,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 2,
    title: "Da Nang & Ba Na Hills",
    location: "Da Nang, Vietnam",
    price: 329,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 3,
    title: "Nha Trang Beach Vacation",
    location: "Nha Trang, Vietnam",
    price: 399,
    image: "/placeholder.svg?height=100&width=150",
  },
]

export default function AccountDashboard() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("overview")

  // Profile state
  const [name, setName] = useState(userData.name)
  const [email, setEmail] = useState(userData.email)
  const [phone, setPhone] = useState(userData.phone)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // Password state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically update the profile via API
    setIsEditingProfile(false)
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically update the password via API
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-3 pb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold">{userData.name}</h3>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <nav className="space-y-2">
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Overview
                </Button>
                <Button
                  variant={activeTab === "bookings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("bookings")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  My Bookings
                </Button>
                <Button
                  variant={activeTab === "wishlist" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">Our customer support team is here to assist you.</p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Account Overview</h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Calendar className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold">Upcoming Trips</h3>
                      <p className="text-3xl font-bold">1</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Clock className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold">Past Trips</h3>
                      <p className="text-3xl font-bold">2</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Heart className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold">Wishlist</h3>
                      <p className="text-3xl font-bold">3</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookingsData.slice(0, 2).map((booking) => (
                      <div key={booking.id} className="flex items-center gap-4">
                        <img
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.tourName}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{booking.tourName}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {booking.location}
                          </div>
                          <div className="text-sm text-muted-foreground">{booking.date}</div>
                        </div>
                        <div>{getStatusBadge(booking.status)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => setActiveTab("bookings")}>
                      View All Bookings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-muted-foreground">Name:</div>
                      <div>{userData.name}</div>

                      <div className="text-muted-foreground">Email:</div>
                      <div>{userData.email}</div>

                      <div className="text-muted-foreground">Phone:</div>
                      <div>{userData.phone}</div>

                      <div className="text-muted-foreground">Member Since:</div>
                      <div>{userData.memberSince}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="outline" onClick={() => setActiveTab("settings")}>
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">My Bookings</h1>

              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-4">
                  {bookingsData.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <img
                            src={booking.image || "/placeholder.svg"}
                            alt={booking.tourName}
                            className="w-full md:w-32 h-24 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <h3 className="font-semibold">{booking.tourName}</h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mb-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {booking.location}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">{booking.date}</div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <div className="font-semibold">Booking ID: {booking.id}</div>
                              <div className="font-semibold">Total: ${booking.price}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {booking.status === "upcoming" && (
                            <Button variant="destructive" size="sm">
                              Cancel Booking
                            </Button>
                          )}
                          {booking.status === "completed" && (
                            <Button variant="outline" size="sm">
                              Write Review
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4 mt-4">
                  {bookingsData
                    .filter((booking) => booking.status === "upcoming")
                    .map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <img
                              src={booking.image || "/placeholder.svg"}
                              alt={booking.tourName}
                              className="w-full md:w-32 h-24 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <h3 className="font-semibold">{booking.tourName}</h3>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mb-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {booking.location}
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">{booking.date}</div>
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="font-semibold">Booking ID: {booking.id}</div>
                                <div className="font-semibold">Total: ${booking.price}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="destructive" size="sm">
                              Cancel Booking
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4 mt-4">
                  {bookingsData
                    .filter((booking) => booking.status === "completed")
                    .map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <img
                              src={booking.image || "/placeholder.svg"}
                              alt={booking.tourName}
                              className="w-full md:w-32 h-24 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <h3 className="font-semibold">{booking.tourName}</h3>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mb-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {booking.location}
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">{booking.date}</div>
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="font-semibold">Booking ID: {booking.id}</div>
                                <div className="font-semibold">Total: ${booking.price}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              Write Review
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>

                <TabsContent value="cancelled" className="space-y-4 mt-4">
                  {bookingsData
                    .filter((booking) => booking.status === "cancelled")
                    .map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <img
                              src={booking.image || "/placeholder.svg"}
                              alt={booking.tourName}
                              className="w-full md:w-32 h-24 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <h3 className="font-semibold">{booking.tourName}</h3>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mb-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {booking.location}
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">{booking.date}</div>
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="font-semibold">Booking ID: {booking.id}</div>
                                <div className="font-semibold">Total: ${booking.price}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              Book Again
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">My Wishlist</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistData.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-40 object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 rounded-full"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {item.location}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="font-semibold">${item.price}</div>
                          <Button size="sm">Book Now</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {wishlistData.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Start adding tours to your wishlist to save them for later.
                    </p>
                    <Button asChild>
                      <a href="/tours">Explore Tours</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Account Settings</h1>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                        <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isEditingProfile}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!isEditingProfile}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditingProfile}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      {isEditingProfile ? (
                        <>
                          <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
                        </>
                      ) : (
                        <Button type="button" onClick={() => setIsEditingProfile(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">Update Password</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your saved payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-md mb-4">
                    <div className="flex items-center">
                      <CreditCard className="h-6 w-6 mr-4 text-primary" />
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive booking confirmations and updates</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Enabled
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Disabled
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">Receive special offers and promotions</p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Enabled
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible account actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive">Delete Account</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


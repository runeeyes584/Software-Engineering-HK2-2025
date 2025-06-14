"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, CreditCard, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Mock user data
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
  }

  // Mock booking data
  const bookings = [
    {
      id: "B-12345",
      tourName: "Halong Bay Cruise",
      date: "2023-12-15",
      status: "Confirmed",
      price: 299,
    },
    {
      id: "B-12346",
      tourName: "Bangkok City Tour",
      date: "2024-01-20",
      status: "Pending",
      price: 199,
    },
    {
      id: "B-12347",
      tourName: "Tokyo Explorer",
      date: "2024-02-10",
      status: "Completed",
      price: 499,
    },
  ]

  const handleLogout = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1000)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-1/4">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback>
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start" asChild>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </div>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Bookings
                  </div>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Methods
                  </div>
                </Button>
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  className="justify-start text-destructive"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoading ? "Logging out..." : "Logout"}
                </Button>
              </nav>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue={user.firstName} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue={user.lastName} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue={user.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue={user.address} />
                    </div>
                    <Button type="submit">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>View and manage your travel bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="font-medium">{booking.tourName}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <CalendarIcon className="mr-1 h-4 w-4" />
                              {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm mt-1">Booking ID: {booking.id}</div>
                          </div>
                          <div className="mt-2 md:mt-0 md:text-right">
                            <div className="font-medium">${booking.price}</div>
                            <div
                              className={`text-sm mt-1 ${
                                booking.status === "Confirmed"
                                  ? "text-green-600"
                                  : booking.status === "Pending"
                                    ? "text-amber-600"
                                    : "text-muted-foreground"
                              }`}
                            >
                              {booking.status}
                            </div>
                            <Button variant="outline" size="sm" className="mt-2">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-muted rounded-md p-2 mr-4">
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-medium">Visa ending in 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 12/25</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                    <Button>Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

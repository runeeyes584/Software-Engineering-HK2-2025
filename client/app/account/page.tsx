"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, CreditCard, LogOut, User, CheckCircle2, Clock, Plus, ArrowRight, AlertCircle, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUser, useAuth } from "@clerk/nextjs"
import TourCard from "@/components/tour-card"
import { toast } from "react-hot-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { provinces, districts, wards } from "@/lib/vietnam-administrative-divisions"

export default function AccountPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'payment' | 'saved-tours'>('profile')
  const { user } = useUser()
  const [savedTours, setSavedTours] = useState<any[]>([])
  const [loadingSaved, setLoadingSaved] = useState(false)
  const [imageIndexes, setImageIndexes] = useState<{ [tourId: string]: number }>({})

  // State cho form Profile
  const [userPhone, setUserPhone] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [dateOfBirth, setDateOfBirth] = useState<{ day: string, month: string, year: string }>({ day: '', month: '', year: '' })
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [ward, setWard] = useState('')
  const [detailedAddress, setDetailedAddress] = useState('')

  const { getToken } = useAuth()

  // Lấy thông tin phone và address từ backend khi component mount hoặc user thay đổi
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return; // Chỉ fetch khi có user ID

      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUserPhone(data.user?.phone || '');
          setUserAddress(data.user?.address || '');
          setGender(data.user?.gender || '');
          setDateOfBirth(data.user?.dateOfBirth || { day: '', month: '', year: '' });

          // Parse address if it's a string
          if (typeof data.user?.address === 'string') {
            const parts = data.user.address.split(', ').reverse(); // Assuming format: detailed, ward, district, province
            setProvince(parts[0] || '');
            setDistrict(parts[1] || '');
            setWard(parts[2] || '');
            setDetailedAddress(parts.slice(3).reverse().join(', ') || '');
          }
        } else {
          // console.error('Failed to fetch user profile:', await res.json());
        }
      } catch (error) {
        // console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user, getToken]); // Depend on user and getToken

  // Lấy tên và email thực tế từ user
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.fullName || user?.username || "User";
  const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "";
  const phone = user?.primaryPhoneNumber?.phoneNumber || "";

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

  // Hàm fetch chi tiết 1 tour
  async function fetchTourDetail(id: string) {
    try {
      const res = await fetch(`http://localhost:5000/api/tours/${id}`)
      if (res.ok) {
        return await res.json()
      }
    } catch {}
    return null
  }

  // Đưa fetchSavedTours ra ngoài để có thể gọi lại sau khi unsave
  const fetchSavedTours = async () => {
    if (!user?.id) return;
    setLoadingSaved(true);
    try {
      const res = await fetch(`http://localhost:5000/api/saved-tours/user/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        const tours = await Promise.all(
          data.map(async (item: any) => {
            if (item.tour && typeof item.tour === 'object' && (item.tour.averageRating || item.tour.rating)) {
              return item.tour;
            }
            const tourId = item.tour?._id || item.tour?.id || item.tour;
            if (tourId) {
              const detail = await fetchTourDetail(tourId);
              return detail || null;
            }
            return null;
          })
        );
        setSavedTours(tours.filter(Boolean));
      } else {
        setSavedTours([]);
      }
    } catch {
      setSavedTours([]);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchSavedTours();
  }, [user]);

  useEffect(() => {
    if (user) {
      setUserPhone(user.primaryPhoneNumber?.phoneNumber || '');
      // setUserAddress((user.unsafeMetadata as any)?.address || '');
      // Initialize gender and date of birth from user metadata if available
      setGender((user.unsafeMetadata as any)?.gender || '');
      setDateOfBirth((user.unsafeMetadata as any)?.dateOfBirth || { day: '', month: '', year: '' });

      const fullAddress = (user.unsafeMetadata as any)?.address || '';
      if (typeof fullAddress === 'string') {
        const parts = fullAddress.split(', ').reverse();
        setProvince(parts[0] || '');
        setDistrict(parts[1] || '');
        setWard(parts[2] || '');
        setDetailedAddress(parts.slice(3).reverse().join(', ') || '');
      }
    }
  }, [user]);

  // Log dữ liệu savedTours mỗi lần render tab Saved Tours
  // useEffect(() => {
  //   if (activeTab === 'saved-tours') {
  //     console.log('savedTours', savedTours)
  //   }
  // }, [activeTab, savedTours])

  const handleLogout = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-600" />
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const handlePrev = (tourId: string, images: string[]) => {
    setImageIndexes((prev) => ({
      ...prev,
      [tourId]: prev[tourId] > 0 ? prev[tourId] - 1 : images.length - 1,
    }))
  }

  const handleNext = (tourId: string, images: string[]) => {
    setImageIndexes((prev) => ({
      ...prev,
      [tourId]: (prev[tourId] || 0) + 1 >= images.length ? 0 : (prev[tourId] || 0) + 1,
    }))
  }

  // Xử lý bỏ lưu tour (ẩn card ngay)
  const handleUnsave = async (tourId: string) => {
    // Ẩn card ngay trên FE
    setSavedTours((prev) => prev.filter(tour => String(tour._id || tour.id) !== tourId));
    try {
      const res = await fetch(`http://localhost:5000/api/saved-tours/${tourId}`, { method: "DELETE" });
      if (res.ok) {
        fetchSavedTours(); // Fetch lại để đồng bộ với BE
      }
    } catch {}
  };

  return (
    <div className="container w-full px-10 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-1/4">
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary/10 shadow-md">
                  <AvatarImage src={user?.imageUrl || "/placeholder.svg?height=96&width=96"} alt={displayName} />
                  <AvatarFallback className="text-lg">
                    {displayName.split(" ").map((s) => s[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{displayName}</CardTitle>
                <CardDescription className="text-sm">{email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-2">
                <Button
                  variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                  className={cn(
                    "justify-start h-11 rounded-md transition-colors",
                    activeTab === 'profile' && 'font-semibold shadow-sm'
                  )}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="mr-3 h-5 w-5" />
                  <span className="font-medium">Profile</span>
                </Button>
                <Button
                  variant={activeTab === 'bookings' ? 'secondary' : 'ghost'}
                  className={cn(
                    "justify-start h-11 rounded-md transition-colors",
                    activeTab === 'bookings' && 'font-semibold shadow-sm'
                  )}
                  onClick={() => setActiveTab('bookings')}
                >
                  <CalendarIcon className="mr-3 h-5 w-5" />
                  <span className="font-medium">Bookings</span>
                </Button>
                <Button
                  variant={activeTab === 'payment' ? 'secondary' : 'ghost'}
                  className={cn(
                    "justify-start h-11 rounded-md transition-colors",
                    activeTab === 'payment' && 'font-semibold shadow-sm'
                  )}
                  onClick={() => setActiveTab('payment')}
                >
                  <CreditCard className="mr-3 h-5 w-5" />
                  <span className="font-medium">Payment Methods</span>
                </Button>
                <Button
                  variant={activeTab === 'saved-tours' ? 'secondary' : 'ghost'}
                  className={cn(
                    "justify-start h-11 rounded-md transition-colors",
                    activeTab === 'saved-tours' && 'font-semibold shadow-sm'
                  )}
                  onClick={() => setActiveTab('saved-tours')}
                >
                  <Heart className="mr-3 h-5 w-5" />
                  <span className="font-medium">Saved Tours</span>
                </Button>
                <Separator className="my-2" />
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Tabs value={activeTab} className="space-y-6">
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Profile Information</CardTitle>
                  <CardDescription>Update your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSavingProfile(true);
                      
                      const fullAddress = [detailedAddress, ward, district, province].filter(Boolean).join(', ');
                      // console.log('Sending update request with data:', { phone: userPhone, address: fullAddress, gender, dateOfBirth });
                      
                      try {
                        // Lấy token từ Clerk
                        const token = await getToken();
                        // console.log('Got Clerk token:', token ? 'Token exists' : 'No token');

                        const res = await fetch('http://localhost:5000/api/users/profile', {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ 
                            phone: userPhone, 
                            address: fullAddress,
                            gender,
                            dateOfBirth
                          })
                        });

                        // console.log('Response status:', res.status);
                        const data = await res.json();
                        // console.log('Response data:', data);

                        if (res.ok) {
                          toast.success('Cập nhật profile thành công!');
                          // Cập nhật state với dữ liệu mới từ backend
                          setUserPhone(data.user?.phone || '');
                          // setUserAddress(data.user?.address || ''); // This will be parsed later
                          setGender(data.user?.gender || '');
                          setDateOfBirth(data.user?.dateOfBirth || { day: '', month: '', year: '' });
                          
                          if (typeof data.user?.address === 'string') {
                            const parts = data.user.address.split(', ').reverse();
                            setProvince(parts[0] || '');
                            setDistrict(parts[1] || '');
                            setWard(parts[2] || '');
                            setDetailedAddress(parts.slice(3).reverse().join(', ') || '');
                          }
                        } else {
                          toast.error(data.message || 'Cập nhật profile thất bại!');
                        }
                      } catch (error) {
                        // console.error('Lỗi khi cập nhật profile:', error);
                        toast.error('Đã xảy ra lỗi khi kết nối server.');
                      } finally {
                        setIsSavingProfile(false);
                      }
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại <span className="text-red-500">*</span></Label>
                        <Input
                          id="phone"
                          className="h-11 rounded-md focus:ring-2 focus:ring-primary/20"
                          placeholder="Nhập số điện thoại của bạn"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Giới tính <span className="text-red-500">*</span></Label>
                        <RadioGroup defaultValue={gender} onValueChange={(value: 'male' | 'female') => setGender(value)} className="flex h-11 items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="gender-male" />
                            <Label htmlFor="gender-male">Nam</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="gender-female" />
                            <Label htmlFor="gender-female">Nữ</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ngày sinh <span className="text-red-500">*</span></Label>
                      <div className="flex gap-4">
                        <Select value={dateOfBirth.day} onValueChange={(value) => setDateOfBirth(prev => ({ ...prev, day: value }))}>
                          <SelectTrigger className="h-11 w-[80px] rounded-md focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Chọn" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                              <SelectItem key={day} value={String(day).padStart(2, '0')}>{String(day).padStart(2, '0')}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={dateOfBirth.month} onValueChange={(value) => setDateOfBirth(prev => ({ ...prev, month: value }))}>
                          <SelectTrigger className="h-11 w-[80px] rounded-md focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Chọn" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <SelectItem key={month} value={String(month).padStart(2, '0')}>{String(month).padStart(2, '0')}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={dateOfBirth.year} onValueChange={(value) => setDateOfBirth(prev => ({ ...prev, year: value }))}>
                          <SelectTrigger className="h-11 w-[90px] rounded-md focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Chọn" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                              <SelectItem key={year} value={String(year)}>{String(year)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="province" className="text-sm font-medium">Tỉnh/Thành phố</Label>
                        <Select value={province} onValueChange={(value) => {
                          setProvince(value);
                          setDistrict(''); // Reset district when province changes
                          setWard(''); // Reset ward when province changes
                        }}>
                          <SelectTrigger className="h-11 rounded-md focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Tỉnh/TP" />
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.map((p) => (
                              <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district" className="text-sm font-medium">Quận/Huyện</Label>
                        <Select value={district} onValueChange={(value) => {
                          setDistrict(value);
                          setWard(''); // Reset ward when district changes
                        }} disabled={!province}>
                          <SelectTrigger className="h-11 rounded-md focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Quận/Huyện" />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.filter(d => d.province === province).map((d) => (
                              <SelectItem key={d.code} value={d.name}>{d.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ward" className="text-sm font-medium">Phường/Xã</Label>
                        <Select value={ward} onValueChange={setWard} disabled={!district}>
                          <SelectTrigger className="h-11 rounded-md focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Phường/Xã" />
                          </SelectTrigger>
                          <SelectContent>
                            {wards.filter(w => w.district === district).map((w) => (
                              <SelectItem key={w.code} value={w.name}>{w.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="detailedAddress" className="text-sm font-medium">Địa chỉ chi tiết</Label>
                      <Input
                        id="detailedAddress"
                        className="h-11 rounded-md focus:ring-2 focus:ring-primary/20"
                        placeholder="Nhập địa chỉ chi tiết của bạn"
                        value={detailedAddress}
                        onChange={(e) => setDetailedAddress(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className="h-11 px-6 font-medium" disabled={isSavingProfile}>
                        {isSavingProfile ? 'Đang lưu...' : 'Lưu thông tin'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Your Bookings</CardTitle>
                  <CardDescription>View and manage your travel bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <Card key={booking.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="text-lg font-semibold">{booking.tourName}</h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {new Date(booking.date).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-muted-foreground">Booking ID: {booking.id}</div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="text-lg font-semibold">{formatPrice(booking.price)}</div>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(booking.status)}
                                  <span
                                    className={cn(
                                      "text-sm font-medium",
                                      booking.status === "Confirmed" && "text-green-600",
                                      booking.status === "Pending" && "text-amber-600",
                                      booking.status === "Completed" && "text-muted-foreground"
                                    )}
                                  >
                                    {booking.status}
                                  </span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 group"
                                >
                                  View Details
                                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You haven't made any bookings yet.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods and billing information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Card className="border shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="bg-muted rounded-lg p-3">
                              <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="font-semibold">Visa ending in 4242</div>
                              <div className="text-sm text-muted-foreground">Expires 12/25</div>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-9"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to remove this payment method?")) {
                                // Handle removal
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Button className="w-full h-11 font-medium">
                      <Plus className="mr-2 h-5 w-5" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved-tours">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Saved Tours</CardTitle>
                  <CardDescription>Danh sách tour đã lưu của bạn sẽ hiển thị ở đây.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingSaved ? (
                    <div className="text-center text-muted-foreground py-10">Đang tải...</div>
                  ) : savedTours.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">Bạn chưa lưu tour nào.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {savedTours.map((tour) => {
                        const id = String(tour._id || tour.id || "");
                        const images = Array.isArray(tour.images) && tour.images.length > 0
                          ? tour.images
                          : (tour.image ? [tour.image] : ["/placeholder.svg"]);
                        const durationStr = typeof tour.duration === "string"
                          ? tour.duration
                          : (typeof tour.duration === "number"
                            ? `${tour.duration} ngày`
                            : (typeof tour.days === "number" ? `${tour.days} ngày` : ""));
                        return (
                          <TourCard
                            key={id}
                            id={id}
                            name={tour.name || tour.title || ""}
                            destination={tour.destination || tour.location || ""}
                            price={tour.price ?? 0}
                            averageRating={typeof tour.averageRating === "number" && !isNaN(tour.averageRating)
                              ? tour.averageRating
                              : (typeof tour.rating === "number" && !isNaN(tour.rating) ? tour.rating : 0)}
                            reviewCount={tour.reviewCount ?? tour.reviews ?? 0}
                            images={images}
                            duration={durationStr}
                            currentIndex={imageIndexes[id] || 0}
                            isSaved={true}
                            onPrev={() => handlePrev(id, images)}
                            onNext={() => handleNext(id, images)}
                            onViewDetail={() => window.location.href = `/tours/${id}`}
                            onToggleSave={() => handleUnsave(id)}
                          />
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}


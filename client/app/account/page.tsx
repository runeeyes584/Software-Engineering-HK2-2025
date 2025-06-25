"use client"

import BookingDetailModal from "@/components/admin/bookings/BookingDetailModal"
import { useLanguage } from "@/components/language-provider-fixed"
import TourCard from "@/components/tour-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { provinces } from "@/lib/vietnam-administrative-divisions"
import { useAuth, useUser } from "@clerk/nextjs"
import { AlertCircle, ArrowRight, CalendarIcon, CheckCircle2, Clock, Heart, User, XCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function AccountPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'saved-tours'>('profile')
  const { user } = useUser()
  const [savedTours, setSavedTours] = useState<any[]>([])
  const [loadingSaved, setLoadingSaved] = useState(false)
  const [imageIndexes, setImageIndexes] = useState<{ [tourId: string]: number }>({})
  const [bookings, setBookings] = useState<any[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  // State cho form Profile
  const [userPhone, setUserPhone] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [dateOfBirth, setDateOfBirth] = useState<{ day: string, month: string, year: string }>({ day: '', month: '', year: '' })
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [ward, setWard] = useState('')
  const [detailedAddress, setDetailedAddress] = useState('')
  const [originalProfile, setOriginalProfile] = useState<any>(null)
  const [userProfileData, setUserProfileData] = useState<any>(null)

  const { getToken } = useAuth()

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<any | null>(null)

  // Thêm state cho filter và phân trang
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const bookingsPerPage = 4

  // Thêm state cho phân trang saved tours
  const [savedCurrentPage, setSavedCurrentPage] = useState(1);
  const SAVED_TOURS_PER_PAGE = 6;
  const savedTotalPages = Math.ceil(savedTours.length / SAVED_TOURS_PER_PAGE);
  const paginatedSavedTours = savedTours.slice((savedCurrentPage - 1) * SAVED_TOURS_PER_PAGE, savedCurrentPage * SAVED_TOURS_PER_PAGE);

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
          setGender(data.user?.gender || '');
          setDateOfBirth(data.user?.dateOfBirth || { day: '', month: '', year: '' });

          // Parse address if it's an object
          if (typeof data.user?.address === 'object') {
            setProvince(data.user.address.province || '');
            setDistrict(data.user.address.district || '');
            setWard(data.user.address.ward || '');
            setDetailedAddress(data.user.address.detailedAddress || '');
          }
          setOriginalProfile({
            phone: data.user?.phone || '',
            gender: data.user?.gender || '',
            dateOfBirth: data.user?.dateOfBirth || { day: '', month: '', year: '' },
            province: data.user?.address?.province || '',
            district: data.user?.address?.district || '',
            ward: data.user?.address?.ward || '',
            detailedAddress: data.user?.address?.detailedAddress || '',
          });
          setUserProfileData(data.user);
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

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      setLoadingBookings(true);
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/bookings/user/clerk/${user.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        } else {
          setBookings([]);
        }
      } catch {
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [user, getToken]);

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

      const userAddressData = (user.unsafeMetadata as any)?.address;
      if (typeof userAddressData === 'object') {
        setProvince(userAddressData.province || '');
        setDistrict(userAddressData.district || '');
        setWard(userAddressData.ward || '');
        setDetailedAddress(userAddressData.detailedAddress || '');
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

  const isProfileChanged = () => {
    const currentProfile = {
      phone: userPhone,
      gender: gender,
      dateOfBirth: dateOfBirth,
      province: province,
      district: district,
      ward: ward,
      detailedAddress: detailedAddress,
    };
    return JSON.stringify(currentProfile) !== JSON.stringify(originalProfile);
  };

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

  // Sắp xếp bookings theo thời gian
  const sortedBookings = [...bookings].sort((a, b) => {
    const tA = new Date(a.createdAt).getTime()
    const tB = new Date(b.createdAt).getTime()
    return sortOrder === 'desc' ? tB - tA : tA - tB
  })
  const totalPages = Math.ceil(sortedBookings.length / bookingsPerPage)
  const paginatedBookings = sortedBookings.slice((currentPage - 1) * bookingsPerPage, currentPage * bookingsPerPage)

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const handleOpenCancelDialog = (booking: any) => {
    setBookingToCancel(booking)
    setShowCancelConfirm(true)
  }

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingToCancel._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (res.ok) {
        toast.success(t('cancel_booking_success'));
        // Cập nhật lại state của booking trong list
        setBookings(prevBookings =>
          prevBookings.map(b =>
            b._id === bookingToCancel._id ? { ...b, status: 'cancelled' } : b
          )
        );
      } else {
        const errorData = await res.json();
        toast.error(`${t('cancel_booking_error')}: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(t('cancel_booking_error'));
      console.error('Error cancelling booking:', error);
    } finally {
      // Đóng dialog xác nhận
      setShowCancelConfirm(false);
      setBookingToCancel(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return t('booking.status.confirmed')
      case "pending":
        return t('booking.status.pending')
      case "completed":
        return t('booking.status.completed')
      case "cancelled":
        return t('booking.status.cancelled')
      default:
        return status
    }
  }

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "bookings") setActiveTab("bookings")
    else if (tab === "saved-tours") setActiveTab("saved-tours")
    else if (tab === "profile") setActiveTab("profile")
  }, [searchParams])

  return (
    <div className="container w-full px-10 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-1/4">
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary/10 shadow-md">
                  <AvatarImage 
                    src={user?.imageUrl || userProfileData?.avatar || "/placeholder.svg?height=96&width=96"} 
                    alt={displayName} 
                  />
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
                  <span className="font-medium">{t('account.sidebar.profile')}</span>
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
                  <span className="font-medium">{t('account.sidebar.bookings')}</span>
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
                  <span className="font-medium">{t('account.sidebar.savedTours')}</span>
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
                  <CardTitle className="text-2xl">{t('account.profile.title')}</CardTitle>
                  <CardDescription>{t('account.profile.description')}</CardDescription>
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
                            province: province,
                            district: district,
                            ward: ward,
                            detailedAddress: detailedAddress,
                            gender: gender,
                            dateOfBirth: dateOfBirth
                          })
                        });

                        // console.log('Response status:', res.status);
                        const data = await res.json();
                        // console.log('Response data:', data);

                        if (res.ok) {
                          toast.success(t('account.profile.toast.updateSuccess'));
                          // Cập nhật state với dữ liệu mới từ backend
                          setUserPhone(data.user?.phone || '');
                          // setUserAddress(data.user?.address || ''); // This will be parsed later
                          setGender(data.user?.gender || '');
                          setDateOfBirth(data.user?.dateOfBirth || { day: '', month: '', year: '' });
                          
                          if (typeof data.user?.address === 'object') {
                            setProvince(data.user.address.province || '');
                            setDistrict(data.user.address.district || '');
                            setWard(data.user.address.ward || '');
                            setDetailedAddress(data.user.address.detailedAddress || '');
                          }
                          setOriginalProfile({
                            phone: data.user?.phone || '',
                            gender: data.user?.gender || '',
                            dateOfBirth: data.user?.dateOfBirth || { day: '', month: '', year: '' },
                            province: data.user?.address?.province || '',
                            district: data.user?.address?.district || '',
                            ward: data.user?.address?.ward || '',
                            detailedAddress: data.user?.address?.detailedAddress || '',
                          });
                          setUserProfileData(data.user);
                        } else {
                          toast.error(data.message || t('account.profile.toast.updateError'));
                        }
                      } catch (error) {
                        // console.error('Lỗi khi cập nhật profile:', error);
                        toast.error(t('account.profile.toast.connectionError'));
                      } finally {
                        setIsSavingProfile(false);
                      }
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">{t('account.profile.form.phone')} <span className="text-red-500">*</span></Label>
                        <Input
                          id="phone"
                          className="h-11 rounded-md focus:ring-2 focus:ring-primary/20"
                          placeholder={t('account.profile.form.phonePlaceholder')}
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">{t('account.profile.form.gender')} <span className="text-red-500">*</span></Label>
                        <RadioGroup value={gender} onValueChange={(value: 'male' | 'female') => setGender(value)} className="flex h-11 items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="gender-male" />
                            <Label htmlFor="gender-male">{t('account.profile.form.male')}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="gender-female" />
                            <Label htmlFor="gender-female">{t('account.profile.form.female')}</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t('account.profile.form.dateOfBirth')} <span className="text-red-500">*</span></Label>
                      <div className="flex gap-4">
                        <Select value={dateOfBirth.day} onValueChange={(value) => setDateOfBirth(prev => ({ ...prev, day: value }))}>
                          <SelectTrigger className="h-11 w-[80px] rounded-md focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder={t('account.profile.form.select')} />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                              <SelectItem key={day} value={String(day).padStart(2, '0')}>{String(day).padStart(2, '0')}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={dateOfBirth.month} onValueChange={(value) => setDateOfBirth(prev => ({ ...prev, month: value }))}>
                          <SelectTrigger className="h-11 w-[80px] rounded-md focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder={t('account.profile.form.select')} />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <SelectItem key={month} value={String(month).padStart(2, '0')}>{String(month).padStart(2, '0')}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={dateOfBirth.year} onValueChange={(value) => setDateOfBirth(prev => ({ ...prev, year: value }))}>
                          <SelectTrigger className="h-11 w-[90px] rounded-md focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder={t('account.profile.form.select')} />
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
                        <Label htmlFor="province" className="text-sm font-medium">{t('account.profile.form.province')}</Label>
                        <Select value={province} onValueChange={(value) => {
                          setProvince(value);
                        }}>
                          <SelectTrigger className="h-11 rounded-md focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder={t('account.profile.form.provincePlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.map((p) => (
                              <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district" className="text-sm font-medium">{t('account.profile.form.district')}</Label>
                        <Input
                          id="district"
                          className="h-11 rounded-md focus:ring-2 focus:ring-primary/20"
                          placeholder={t('account.profile.form.districtPlaceholder')}
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ward" className="text-sm font-medium">{t('account.profile.form.ward')}</Label>
                        <Input
                          id="ward"
                          className="h-11 rounded-md focus:ring-2 focus:ring-primary/20"
                          placeholder={t('account.profile.form.wardPlaceholder')}
                          value={ward}
                          onChange={(e) => setWard(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="detailedAddress" className="text-sm font-medium">{t('account.profile.form.detailedAddress')}</Label>
                      <Input
                        id="detailedAddress"
                        className="h-11 rounded-md focus:ring-2 focus:ring-primary/20"
                        placeholder={t('account.profile.form.detailedAddressPlaceholder')}
                        value={detailedAddress}
                        onChange={(e) => setDetailedAddress(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className="h-11 px-6 font-medium" disabled={isSavingProfile || !isProfileChanged()}>
                        {isSavingProfile ? t('account.profile.form.savingButton') : t('account.profile.form.saveButton')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{t('booking.bookings_of')}</CardTitle>
                    <CardDescription>{t('booking.manage')}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="sort-bookings" className="text-sm font-medium">{t('booking.sort_by')}:</Label>
                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'desc' | 'asc')}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('booking.newest')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">{t('booking.newest')}</SelectItem>
                        <SelectItem value="asc">{t('booking.oldest')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingBookings ? (
                    <div className="text-center text-muted-foreground py-10">Đang tải...</div>
                  ) : bookings.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {t('booking.noBookings')}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-4">
                        {paginatedBookings.length > 0 ? (
                          paginatedBookings.map((booking) => (
                            <Card key={booking._id} className={cn("transition-shadow hover:shadow-md", booking.status === 'cancelled' && 'bg-gray-50')}>
                              <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                  <div className="md:col-span-2">
                                    <h3 
                                      className="font-semibold text-lg cursor-pointer"
                                      onClick={() => router.push(`/tours/${booking.tour._id}`)}
                                    >
                                      {booking.tour.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      <span>
                                        <CalendarIcon className="inline-block w-4 h-4 mr-1.5" />
                                        {t('booking.departure')}: {booking.departureDate && (typeof booking.departureDate === 'string' || booking.departureDate instanceof Date)
                                          ? (() => { try { return new Date(booking.departureDate).toLocaleDateString(); } catch { return '--'; } })()
                                          : '--'}
                                        &nbsp;-&nbsp;
                                        {t('booking.return')}: {booking.returnDate && (typeof booking.returnDate === 'string' || booking.returnDate instanceof Date)
                                          ? (() => { try { return new Date(booking.returnDate).toLocaleDateString(); } catch { return '--'; } })()
                                          : '--'}
                                        &nbsp;&nbsp;•&nbsp;&nbsp; {booking.tour.duration} {t('tour.days')}
                                      </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {t('booking.bookingId')}: {booking._id}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-start md:items-end">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                      <span className="text-xl font-bold">{formatPrice(booking.totalPrice)}</span>
                                      <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full", getStatusStyle(booking.status))}>
                                        {getStatusText(booking.status)}
                                      </span>
                                    </div>
                                    <div className="flex items-center mt-2 space-x-2">
                                      {booking.status === 'pending' && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleOpenCancelDialog(booking)}
                                          className="text-red-600 border-red-500 hover:bg-red-50 hover:text-red-700"
                                        >
                                          <XCircle className="w-4 h-4 mr-1.5" />
                                          {t('booking.cancelBooking')}
                                        </Button>
                                      )}
                                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
                                        {t('booking.viewDetail')} <ArrowRight className="w-4 h-4 ml-1.5" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-muted-foreground">Bạn chưa đặt tour nào.</p>
                          </div>
                        )}
                      </div>
                      <Pagination className="mt-6">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={e => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)) }}
                              aria-disabled={currentPage === 1}
                            >
                              {t('common.paginationPrevious')}
                            </PaginationPrevious>
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === i + 1}
                                onClick={e => { e.preventDefault(); setCurrentPage(i + 1) }}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={e => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)) }}
                              aria-disabled={currentPage === totalPages}
                            >
                              {t('common.paginationNext')}
                            </PaginationNext>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved-tours">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{t('account.savedTours.title')}</CardTitle>
                  <CardDescription>{t('account.savedTours.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingSaved ? (
                    <div className="text-center text-muted-foreground py-10">Đang tải...</div>
                  ) : savedTours.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">Bạn chưa lưu tour nào.</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedSavedTours.map((tour) => {
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
                      <Pagination className="mt-6">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={e => { e.preventDefault(); setSavedCurrentPage(p => Math.max(1, p - 1)) }}
                              aria-disabled={savedCurrentPage === 1}
                            >
                              {t('common.paginationPrevious')}
                            </PaginationPrevious>
                          </PaginationItem>
                          {Array.from({ length: savedTotalPages }, (_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink
                                href="#"
                                isActive={savedCurrentPage === i + 1}
                                onClick={e => { e.preventDefault(); setSavedCurrentPage(i + 1) }}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={e => { e.preventDefault(); setSavedCurrentPage(p => Math.min(savedTotalPages, p + 1)) }}
                              aria-disabled={savedCurrentPage === savedTotalPages}
                            >
                              {t('common.paginationNext')}
                            </PaginationNext>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {showModal && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          open={showModal}
          onOpenChange={setShowModal}
        />
      )}
      {showCancelConfirm && (
        <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('booking.cancelConfirmTitle')}</DialogTitle>
              <DialogDescription>{t('booking.cancelConfirmText')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>{t('booking.cancelNo')}</Button>
              <Button variant="destructive" onClick={handleCancelBooking}>{t('booking.cancelYes')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}



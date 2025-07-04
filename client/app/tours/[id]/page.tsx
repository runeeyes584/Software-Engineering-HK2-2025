"use client"

import { useLanguage } from "@/components/language-provider-fixed"
import { ModalBooking } from "@/components/modal-booking"
import SaveButton from "@/components/save-button"
import { TourReview } from "@/components/tour-review"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useAuth, useUser } from "@clerk/nextjs"
import { differenceInDays, format } from "date-fns"
import { Bus, Car, ChevronLeft, ChevronRight, Clock, MapPin, Plane, Ship, Star } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function TourDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const [tourData, setTourData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined)
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined)
  const [transportType, setTransportType] = useState("plane")
  const [ticketClass, setTicketClass] = useState("economy")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<"images" | "video">("images")
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewLoading, setReviewLoading] = useState(true)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const { getToken } = useAuth()
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [bookingLoading, setBookingLoading] = useState(true)
  const { user } = useUser();
  const userId = user?.id;
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastManualChangeTime, setLastManualChangeTime] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showInactiveAlert, setShowInactiveAlert] = useState(false)
  const [showOutOfStockDialog, setShowOutOfStockDialog] = useState(false);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tours/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch tour details')
        }
        const data = await response.json()
        setTourData(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTourData()
  }, [params.id])

  // Định nghĩa hàm fetchReviews ở ngoài useEffect để có thể truyền xuống prop
  const fetchReviews = async () => {
    setReviewLoading(true);
    const res = await fetch(`http://localhost:5000/api/reviews?tour=${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setReviews(data || []);
    } else {
      setReviews([]);
    }
    setReviewLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [params.id]);

  useEffect(() => {
    const fetchBookings = async () => {
      setBookingLoading(true)
      const token = await getToken()
      const res = await fetch(`http://localhost:5000/api/bookings/completed/${params.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setBookingId(data.booking?._id || null)
      } else {
        setBookingId(null)
      }
      setBookingLoading(false)
    }
    fetchBookings()
  }, [params.id, getToken])

  useEffect(() => {
    setHasReviewed(
      reviews.some((r) =>
        r.user?.clerkId === userId
      )
    );
  }, [reviews, userId]);

  useEffect(() => {
    const fetchSavedTours = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/saved-tours/user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const ids = data.map((item: any) => String(item.tour?._id || item.tour));
            setIsSaved(ids.includes(String(params.id)));
          } else {
            setIsSaved(false);
          }
        } else {
          setIsSaved(false);
        }
      } catch {
        setIsSaved(false);
      }
    };
    fetchSavedTours();
  }, [user, params.id]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let delayTimer: NodeJS.Timeout | null = null;

    const startAutoSlide = () => {
      timer = setInterval(() => {
        setSelectedImage(prevIndex => (prevIndex + 1) % tourData?.images.length || 0);
      }, 4000);
    };

    if (activeTab === "images" && tourData?.images.length > 1) {
      const now = Date.now();
      const timeSinceLastManualChange = now - lastManualChangeTime;

      if (lastManualChangeTime > 0 && timeSinceLastManualChange < 5000) {
        // If there was a recent manual change, wait for the remaining time
        const remainingDelay = 5000 - timeSinceLastManualChange;
        delayTimer = setTimeout(() => {
          startAutoSlide();
        }, remainingDelay);
      } else {
        // Otherwise, start auto-slide immediately
        startAutoSlide();
      }
    }

    return () => {
      if (timer) clearInterval(timer);
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, [activeTab, tourData, selectedImage, lastManualChangeTime]);

  const mapTourDataToTour = (tourData: any) => {
    return {
      id: params.id,
      title: tourData.name,
      location: tourData.destination,
      images: tourData.images || ["/placeholder.svg?height=600&width=800"],
      videos: tourData.videos || [],
      price: tourData.price,
      duration: (
        tourData.departureOptions && tourData.departureOptions.length > 0
          ? differenceInDays(
              new Date(tourData.departureOptions[0].returnDate),
              new Date(tourData.departureOptions[0].departureDate)
            ) + 1
          : 0
      ),
      rating: tourData.averageRating || 4.8,
      reviews: tourData.reviewCount || 124,
      description: tourData.description,
      maxGuests: tourData.maxGuests,
      availableSlots: tourData.availableSlots,
      transportOptions: [
        { id: "plane", name: t("transport.airplane"), icon: Plane, priceModifier: 1.2 },
        { id: "bus", name: t("transport.bus"), icon: Bus, priceModifier: 1.0 },
        { id: "ship", name: t("transport.cruiseShip"), icon: Ship, priceModifier: 1.3 },
        { id: "car", name: t("transport.privateCar"), icon: Car, priceModifier: 1.5 },
      ],
      classOptions: [
        { id: "economy", name: t("class.economy"), description: t("class.economyDesc"), priceModifier: 1.0 },
        { id: "business", name: t("class.business"), description: t("class.businessDesc"), priceModifier: 1.5 },
        { id: "luxury", name: t("class.luxury"), description: t("class.luxuryDesc"), priceModifier: 2.0 },
      ],
      tourReviews: [
        {
          id: "1",
          user: {
            name: "Sarah Johnson",
            avatar: "/avatars/sarah.jpg",
          },
          rating: 5,
          comment: "Amazing experience! The tour guide was knowledgeable and friendly. The accommodations were comfortable and the food was delicious.",
          date: "October 2023",
          adminReply: "Thank you for your wonderful review! We're glad you enjoyed your experience with us.",
        },
        {
          id: "2",
          user: {
            name: "David Chen",
          },
          rating: 4,
          comment: "Great tour overall. The itinerary was well-planned and we got to see all the highlights. Would have given 5 stars if the weather was better.",
          date: "September 2023",
        },
        {
          id: "3",
          user: {
            name: "Maria Garcia",
            avatar: "/avatars/maria.jpg",
          },
          rating: 5,
          comment: "This was my first time booking with this company and I was impressed. Everything was organized perfectly and the staff was very helpful.",
          date: "August 2023",
          adminReply: "We're thrilled to hear that your first experience with us was positive! We hope to welcome you back soon.",
        },
      ],
      departureOptions: tourData.departureOptions || [],
      category: tourData.category || [],
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!tourData) return <div>Tour not found</div>

  const tour = mapTourDataToTour(tourData)
  const status = tourData.status; // Lấy trạng thái tour

  // Calculate price based on selections
  const getSelectedTransport = () =>
    tour.transportOptions.find((t) => t.id === transportType) || tour.transportOptions[0]
  const getSelectedClass = () => tour.classOptions.find((c) => c.id === ticketClass) || tour.classOptions[0]

  const basePrice = tour.price
  const transportModifier = getSelectedTransport().priceModifier
  const classModifier = getSelectedClass().priceModifier

  const adultPrice = Math.round(basePrice * transportModifier * classModifier)
  const childPrice = Math.round(adultPrice * 0.7)
  const infantPrice = Math.round(adultPrice * 0.1)

  const totalPrice = adults * adultPrice + children * childPrice + infants * infantPrice

  const handleBookNow = () => {
    // Kiểm tra tour có active không
    if (tourData?.status !== 'active') {
      setShowInactiveAlert(true);
      return;
    }
    // Kiểm tra tour có còn slot không
    if (tourData?.availableSlots <= 0) {
      setShowOutOfStockDialog(true);
      return;
    }
    // Kiểm tra đã chọn ngày khởi hành chưa
    if (!departureDate || !returnDate) {
      toast.error(t('booking.toast.selectStartDate'));
      return;
    }
    setShowBookingModal(true)
  }

  const TransportIcon = getSelectedTransport().icon

  // Mapping reviews từ DB sang props cho TourReview
  const mappedReviews = reviews.map((r) => ({
    id: r._id,
    user: {
      name: (r.user?.firstname || r.user?.lastname) ? `${r.user?.firstname || ''} ${r.user?.lastname || ''}`.trim() : (r.user?.username || 'User'),
      avatar: r.user?.avatar || undefined,
      clerkId: r.user?.clerkId || undefined,
    },
    rating: r.rating,
    comment: r.comment,
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
    adminReply: r.adminReply,
    likes: r.likes || [],
    images: r.images || [],
    videos: r.videos || [],
  }))
  const averageRating =
    reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0
  const totalReviews = reviews.length

  const handleSaveTour = async () => {
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để lưu tour!");
      return;
    }
    setIsLoading(true);
    const token = await getToken();
    try {
      if (isSaved) {
        // Bỏ lưu
        const res = await fetch(`http://localhost:5000/api/saved-tours/${params.id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (res.ok) {
          setIsSaved(false);
          toast.success(t('tour.unsaved'));
        } else {
          toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      } else {
        // Lưu tour
        const res = await fetch(`http://localhost:5000/api/saved-tours/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user: user.id, tour: params.id })
        });
        if (res.ok) {
          setIsSaved(true);
          toast.success(t('tour.saved'));
        } else {
          toast.error(t('tour.saveError') || "Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    } catch {
      toast.error(t('tour.saveError') || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image/Video */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted group">
                {activeTab === "images" ? (
                  <>
                    <Image
                      src={tour.images[selectedImage]}
                      alt={tour.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    {tour.images.length > 1 && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedImage((selectedImage - 1 + tour.images.length) % tour.images.length);
                            setLastManualChangeTime(Date.now());
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                          type="button"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedImage((selectedImage + 1) % tour.images.length);
                            setLastManualChangeTime(Date.now());
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                          type="button"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  tour.videos[0] && (
                    <video
                      src={tour.videos[0]}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )
                )}
              </div>

              {/* Tab Navigation */}
              {(tour.images.length > 0 || tour.videos.length > 0) && (
                <div className="flex gap-2">
                  {tour.images.length > 0 && (
                    <button
                      onClick={() => setActiveTab("images")}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        activeTab === "images"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {t("tour.images")}
                    </button>
                  )}
                  {tour.videos.length > 0 && (
                    <button
                      onClick={() => setActiveTab("video")}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        activeTab === "video"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {t("tour.video")}
                    </button>
                  )}
                </div>
              )}

              {/* Thumbnails */}
              {activeTab === "images" && tour.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {tour.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(index);
                        setLastManualChangeTime(Date.now());
                      }}
                      className={cn(
                        "relative aspect-video rounded-lg overflow-hidden border-2 transition-all",
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground/20"
                      )}
                    >
                      <Image
                        src={image}
                        alt={`${tour.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tour Information */}
            <div className="space-y-6">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700 }}>{tour.title}</h1>
                <SaveButton isSaved={isSaved} onToggle={handleSaveTour} />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-foreground">
                    {averageRating} ({totalReviews} {t("tour.reviews")})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{tour.duration} {t("tour.days")}</span>
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/10 border">
                  <h3 className="font-medium mb-2 text-muted-foreground">{t("tour.category")}</h3>
                  <div className="flex flex-wrap gap-1">
                    {(tour.category as any[])?.map((cat) => (
                      <Badge key={cat._id} variant="secondary">{cat.name}</Badge>
                    ))}
                    {(tour.category as any[])?.length === 0 && <p className="text-sm">N/A</p>}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/10 border">
                  <h3 className="font-medium mb-2 text-muted-foreground">{t("tour.availableSlots")}</h3>
                  <p className="font-semibold">
                    {tour.availableSlots} / {tour.maxGuests} {t("tour.slots")}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/10 border">
                  <h3 className="font-medium mb-2 text-muted-foreground">{t("tour.status")}</h3>
                  <Badge variant={status === 'active' ? 'default' : 'destructive'} className="mt-1">
                    {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardContent className="p-6 space-y-6">
                  {/* Price Header */}
                  <div className="flex items-baseline justify-between border-b pb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">${basePrice}</span>
                      <span className="text-sm text-muted-foreground">{t("tour.perPerson")}</span>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t("tour.departureDate")}</Label>
                      <Select
                        value={departureDate && returnDate ? `${departureDate.toISOString()}|${returnDate.toISOString()}` : ""}
                        onValueChange={(val) => {
                          const [dep, ret] = val.split("|");
                          setDepartureDate(new Date(dep));
                          setReturnDate(new Date(ret));
                        }}
                      >
                        <SelectTrigger className="w-full h-11">
                          <SelectValue placeholder={t("tour.selectDepartureDate")} />
                        </SelectTrigger>
                        <SelectContent>
                          {tour.departureOptions && tour.departureOptions.length > 0 && (
                            tour.departureOptions.map((opt: any, idx: number) => (
                              <SelectItem key={idx} value={`${opt.departureDate}|${opt.returnDate}`}>
                                {`${format(new Date(opt.departureDate), "dd/MM/yyyy")} - ${format(new Date(opt.returnDate), "dd/MM/yyyy")}`}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {(!tour.departureOptions || tour.departureOptions.length === 0) && (
                        <div className="text-red-500 text-sm mt-2">Không có lịch khởi hành</div>
                      )}
                    </div>
                  </div>

                  {/* Transportation */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">{t("tour.transportation")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {tour.transportOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <button
                            key={option.id}
                            type="button"
                            className={`flex items-center gap-2 p-3 border rounded-lg transition-all text-left ${
                              transportType === option.id
                                ? "bg-primary/10 border-primary text-primary"
                                : "border-border hover:bg-accent"
                            }`}
                            onClick={() => setTransportType(option.id)}
                          >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs font-medium truncate">{option.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Class Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t("tour.class")}</Label>
                    <Select value={ticketClass} onValueChange={setTicketClass}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t("tour.selectClass")} />
                      </SelectTrigger>
                      <SelectContent>
                        {tour.classOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{option.name}</span>
                              <span className="text-xs text-muted-foreground">{option.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Travelers */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t("tour.adults")}</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{adults}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setAdults(Math.min(tour.availableSlots - children - infants, adults + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t("tour.children")}</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{children}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setChildren(Math.min(tour.availableSlots - adults - infants, children + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t("tour.infants")}</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setInfants(Math.max(0, infants - 1))}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{infants}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setInfants(Math.min(tour.availableSlots - adults - children, infants + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <TransportIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {getSelectedTransport().name}, {getSelectedClass().name}
                      </span>
                    </div>

                    {adults > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>
                          {t("tour.adults")} ({adults} × ${adultPrice})
                        </span>
                        <span className="font-medium">${adults * adultPrice}</span>
                      </div>
                    )}

                    {children > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>
                          {t("tour.children")} ({children} × ${childPrice})
                        </span>
                        <span className="font-medium">${children * childPrice}</span>
                      </div>
                    )}

                    {infants > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>
                          {t("tour.infants")} ({infants} × ${infantPrice})
                        </span>
                        <span className="font-medium">${infants * infantPrice}</span>
                      </div>
                    )}

                    <div className="flex justify-between font-bold text-lg pt-3 border-t">
                      <span>{t("tour.total")}</span>
                      <span className="text-primary">${totalPrice}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button
                    onClick={handleBookNow}
                    className="w-full h-12 text-lg font-bold"
                    disabled={isLoading}
                  >
                    {t("tour.bookNow") || "Book Now"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">{t("tour.wontBeCharged")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">{t("tour.reviews")}</h2>
          <TourReview
            reviews={mappedReviews}
            averageRating={Number(averageRating)}
            totalReviews={totalReviews}
            onRefreshReviews={fetchReviews}
            tourId={String(tour.id)}
            bookingId={bookingId}
            hasReviewed={hasReviewed}
            bookingLoading={bookingLoading}
          />
        </div>

        <ModalBooking
          open={showBookingModal}
          onOpenChange={setShowBookingModal}
          tour={tourData}
          onSuccess={(bookingDetails) => {
            setShowBookingModal(false)
            router.push(`/payment/${bookingDetails._id}`)
          }}
          adults={adults}
          children={children}
          infants={infants}
          transportType={transportType}
          ticketClass={ticketClass}
        />
      </div>

      <Dialog open={showOutOfStockDialog} onOpenChange={setShowOutOfStockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tour.outOfStock.title')}</DialogTitle>
            <DialogDescription>
              {t('tour.outOfStock.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">
                {t('tour.outOfStock.confirmButton')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showInactiveAlert} onOpenChange={setShowInactiveAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("alert.notificationTitle")}</DialogTitle>
            <DialogDescription>
              {t("alert.inactiveTourMessage")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">{t("alert.understood")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

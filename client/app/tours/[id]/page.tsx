"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, MapPin, Star, Plane, Bus, Ship, Car } from "lucide-react"
import Image from "next/image"
import { format, addDays, differenceInDays } from "date-fns"
import { useParams, useRouter } from "next/navigation"

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

  const mapTourDataToTour = (tourData: any) => {
    return {
      id: params.id,
      title: tourData.name,
      location: tourData.destination,
      images: tourData.images || [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      price: tourData.price,
      duration: differenceInDays(new Date(tourData.endDate), new Date(tourData.startDate)) + 1,
      rating: tourData.averageRating || 4.8,
      reviews: tourData.reviewCount || 124,
      category: t("categories.adventure"),
      description: tourData.description,
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
      highlights: t("tour.halongBay.highlights"),
      itinerary: [
        {
          day: 1,
          title: t("tour.halongBay.itinerary.day1.title"),
          description: t("tour.halongBay.itinerary.day1.description"),
        },
        {
          day: 2,
          title: t("tour.halongBay.itinerary.day2.title"),
          description: t("tour.halongBay.itinerary.day2.description"),
        },
        {
          day: 3,
          title: t("tour.halongBay.itinerary.day3.title"),
          description: t("tour.halongBay.itinerary.day3.description"),
        },
      ],
      included: t("tour.halongBay.included"),
      excluded: t("tour.halongBay.excluded"),
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!tourData) return <div>Tour not found</div>

  const tour = mapTourDataToTour(tourData)

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
    if (!departureDate) {
      alert(t("tour.selectDepartureDateFirst"))
      return
    }

    if (!returnDate && tour.duration > 1) {
      alert(t("tour.selectReturnDateFirst"))
      return
    }

    router.push(
      `/booking?tourId=${tour.id}&departureDate=${format(departureDate, "yyyy-MM-dd")}&returnDate=${returnDate ? format(returnDate, "yyyy-MM-dd") : ""}&transportType=${transportType}&ticketClass=${ticketClass}&adults=${adults}&children=${children}&infants=${infants}`,
    )
  }

  const TransportIcon = getSelectedTransport().icon

  const reviews = [
    {
      name: "Sarah Johnson",
      date: "October 2023",
      rating: 5,
      comment: t("tour.reviews.sarah.comment"),
    },
    {
      name: "David Chen",
      date: "September 2023",
      rating: 4,
      comment: t("tour.reviews.david.comment"),
    },
    {
      name: "Maria Garcia",
      date: "August 2023",
      rating: 5,
      comment: t("tour.reviews.maria.comment"),
    },
  ]

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <div className="xl:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="w-full">
            {/* Main Image */}
            <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-border shadow-sm mb-4">
              <Image
                src={tour.images[0] || "/placeholder.svg?height=600&width=800"}
                alt={tour.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-3">
              {tour.images.slice(1).map((image: string, index: number) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border">
                  <Image
                    src={image}
                    alt={`Tour image ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tour Information */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{tour.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{tour.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  <span className="font-medium">
                    {tour.rating} ({tour.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{tour.duration} days</span>
                </div>
              </div>
            </div>

            {/* Tabs Content */}
            <div className="w-full">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm">
                    {t("tour.overview")}
                  </TabsTrigger>
                  <TabsTrigger value="itinerary" className="text-xs sm:text-sm">
                    {t("tour.itinerary")}
                  </TabsTrigger>
                  <TabsTrigger value="details" className="text-xs sm:text-sm">
                    {t("tour.details")}
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="text-xs sm:text-sm">
                    {t("tour.reviews")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-0">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">{t("tour.highlights")}</h3>
                    <ul className="space-y-3">
                      {Array.isArray(tour.highlights) ? (
                        tour.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground leading-relaxed">{highlight}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground leading-relaxed">{tour.highlights}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-6 mt-0">
                  {tour.itinerary.map((day) => (
                    <div key={day.day} className="relative pl-8 pb-8 last:pb-0">
                      <div className="absolute left-0 top-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">{day.day}</span>
                      </div>
                      <div className="absolute left-3 top-6 w-0.5 h-full bg-border last:hidden" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{day.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="details" className="space-y-8 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-green-700">{t("tour.included")}</h3>
                      <ul className="space-y-3">
                        {Array.isArray(tour.included) ? (
                          tour.included.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                <span className="text-green-600 text-xs font-bold">✓</span>
                              </div>
                              <span className="text-muted-foreground leading-relaxed">{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <span className="text-green-600 text-xs font-bold">✓</span>
                            </div>
                            <span className="text-muted-foreground leading-relaxed">{tour.included}</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-red-700">{t("tour.notIncluded")}</h3>
                      <ul className="space-y-3">
                        {Array.isArray(tour.excluded) ? (
                          tour.excluded.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                <span className="text-red-600 text-xs font-bold">✗</span>
                              </div>
                              <span className="text-muted-foreground leading-relaxed">{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <span className="text-red-600 text-xs font-bold">✗</span>
                            </div>
                            <span className="text-muted-foreground leading-relaxed">{tour.excluded}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">{t("tour.transportation")}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {tour.transportOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <div
                            key={option.id}
                            className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg"
                          >
                            <Icon className="h-6 w-6 text-primary" />
                            <span className="text-sm font-medium text-center">{option.name}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">{t("tour.additionalInfo")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">{t("tour.language")}</h4>
                        <p className="text-muted-foreground">{t("tour.englishVietnamese")}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">{t("tour.groupSize")}</h4>
                        <p className="text-muted-foreground">{t("tour.maximum20People")}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">{t("tour.transportation")}</h4>
                        <p className="text-muted-foreground">{t("tour.airConditionedVehicle")}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">{t("tour.accommodation")}</h4>
                        <p className="text-muted-foreground">{t("tour.deluxeCabin")}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6 mt-0">
                  <div className="flex items-center gap-6 p-6 bg-muted/30 rounded-xl">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold text-primary">{tour.rating}</div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(tour.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {t("tour.basedOnReviews").replace("{count}", tour.reviews.toString())}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div key={index} className="border-b border-border pb-6 last:border-b-0">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{review.name}</h4>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Booking Card - Right Side */}
        <div className="xl:col-span-1">
          <div className="sticky top-24">
            <Card className="shadow-lg border-border">
              <CardContent className="p-6 space-y-6">
                {/* Price Header */}
                <div className="flex items-baseline justify-between border-b border-border pb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">${basePrice}</span>
                    <span className="text-sm text-muted-foreground">{t("tour.perPerson")}</span>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t("tour.departureDate")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal h-11">
                          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {departureDate ? format(departureDate, "PPP") : t("tour.selectDepartureDate")}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={departureDate}
                          onSelect={(date) => {
                            setDepartureDate(date)
                            if (date && !returnDate && tour.duration > 1) {
                              setReturnDate(addDays(date, tour.duration - 1))
                            }
                          }}
                          disabled={(date: Date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {tour.duration > 1 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t("tour.returnDate")}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal h-11">
                            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {returnDate ? format(returnDate, "PPP") : t("tour.selectReturnDate")}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={returnDate}
                            onSelect={setReturnDate}
                            disabled={(date: Date) => {
                              const today = new Date()
                              return date < today || (departureDate ? date < departureDate : false)
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
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
                  <Label className="text-sm font-medium">{t("tour.travelers")}</Label>

                  <div className="space-y-3">
                    {/* Adults */}
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{t("tour.adults")}</div>
                        <div className="text-xs text-muted-foreground">{t("tour.age12Plus")}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{adults}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setAdults(adults + 1)}>
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{t("tour.children")}</div>
                        <div className="text-xs text-muted-foreground">{t("tour.age2to11")}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{children}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setChildren(children + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{t("tour.infants")}</div>
                        <div className="text-xs text-muted-foreground">{t("tour.under2")}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setInfants(Math.max(0, infants - 1))}
                          disabled={infants <= 0}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium">{infants}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setInfants(infants + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t border-border pt-4 space-y-3">
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

                  <div className="flex justify-between text-sm">
                    <span>{t("tour.serviceFee")}</span>
                    <span className="font-medium">${Math.round(totalPrice * 0.1)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
                    <span>{t("tour.total")}</span>
                    <span className="text-primary">${Math.round(totalPrice * 1.1)}</span>
                  </div>
                </div>

                {/* Book Button */}
                <Button className="w-full h-12 text-base font-medium" onClick={handleBookNow}>
                  {t("tour.bookNow")}
                </Button>

                <p className="text-xs text-center text-muted-foreground">{t("tour.wontBeCharged")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

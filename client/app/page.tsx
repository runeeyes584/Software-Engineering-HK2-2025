"use client"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import TourSearch from "@/components/tour-search"
import { useEffect, useState } from "react"
import TourCard from "@/components/tour-card"

export default function HomePage() {
  const { t } = useLanguage()
  const [featuredTours, setFeaturedTours] = useState<any[]>([])
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    fetch("http://localhost:5000/api/tours")
      .then((res) => res.json())
      .then((data) => {
        // Nếu có trường isFeatured thì lọc, nếu không lấy 4 tour đầu
        const tours = Array.isArray(data)
          ? (data.filter((t) => t.isFeatured).length > 0
              ? data.filter((t) => t.isFeatured)
              : data.slice(0, 4))
          : []
        setFeaturedTours(tours)
      })
      .catch(() => setFeaturedTours([]))
  }, [])

  const popularDestinations = [
    {
      id: 1,
      name: "Hoi An",
      country: "Vietnam",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 2,
      name: "Kyoto",
      country: "Japan",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 3,
      name: "Phuket",
      country: "Thailand",
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      text: "Our trip to Vietnam was absolutely amazing! The tour guides were knowledgeable and the accommodations were perfect.",
      location: "USA",
      rating: 5,
    },
    {
      id: 2,
      name: "David Chen",
      text: "The cultural tour in Japan exceeded all my expectations. I'll definitely book with TravelVista again!",
      location: "Canada",
      rating: 5,
    },
    {
      id: 3,
      name: "Maria Garcia",
      text: "The beach tour in Thailand was the perfect getaway. Everything was well organized and stress-free.",
      location: "Spain",
      rating: 4,
    },
  ]

  const handleSearch = (searchFilters: any) => {
    // Redirect to tours page with search parameters
    const params = new URLSearchParams()

    if (searchFilters.destination) {
      params.set("search", searchFilters.destination)
    }
    if (searchFilters.category) {
      params.set("category", searchFilters.category)
    }
    if (searchFilters.priceRange) {
      params.set("price", searchFilters.priceRange)
    }
    if (searchFilters.duration) {
      params.set("duration", searchFilters.duration)
    }
    if (searchFilters.departureDate) {
      params.set("departure", searchFilters.departureDate.toISOString())
    }
    if (searchFilters.returnDate) {
      params.set("return", searchFilters.returnDate.toISOString())
    }
    if (searchFilters.travelers !== "2") {
      params.set("travelers", searchFilters.travelers)
    }

    window.location.href = `/tours?${params.toString()}`
  }

  const handlePrev = (tourId: string, images: string[]) => {
    setImageIndexes((prev) => ({
      ...prev,
      [tourId]: (prev[tourId] > 0 ? prev[tourId] : images.length) - 1,
    }))
  }

  const handleNext = (tourId: string, images: string[]) => {
    setImageIndexes((prev) => ({
      ...prev,
      [tourId]: ((prev[tourId] || 0) + 1) % images.length,
    }))
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Beautiful travel destination"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{t("home.hero.title")}</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">{t("home.hero.subtitle")}</p>
          <Button size="lg" asChild className="px-8 py-3 text-lg">
            <Link href="/tours">{t("home.hero.cta")}</Link>
          </Button>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 -mt-16 relative z-20">
        <TourSearch onSearch={handleSearch} />
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-8">{t("home.popular")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularDestinations.map((destination) => (
            <Link href={`/destinations/${destination.id}`} key={destination.id} className="group">
              <div className="relative h-64 rounded-xl overflow-hidden border border-border">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold">{destination.name}</h3>
                  <p className="text-white/90">{destination.country}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-16 bg-muted/30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl font-bold mb-8">{t("home.featured")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTours.length === 0 ? (
              <div className="col-span-4 text-center text-muted-foreground py-12 text-lg font-medium">
                Chưa có tour du lịch
              </div>
            ) : (
              featuredTours.map((tour) => {
                const images = Array.isArray(tour.images) && tour.images.length > 0 ? tour.images : ["/placeholder.svg"];
                const currentIndex = imageIndexes[tour._id || tour.id] || 0;
                return (
                  <TourCard
                    key={tour._id || tour.id}
                    name={tour.name}
                    destination={tour.destination}
                    price={tour.price}
                    averageRating={typeof tour.averageRating === "number" && !isNaN(tour.averageRating) ? tour.averageRating : 0}
                    reviewCount={tour.reviewCount || 0}
                    images={images}
                    duration={tour.duration}
                    currentIndex={currentIndex}
                    onPrev={() => handlePrev(tour._id || tour.id, images)}
                    onNext={() => handleNext(tour._id || tour.id, images)}
                    onViewDetail={() => window.location.href = `/tours/${tour._id || tour.id}`}
                  />
                );
              })
            )}
          </div>
          {/* Nút View All Tours chỉ hiện khi có tour */}
          {featuredTours.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/tours">View All Tours</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-8">{t("home.testimonials")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border border-border">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <CardDescription>{testimonial.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("home.cta.title")}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("home.cta.subtitle")}
          </p>
          <Button size="lg" variant="secondary" asChild className="px-8 py-3 text-lg">
            <Link href="/tours">{t("home.cta.button")}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

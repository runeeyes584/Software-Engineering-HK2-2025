"use client"
import { useLanguage } from "@/components/language-provider-fixed"
import TourCard from "@/components/tour-card"
import TourSearch from "@/components/tour-search"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@clerk/nextjs"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { t } = useLanguage()
  const { user } = useUser()
  const [featuredTours, setFeaturedTours] = useState<any[]>([])
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>({})
  const [savedTours, setSavedTours] = useState<string[]>([])

  useEffect(() => {
    fetch("http://localhost:5000/api/tours")
      .then((res) => res.json())
      .then((data) => {
        // Lấy 4 tour mới nhất theo createdAt
        const tours = Array.isArray(data)
          ? data.sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            }).slice(0, 4)
          : [];
        setFeaturedTours(tours)
      })
      .catch(() => setFeaturedTours([]))
  }, [])

  useEffect(() => {
    const fetchSavedTours = async () => {
      if (!user?.id) return
      try {
        const res = await fetch(`http://localhost:5000/api/saved-tours/user/${user.id}`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data)) {
            const ids = data.map((item: any) => String(item.tour?._id || item.tour))
            setSavedTours(ids)
          } else {
            console.error('[DEBUG] Saved tours data is not an array:', data)
          }
        }
      } catch (error) {
        console.error('[DEBUG] Error fetching saved tours:', error)
      }
    }
    fetchSavedTours()
  }, [user])

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
      params.set("query", searchFilters.destination)
    }
    
    // Chuyển hướng đến trang tours với tham số tìm kiếm
    const searchUrl = `/tours${params.toString() ? `?${params.toString()}` : ''}`
    window.location.href = searchUrl
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

  const sortedTours = [...featuredTours]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover absolute inset-0"
          >
            <source src="https://res.cloudinary.com/kaleidoscop3/video/upload/v1750404464/Banner_y6ni7v.mp4" type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
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
              sortedTours.map((tour) => {
                const images = Array.isArray(tour.images) && tour.images.length > 0 ? tour.images : ["/placeholder.svg"];
                const currentIndex = imageIndexes[tour._id || tour.id] || 0;
                const durationStr = typeof tour.duration === "string" ? tour.duration : `${tour.duration} ngày`
                return (
                  <TourCard
                    key={tour._id || tour.id}
                    id={tour._id || tour.id}
                    name={tour.name}
                    destination={tour.destination}
                    price={tour.price}
                    averageRating={typeof tour.rating === "number" && !isNaN(tour.rating) ? tour.rating : 0}
                    reviewCount={tour.reviewCount || 0}
                    images={images}
                    duration={durationStr}
                    currentIndex={currentIndex}
                    isSaved={savedTours.includes(String(tour._id))}
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

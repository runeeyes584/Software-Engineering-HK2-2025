"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Filter, MapPin, Search, Star, Compass } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CulturalTourPage() {
  const { t } = useLanguage()
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [durationRange, setDurationRange] = useState([1, 14])
  const [showFilters, setShowFilters] = useState(false)
  const [sortOption, setSortOption] = useState("recommended")

  // Mock tours data specific to Cultural category
  const tours = [
    {
      id: 1,
      title: "Kyoto Cultural Experience",
      location: "Japan",
      image: "/placeholder.svg?height=400&width=600",
      price: 399,
      duration: 3,
      rating: 4.8,
      category: "Cultural",
      description: "Immerse yourself in the traditional culture of Kyoto with temple visits and tea ceremonies.",
      features: ["Temple Tours", "Tea Ceremony", "Traditional Accommodation"],
    },
    {
      id: 2,
      title: "Hoi An Ancient Town",
      location: "Vietnam",
      image: "/placeholder.svg?height=400&width=600",
      price: 249,
      duration: 2,
      rating: 4.9,
      category: "Cultural",
      description: "Explore the charming UNESCO World Heritage site of Hoi An with its rich history and architecture.",
      features: ["Lantern Making", "Cooking Class", "Historical Sites"],
    },
    {
      id: 3,
      title: "Bangkok Temples & Palaces",
      location: "Thailand",
      image: "/placeholder.svg?height=400&width=600",
      price: 199,
      duration: 1,
      rating: 4.7,
      category: "Cultural",
      description: "Visit Bangkok's most revered temples and the magnificent Grand Palace complex.",
      features: ["Grand Palace", "Wat Pho", "Wat Arun"],
    },
    {
      id: 4,
      title: "Bali Cultural Heritage",
      location: "Indonesia",
      image: "/placeholder.svg?height=400&width=600",
      price: 349,
      duration: 4,
      rating: 4.6,
      category: "Cultural",
      description: "Discover Bali's rich cultural heritage through temples, traditional villages, and art.",
      features: ["Temple Visits", "Traditional Dance", "Artisan Workshops"],
    },
    {
      id: 5,
      title: "Seoul Historical Tour",
      location: "South Korea",
      image: "/placeholder.svg?height=400&width=600",
      price: 299,
      duration: 2,
      rating: 4.7,
      category: "Cultural",
      description: "Explore Seoul's royal palaces, traditional markets, and historical neighborhoods.",
      features: ["Palace Tours", "Hanbok Experience", "Traditional Markets"],
    },
    {
      id: 6,
      title: "Angkor Wat Discovery",
      location: "Cambodia",
      image: "/placeholder.svg?height=400&width=600",
      price: 449,
      duration: 3,
      rating: 4.9,
      category: "Cultural",
      description: "Explore the magnificent temples of Angkor, including the iconic Angkor Wat.",
      features: ["Sunrise at Angkor Wat", "Temple Exploration", "Local Village Visit"],
    },
  ]

  // Filter tours based on price and duration
  const filteredTours = tours.filter(
    (tour) =>
      tour.price >= priceRange[0] &&
      tour.price <= priceRange[1] &&
      tour.duration >= durationRange[0] &&
      tour.duration <= durationRange[1],
  )

  // Sort tours based on selected option
  const sortedTours = [...filteredTours].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "duration":
        return a.duration - b.duration
      default:
        return 0 // recommended - keep original order
    }
  })

  return (
    <div className="py-8">
      {/* Category Header */}
      <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="Cultural Tours"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="w-full max-w-[1200px] mx-auto px-4">
            <div className="flex items-center gap-3 text-white mb-4">
              <Compass className="h-8 w-8" />
              <h1 className="text-3xl md:text-4xl font-bold">{t("categories.cultural")} Tours</h1>
            </div>
            <p className="text-white/90 text-lg max-w-2xl">
              Immerse yourself in the rich cultural heritage of Asia. From ancient temples to traditional ceremonies,
              our cultural tours offer authentic experiences and deep insights into local traditions.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Mobile Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Filters Sidebar */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block lg:w-1/4`}>
          <Card>
            <CardHeader>
              <CardTitle>{t("tours.filter")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search cultural tours..." className="pl-10" />
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Price Range</Label>
                  <span className="text-sm">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 1000]}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Duration (days)</Label>
                  <span className="text-sm">
                    {durationRange[0]} - {durationRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[1, 14]}
                  min={1}
                  max={14}
                  step={1}
                  value={durationRange}
                  onValueChange={setDurationRange}
                />
              </div>

              {/* Cultural Experiences */}
              <div className="space-y-2">
                <Label>Cultural Experiences</Label>
                <div className="space-y-2">
                  {[
                    "Temple Visits",
                    "Traditional Ceremonies",
                    "Cooking Classes",
                    "Artisan Workshops",
                    "Historical Sites",
                    "Local Homestays",
                  ].map((experience) => (
                    <div key={experience} className="flex items-center space-x-2">
                      <Checkbox id={`experience-${experience}`} />
                      <Label htmlFor={`experience-${experience}`} className="text-sm font-normal">
                        {experience}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destinations */}
              <div className="space-y-2">
                <Label>Destinations</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Destinations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    <SelectItem value="japan">Japan</SelectItem>
                    <SelectItem value="vietnam">Vietnam</SelectItem>
                    <SelectItem value="thailand">Thailand</SelectItem>
                    <SelectItem value="indonesia">Indonesia</SelectItem>
                    <SelectItem value="cambodia">Cambodia</SelectItem>
                    <SelectItem value="south-korea">South Korea</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </aside>

        {/* Tours Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Showing {sortedTours.length} cultural {sortedTours.length === 1 ? "tour" : "tours"}
            </div>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("tours.sort")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden border border-border">
                <div className="relative h-48">
                  <Image src={tour.image || "/placeholder.svg"} alt={tour.title} fill className="object-cover" />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{tour.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> {tour.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{tour.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" /> {tour.duration} days
                  </div>
                  <div className="flex items-center mt-1 text-sm">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{tour.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {tour.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="inline-block bg-muted text-xs px-2 py-1 rounded-md text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="font-bold">${tour.price}</div>
                  <Button size="sm" asChild>
                    <Link href={`/tours/${tour.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {sortedTours.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* No Results */}
          {sortedTours.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No tours found matching your criteria</div>
              <Button
                onClick={() => {
                  setPriceRange([0, 1000])
                  setDurationRange([1, 14])
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

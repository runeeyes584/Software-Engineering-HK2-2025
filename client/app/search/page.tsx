"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Filter, Search, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react"
import TourFilters from "@/components/tour-filters"
import { useOptimizedTourFilters, type Tour } from "@/hooks/use-optimized-tour-filters"
import LocalizedTourCard from "@/components/localized-tour-card"

// Extended tour data for search results
const searchToursData: Tour[] = [
  {
    id: 1,
    title: "Halong Bay Luxury Cruise",
    location: "Halong Bay",
    country: "Vietnam",
    image: "/placeholder.svg?height=400&width=600",
    price: 299,
    duration: 3,
    rating: 4.8,
    category: "Cruise",
    description:
      "Experience the breathtaking beauty of Halong Bay on this 3-day luxury cruise adventure through emerald waters and limestone karsts.",
    difficulty: "Easy",
    activities: ["Cruise", "Cave Exploration", "Kayaking", "Swimming", "Photography"],
    features: ["Luxury Cabin", "Cave Exploration", "Kayaking", "Sunset Viewing"],
    amenities: ["WiFi", "Air Conditioning", "Restaurant", "Bar", "Spa", "Sundeck"],
    activityLevel: "Low",
    accommodation: "Luxury Cruise Ship",
    transportation: ["Bus", "Cruise Ship"],
    groupSize: 20,
    languages: ["English", "Vietnamese", "French"],
    included: ["Accommodation", "All Meals", "Activities", "Guide", "Transfers"],
    excluded: ["Flights", "Personal Expenses", "Tips", "Beverages"],
  },
  {
    id: 2,
    title: "Bangkok Cultural Discovery",
    location: "Bangkok",
    country: "Thailand",
    image: "/placeholder.svg?height=400&width=600",
    price: 199,
    duration: 2,
    rating: 4.6,
    category: "Cultural",
    description:
      "Explore the vibrant capital of Thailand, visiting ancient temples, bustling markets, and experiencing authentic street food culture.",
    difficulty: "Easy",
    activities: ["Sightseeing", "Temple Visits", "Market Tours", "Food Tasting", "River Cruise"],
    features: ["Temple Tour", "River Cruise", "Shopping", "Street Food", "Local Guide"],
    amenities: ["WiFi", "Air Conditioning", "Restaurant", "Pool"],
    activityLevel: "Low",
    accommodation: "4-Star Hotel",
    transportation: ["Bus", "Boat", "Tuk-tuk"],
    groupSize: 15,
    languages: ["English", "Thai", "Mandarin"],
    included: ["Accommodation", "Breakfast", "Guide", "Transportation", "Entrance Fees"],
    excluded: ["Lunch", "Dinner", "Personal Expenses", "Shopping"],
  },
  {
    id: 3,
    title: "Bali Paradise Beach Resort",
    location: "Bali",
    country: "Indonesia",
    image: "/placeholder.svg?height=400&width=600",
    price: 349,
    duration: 5,
    rating: 4.9,
    category: "Beach",
    description:
      "Relax on pristine beaches, explore ancient temples, and immerse yourself in Balinese culture at this luxury beach resort.",
    difficulty: "Easy",
    activities: ["Beach Relaxation", "Snorkeling", "Cultural Tours", "Spa", "Temple Visits"],
    features: ["Private Beach Access", "Snorkeling", "Sunset Cruise", "Spa Treatments", "Cultural Shows"],
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Beach Access", "Yoga Studio"],
    activityLevel: "Low",
    accommodation: "Beach Resort",
    transportation: ["Flight", "Private Car", "Boat"],
    groupSize: 12,
    languages: ["English", "Indonesian", "Dutch"],
    included: ["Accommodation", "Breakfast", "Airport Transfer", "Welcome Drink"],
    excluded: ["Flights", "Lunch", "Dinner", "Activities", "Spa Treatments"],
  },
  {
    id: 4,
    title: "Tokyo Modern & Traditional Experience",
    location: "Tokyo",
    country: "Japan",
    image: "/placeholder.svg?height=400&width=600",
    price: 499,
    duration: 4,
    rating: 4.7,
    category: "City Breaks",
    description:
      "Discover the fascinating blend of ultra-modern technology and ancient traditions in Japan's bustling capital city.",
    difficulty: "Moderate",
    activities: ["City Tours", "Museum Visits", "Shopping", "Food Tours", "Temple Visits"],
    features: ["City Tour", "Shopping Districts", "Food Experience", "Technology Centers", "Traditional Areas"],
    amenities: ["WiFi", "Air Conditioning", "Restaurant", "Gym", "Business Center"],
    activityLevel: "Moderate",
    accommodation: "Boutique Hotel",
    transportation: ["Train", "Walking", "Subway"],
    groupSize: 10,
    languages: ["English", "Japanese", "Korean"],
    included: ["Accommodation", "Breakfast", "City Pass", "Guide", "Train Passes"],
    excluded: ["Flights", "Lunch", "Dinner", "Shopping", "Personal Expenses"],
  },
  {
    id: 5,
    title: "Sapa Mountain Trekking Adventure",
    location: "Sapa",
    country: "Vietnam",
    image: "/placeholder.svg?height=400&width=600",
    price: 249,
    duration: 3,
    rating: 4.5,
    category: "Adventure",
    description:
      "Trek through stunning rice terraces and mountain villages, experiencing authentic hill tribe culture and breathtaking landscapes.",
    difficulty: "Challenging",
    activities: ["Trekking", "Hiking", "Cultural Immersion", "Photography", "Village Visits"],
    features: ["Mountain Trekking", "Rice Terraces", "Local Villages", "Cultural Exchange", "Scenic Views"],
    amenities: ["Basic Accommodation", "Meals", "Trekking Equipment"],
    activityLevel: "High",
    accommodation: "Mountain Lodge",
    transportation: ["Bus", "Walking", "Motorbike"],
    groupSize: 8,
    languages: ["English", "Vietnamese"],
    included: ["Accommodation", "All Meals", "Guide", "Permits", "Equipment"],
    excluded: ["Flights", "Personal Equipment", "Tips", "Insurance"],
  },
  {
    id: 6,
    title: "Kyoto Cultural Immersion",
    location: "Kyoto",
    country: "Japan",
    image: "/placeholder.svg?height=400&width=600",
    price: 399,
    duration: 3,
    rating: 4.8,
    category: "Cultural",
    description:
      "Immerse yourself in traditional Japanese culture with temple visits, tea ceremonies, and artisan workshops in historic Kyoto.",
    difficulty: "Easy",
    activities: ["Temple Visits", "Tea Ceremony", "Garden Tours", "Traditional Crafts", "Meditation"],
    features: ["Temple Tours", "Tea Ceremony", "Traditional Accommodation", "Artisan Workshops", "Garden Walks"],
    amenities: ["WiFi", "Traditional Bath", "Restaurant", "Garden", "Library"],
    activityLevel: "Low",
    accommodation: "Traditional Ryokan",
    transportation: ["Train", "Walking", "Bicycle"],
    groupSize: 12,
    languages: ["English", "Japanese"],
    included: ["Accommodation", "Breakfast", "Tea Ceremony", "Guide", "Activities"],
    excluded: ["Flights", "Lunch", "Dinner", "Souvenirs", "Personal Expenses"],
  },
  {
    id: 7,
    title: "Borneo Wildlife Safari",
    location: "Borneo",
    country: "Malaysia",
    image: "/placeholder.svg?height=400&width=600",
    price: 649,
    duration: 6,
    rating: 4.9,
    category: "Wildlife",
    description:
      "Encounter orangutans, proboscis monkeys, and exotic birds in the ancient rainforests of Borneo on this wildlife adventure.",
    difficulty: "Moderate",
    activities: ["Wildlife Spotting", "Jungle Trekking", "River Safari", "Photography", "Night Walks"],
    features: ["Orangutan Spotting", "Jungle Trekking", "River Safari", "Wildlife Photography", "Expert Guide"],
    amenities: ["Basic Accommodation", "Meals", "Equipment", "Mosquito Nets"],
    activityLevel: "Moderate",
    accommodation: "Jungle Lodge",
    transportation: ["Flight", "Boat", "Walking", "4WD"],
    groupSize: 10,
    languages: ["English", "Malay"],
    included: ["Accommodation", "All Meals", "Guide", "Equipment", "Permits", "Transfers"],
    excluded: ["Flights", "Personal Items", "Tips", "Insurance"],
  },
  {
    id: 8,
    title: "Maldives Luxury Overwater Villa",
    location: "Maldives",
    country: "Maldives",
    image: "/placeholder.svg?height=400&width=600",
    price: 1299,
    duration: 7,
    rating: 5.0,
    category: "Beach",
    description:
      "Ultimate luxury experience in an overwater villa surrounded by crystal-clear turquoise waters and pristine coral reefs.",
    difficulty: "Easy",
    activities: ["Snorkeling", "Diving", "Spa", "Water Sports", "Sunset Cruises"],
    features: ["Overwater Villa", "Private Beach", "Spa", "Water Sports", "Fine Dining", "Butler Service"],
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Water Sports", "Butler Service", "Private Beach"],
    activityLevel: "Low",
    accommodation: "Luxury Resort",
    transportation: ["Seaplane", "Boat", "Speedboat"],
    groupSize: 2,
    languages: ["English", "Dhivehi", "German"],
    included: ["Accommodation", "All Meals", "Activities", "Transfers", "Butler Service"],
    excluded: ["Flights", "Spa Treatments", "Premium Alcohol", "Excursions"],
  },
  {
    id: 9,
    title: "Singapore City Discovery",
    location: "Singapore",
    country: "Singapore",
    image: "/placeholder.svg?height=400&width=600",
    price: 399,
    duration: 3,
    rating: 4.8,
    category: "City Breaks",
    description:
      "Explore the futuristic city-state with its iconic landmarks, diverse culture, world-class cuisine, and stunning architecture.",
    difficulty: "Easy",
    activities: ["City Tours", "Food Tours", "Shopping", "Garden Visits", "Cultural Experiences"],
    features: ["Gardens by the Bay", "Marina Bay Sands", "Hawker Centers", "Shopping", "Architecture Tour"],
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym", "Business Center"],
    activityLevel: "Low",
    accommodation: "5-Star Hotel",
    transportation: ["MRT", "Bus", "Walking", "Taxi"],
    groupSize: 15,
    languages: ["English", "Mandarin", "Malay", "Tamil"],
    included: ["Accommodation", "Breakfast", "City Tour", "Airport Transfer"],
    excluded: ["Flights", "Lunch", "Dinner", "Shopping", "Activities"],
  },
  {
    id: 10,
    title: "Phuket Island Paradise",
    location: "Phuket",
    country: "Thailand",
    image: "/placeholder.svg?height=400&width=600",
    price: 299,
    duration: 4,
    rating: 4.7,
    category: "Beach",
    description:
      "Discover pristine beaches, vibrant nightlife, and stunning island scenery in Thailand's largest and most popular island destination.",
    difficulty: "Easy",
    activities: ["Beach Relaxation", "Island Hopping", "Snorkeling", "Water Sports", "Nightlife"],
    features: ["Island Hopping", "Snorkeling", "Beach BBQ", "Water Sports", "Sunset Views"],
    amenities: ["WiFi", "Pool", "Restaurant", "Bar", "Beach Access", "Water Sports Center"],
    activityLevel: "Low",
    accommodation: "Beach Resort",
    transportation: ["Flight", "Boat", "Songthaew"],
    groupSize: 20,
    languages: ["English", "Thai", "Russian", "Chinese"],
    included: ["Accommodation", "Breakfast", "Island Tour", "Airport Transfer"],
    excluded: ["Flights", "Lunch", "Dinner", "Water Sports", "Nightlife"],
  },
  {
    id: 11,
    title: "Mount Fuji Climbing Adventure",
    location: "Mount Fuji",
    country: "Japan",
    image: "/placeholder.svg?height=400&width=600",
    price: 399,
    duration: 2,
    rating: 4.8,
    category: "Adventure",
    description:
      "Summit Japan's iconic Mount Fuji on this challenging but rewarding climbing adventure with spectacular sunrise views.",
    difficulty: "Challenging",
    activities: ["Climbing", "Hiking", "Photography", "Sunrise Viewing"],
    features: ["Mountain Climbing", "Sunrise View", "Photography", "Cultural Sites", "Achievement Certificate"],
    amenities: ["Mountain Hut", "Basic Meals", "Climbing Equipment"],
    activityLevel: "Extreme",
    accommodation: "Mountain Hut",
    transportation: ["Bus", "Walking"],
    groupSize: 8,
    languages: ["English", "Japanese"],
    included: ["Accommodation", "Meals", "Guide", "Equipment", "Permits"],
    excluded: ["Flights", "Personal Equipment", "Insurance", "Tips"],
  },
  {
    id: 12,
    title: "Angkor Wat Temple Discovery",
    location: "Siem Reap",
    country: "Cambodia",
    image: "/placeholder.svg?height=400&width=600",
    price: 449,
    duration: 3,
    rating: 4.9,
    category: "Cultural",
    description:
      "Explore the magnificent temples of Angkor, including the iconic Angkor Wat at sunrise, and discover ancient Khmer civilization.",
    difficulty: "Moderate",
    activities: ["Temple Exploration", "Photography", "Cultural Tours", "Sunrise Viewing", "Cycling"],
    features: [
      "Sunrise at Angkor Wat",
      "Temple Exploration",
      "Local Village Visit",
      "Cycling Tour",
      "Historical Guide",
    ],
    amenities: ["WiFi", "Pool", "Restaurant", "Spa", "Bicycle Rental"],
    activityLevel: "Moderate",
    accommodation: "Boutique Hotel",
    transportation: ["Tuk-tuk", "Bicycle", "Walking"],
    groupSize: 12,
    languages: ["English", "Khmer", "French"],
    included: ["Accommodation", "Breakfast", "Temple Pass", "Guide", "Transfers"],
    excluded: ["Flights", "Lunch", "Dinner", "Personal Expenses", "Tips"],
  },
]

export default function SearchResultsPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const {
    filters,
    filteredTours,
    filterCounts,
    activeFilterCount,
    sortBy,
    searchResults,
    searchSuggestions,
    searchHistory,
    performanceMetrics,
    updateFilter,
    toggleArrayFilter,
    resetFilters,
    setSortBy,
    addToSearchHistory,
    getPopularSearches,
  } = useOptimizedTourFilters(searchToursData)

  // Initialize filters from URL parameters
  useEffect(() => {
    const query = searchParams.get("q")
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const duration = searchParams.get("duration")
    const page = searchParams.get("page")

    if (query) updateFilter("searchQuery", query)
    if (category) updateFilter("categories", [category])
    if (location) updateFilter("countries", [location])
    if (minPrice || maxPrice) {
      updateFilter("priceRange", [
        minPrice ? Number.parseInt(minPrice) : 0,
        maxPrice ? Number.parseInt(maxPrice) : 2000,
      ])
    }
    if (duration) {
      const [min, max] = duration.split("-").map(Number)
      updateFilter("durationRange", [min || 1, max || 21])
    }
    if (page) setCurrentPage(Number.parseInt(page))
  }, [searchParams, updateFilter])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.searchQuery) params.set("q", filters.searchQuery)
    if (filters.categories.length > 0) params.set("category", filters.categories[0])
    if (filters.countries.length > 0) params.set("location", filters.countries[0])
    if (filters.priceRange[0] > 0) params.set("minPrice", filters.priceRange[0].toString())
    if (filters.priceRange[1] < 2000) params.set("maxPrice", filters.priceRange[1].toString())
    if (currentPage > 1) params.set("page", currentPage.toString())

    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`
    router.replace(newUrl, { scroll: false })
  }, [filters, currentPage, router])

  // Pagination logic
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTours = filteredTours.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)

      if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push("...")
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Search Results</h1>
            <p className="text-muted-foreground">
              {filters.searchQuery && `Results for "${filters.searchQuery}"`}
              {filteredTours.length > 0 && (
                <span className="ml-2">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredTours.length)} of {filteredTours.length} tours
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search destinations, activities, or tour names..."
              className="pl-10"
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setShowMobileFilters(!showMobileFilters)} className="lg:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && <Badge className="ml-2">{activeFilterCount}</Badge>}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <TourFilters
          filters={filters}
          filterCounts={filterCounts}
          activeFilterCount={activeFilterCount}
          onUpdateFilter={updateFilter}
          onToggleArrayFilter={toggleArrayFilter}
          onResetFilters={resetFilters}
          showMobileFilters={showMobileFilters}
          onToggleMobileFilters={() => setShowMobileFilters(!showMobileFilters)}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="duration-short">Duration: Short to Long</SelectItem>
                  <SelectItem value="duration-long">Duration: Long to Short</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  {filters.searchQuery && <SelectItem value="relevance">Most Relevant</SelectItem>}
                </SelectContent>
              </Select>

              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 per page</SelectItem>
                  <SelectItem value="12">12 per page</SelectItem>
                  <SelectItem value="24">24 per page</SelectItem>
                  <SelectItem value="48">48 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {activeFilterCount > 0 && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All Filters ({activeFilterCount})
              </Button>
            )}
          </div>

          {/* Results */}
          {currentTours.length > 0 ? (
            <>
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}
              >
                {currentTours.map((tour) => (
                  <LocalizedTourCard key={tour.id} tour={tour} isListView={viewMode === "list"} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} ({filteredTours.length} total results)
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((page, index) => (
                        <div key={index}>
                          {page === "..." ? (
                            <span className="px-2 py-1 text-muted-foreground">...</span>
                          ) : (
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page as number)}
                              className="w-10"
                            >
                              {page}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <Search className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">No tours found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filters.searchQuery
                      ? `No tours match your search for "${filters.searchQuery}"`
                      : "No tours match your current filters"}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="outline" onClick={resetFilters}>
                      Clear All Filters
                    </Button>
                    <Button variant="outline" onClick={() => updateFilter("searchQuery", "")}>
                      Clear Search
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

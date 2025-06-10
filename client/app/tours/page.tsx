"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPin, Star, Zap, TrendingUp, Filter, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import TourFilters from "@/components/tour-filters"
import OptimizedSearch from "@/components/optimized-search"
import PerformanceMonitor from "@/components/performance-monitor"
import { useOptimizedTourFilters, type Tour } from "@/hooks/use-optimized-tour-filters"

export default function ToursPage() {
  const { t } = useLanguage()
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)

  // Static tours data to prevent re-renders
  const allTours: Tour[] = [
    {
      id: 1,
      title: "Halong Bay Cruise",
      location: "Halong Bay",
      country: "Vietnam",
      image: "/placeholder.svg?height=400&width=600",
      price: 299,
      duration: 3,
      rating: 4.8,
      category: "Cruise",
      description: "Experience the breathtaking beauty of Halong Bay on this 3-day cruise adventure.",
      difficulty: "Easy",
      activities: ["Cruise", "Cave Exploration", "Kayaking", "Swimming", "Photography"],
      features: ["Luxury Cabin", "Cave Exploration", "Kayaking"],
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
      title: "Bangkok City Explorer",
      location: "Bangkok",
      country: "Thailand",
      image: "/placeholder.svg?height=400&width=600",
      price: 199,
      duration: 2,
      rating: 4.6,
      category: "City Breaks",
      description: "Explore the vibrant capital of Thailand, visiting ancient temples and bustling markets.",
      difficulty: "Easy",
      activities: ["Sightseeing", "Temple Visits", "Market Tours", "Food Tasting", "River Cruise"],
      features: ["Temple Tour", "River Cruise", "Shopping", "Street Food"],
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
      title: "Bali Paradise Retreat",
      location: "Bali",
      country: "Indonesia",
      image: "/placeholder.svg?height=400&width=600",
      price: 349,
      duration: 5,
      rating: 4.9,
      category: "Beach",
      description: "Relax on pristine beaches and explore ancient temples in Bali.",
      difficulty: "Easy",
      activities: ["Beach Relaxation", "Snorkeling", "Cultural Tours", "Spa", "Temple Visits"],
      features: ["Private Beach Access", "Snorkeling", "Sunset Cruise", "Spa Treatments"],
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
      title: "Tokyo Modern & Traditional",
      location: "Tokyo",
      country: "Japan",
      image: "/placeholder.svg?height=400&width=600",
      price: 499,
      duration: 4,
      rating: 4.7,
      category: "City Breaks",
      description: "Discover the fascinating blend of ultra-modern technology and ancient traditions.",
      difficulty: "Moderate",
      activities: ["City Tours", "Museum Visits", "Shopping", "Food Tours", "Temple Visits"],
      features: ["City Tour", "Shopping Districts", "Food Experience", "Technology Centers"],
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
      title: "Sapa Mountain Trekking",
      location: "Sapa",
      country: "Vietnam",
      image: "/placeholder.svg?height=400&width=600",
      price: 249,
      duration: 3,
      rating: 4.5,
      category: "Adventure",
      description: "Trek through stunning rice terraces and mountain villages.",
      difficulty: "Challenging",
      activities: ["Trekking", "Hiking", "Cultural Immersion", "Photography", "Village Visits"],
      features: ["Mountain Trekking", "Rice Terraces", "Local Villages", "Cultural Exchange"],
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
      description: "Immerse yourself in traditional Japanese culture with temple visits and tea ceremonies.",
      difficulty: "Easy",
      activities: ["Temple Visits", "Tea Ceremony", "Garden Tours", "Traditional Crafts", "Meditation"],
      features: ["Temple Tours", "Tea Ceremony", "Traditional Accommodation", "Artisan Workshops"],
      amenities: ["WiFi", "Traditional Bath", "Restaurant", "Garden", "Library"],
      activityLevel: "Low",
      accommodation: "Traditional Ryokan",
      transportation: ["Train", "Walking", "Bicycle"],
      groupSize: 12,
      languages: ["English", "Japanese"],
      included: ["Accommodation", "Breakfast", "Tea Ceremony", "Guide", "Activities"],
      excluded: ["Flights", "Lunch", "Dinner", "Souvenirs", "Personal Expenses"],
    },
  ]

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
  } = useOptimizedTourFilters(allTours)

  const popularSearches = getPopularSearches()

  const handleSearchChange = (query: string) => {
    updateFilter("searchQuery", query)
  }

  const handleSearchSelect = (query: string) => {
    updateFilter("searchQuery", query)
  }

  const isSearching = filters.searchQuery.length > 0 && searchResults.length === 0

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("nav.tours")}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
            className="hidden md:flex"
          >
            <Zap className="h-4 w-4 mr-1" />
            Performance
          </Button>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {activeFilterCount} active
            </Badge>
          )}
        </div>
      </div>

      {showPerformanceMonitor && (
        <div className="mb-6">
          <PerformanceMonitor
            metrics={performanceMetrics}
            activeFilterCount={activeFilterCount}
            searchQuery={filters.searchQuery}
          />
        </div>
      )}

      <div className="mb-8">
        <OptimizedSearch
          searchQuery={filters.searchQuery}
          searchSuggestions={searchSuggestions}
          searchHistory={searchHistory}
          popularSearches={popularSearches}
          onSearchChange={handleSearchChange}
          onSearchSelect={handleSearchSelect}
          onAddToHistory={addToSearchHistory}
          isSearching={isSearching}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
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

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>
                Showing {filteredTours.length} of {allTours.length} tours
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {activeFilterCount} filters
                </Badge>
              )}
              {filters.searchQuery && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  Search active
                </Badge>
              )}
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                {filters.searchQuery && <SelectItem value="relevance">Most Relevant</SelectItem>}
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="duration-short">Duration: Short to Long</SelectItem>
                <SelectItem value="duration-long">Duration: Long to Short</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={tour.image || "/placeholder.svg"}
                      alt={tour.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">{tour.category}</Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="default" className="bg-black/70 text-white">
                        ${tour.price}
                      </Badge>
                    </div>
                    {tour.difficulty && (
                      <div className="absolute bottom-2 left-2">
                        <Badge
                          variant={
                            tour.difficulty === "Easy"
                              ? "default"
                              : tour.difficulty === "Moderate"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {tour.difficulty}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{tour.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {tour.location}, {tour.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{tour.description}</p>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {tour.duration} days
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {tour.rating}
                      </div>
                    </div>
                    {tour.activities && tour.activities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tour.activities.slice(0, 3).map((activity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                        {tour.activities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tour.activities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    {tour.activityLevel && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        Activity Level: {tour.activityLevel}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/tours/${tour.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="space-y-4">
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No tours found</h3>
                  <p className="text-sm">
                    {filters.searchQuery
                      ? `No tours match your search for "${filters.searchQuery}"`
                      : "No tours match your current filters"}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" onClick={resetFilters}>
                    Clear All Filters
                  </Button>
                  {popularSearches.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="text-sm text-muted-foreground">Try:</span>
                      {popularSearches.slice(0, 3).map((search, index) => (
                        <Button key={index} variant="ghost" size="sm" onClick={() => handleSearchSelect(search)}>
                          {search}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

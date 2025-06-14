"use client"

import { useState, useEffect } from "react"
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
  const [allTours, setAllTours] = useState<Tour[]>([])

  useEffect(() => {
    fetch("http://localhost:5000/api/tours")
      .then((res) => res.json())
      .then((data) => setAllTours(data))
      .catch(() => setAllTours([]))
  }, [])

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
        <div className="flex items-center gap-2">            <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
            className="hidden md:flex"
          >
            <Zap className="h-4 w-4 mr-1" />
            {t("common.performance")}
          </Button>          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {activeFilterCount} {t("filters.active")}
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
          <div className="flex justify-between items-center mb-6">            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>
                {t("search.showing")} {filteredTours.length} {t("search.of")} {allTours.length} {t("search.tours")}
              </span>              {activeFilterCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {activeFilterCount} {t("filters.title")}
                </Badge>
              )}              {filters.searchQuery && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  {t("search.active")}
                </Badge>
              )}
            </div>            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("sort.sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">{t("sort.recommended")}</SelectItem>
                {filters.searchQuery && <SelectItem value="relevance">{t("sort.mostRelevant")}</SelectItem>}
                <SelectItem value="price-low">{t("sort.priceLowToHigh")}</SelectItem>
                <SelectItem value="price-high">{t("sort.priceHighToLow")}</SelectItem>
                <SelectItem value="rating">{t("sort.highestRated")}</SelectItem>
                <SelectItem value="duration-short">{t("sort.durationShortToLong")}</SelectItem>
                <SelectItem value="duration-long">{t("sort.durationLongToShort")}</SelectItem>
                <SelectItem value="alphabetical">{t("sort.alphabetical")}</SelectItem>
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
                    <div className="flex items-center justify-between text-sm mb-3">                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {tour.duration} {t("common.days")}
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
                        ))}                        {tour.activities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tour.activities.length - 3} {t("common.more")}
                          </Badge>
                        )}
                      </div>
                    )}
                    {tour.activityLevel && (                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        {t("tour.activityLevel")}: {tour.activityLevel}
                      </div>
                    )}
                  </CardContent>                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/tours/${tour.id}`}>{t("tour.viewDetails")}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (            <Card className="p-8 text-center">
              <div className="space-y-4">
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">{t("search.noToursFound")}</h3>
                  <p className="text-sm">
                    {filters.searchQuery
                      ? t("search.noToursMatchSearch", { query: filters.searchQuery })
                      : t("search.noToursMatchFilters")}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" onClick={resetFilters}>
                    {t("filters.clearAll")}
                  </Button>
                  {popularSearches.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="text-sm text-muted-foreground">{t("search.try")}:</span>
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

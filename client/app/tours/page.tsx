"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
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
import { useOptimizedTourFilters, type TourUI } from "@/hooks/use-optimized-tour-filters"
import { toast } from "sonner"
import { useAuth, useUser } from "@clerk/nextjs"
import TourCard from "@/components/tour-card"

export default function ToursPage() {
  const { t } = useLanguage()
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false)
  const [allTours, setAllTours] = useState<TourUI[]>([])
  const [savedTourIds, setSavedTourIds] = useState<string[]>([])
  const { getToken } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    fetch("http://localhost:5000/api/tours")
      .then((res) => res.json())
      .then((data) => setAllTours(
        data.map((tour: any) => ({
          ...tour,
          id: tour._id && typeof tour._id === 'object' && tour._id.toString
            ? tour._id.toString()
            : String(tour._id || tour.id)
        }))
      ))
      .catch(() => setAllTours([]))
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
            setSavedTourIds(ids)
          } else {
            setSavedTourIds([])
          }
        }
      } catch {
        setSavedTourIds([])
      }
    }
    fetchSavedTours()
  }, [user])

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
  } = useOptimizedTourFilters(allTours as any)

  const popularSearches = getPopularSearches()

  const handleSearchChange = (query: string) => {
    updateFilter("searchQuery", query)
  }

  const handleSearchSelect = (query: string) => {
    updateFilter("searchQuery", query)
  }

  const isSearching = filters.searchQuery.length > 0 && searchResults.length === 0

  const handleToggleSave = async (tourId: string) => {
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để lưu tour!")
      return
    }
    const isSaved = savedTourIds.includes(tourId)
    const token = await getToken()
    try {
      const res = await fetch(`http://localhost:5000/api/saved-tours/${tourId}`, {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        setSavedTourIds((prev) =>
          isSaved ? prev.filter(id => id !== tourId) : [...prev, tourId]
        )
        toast.success(isSaved ? "Đã bỏ lưu tour!" : "Đã lưu tour vào yêu thích!")
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!")
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!")
    }
  }

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
            {t("common.performance")}
          </Button>
          {activeFilterCount > 0 && (
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
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>
                {t("search.showing")} {filteredTours.length} {t("search.of")} {allTours.length} {t("search.tours")}
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {activeFilterCount} {t("filters.title")}
                </Badge>
              )}
              {filters.searchQuery && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  {t("search.active")}
                </Badge>
              )}
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
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
              {(filteredTours as TourUI[]).map((tour) => {
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
                    reviewCount={tour.reviewCount ?? 0}
                    images={images}
                    duration={durationStr}
                    currentIndex={0}
                    isSaved={savedTourIds.map(String).includes(id)}
                    onPrev={() => {}}
                    onNext={() => {}}
                    onViewDetail={() => window.location.href = `/tours/${id}`}
                  />
                );
              })}
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  )
}
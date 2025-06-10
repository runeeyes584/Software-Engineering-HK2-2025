"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Search, MapPin, Users, Filter, X } from "lucide-react"
import { format } from "date-fns"

interface SearchFilters {
  destination: string
  departureDate: Date | undefined
  returnDate: Date | undefined
  travelers: string
  category: string
  priceRange: string
  duration: string
}

interface TourSearchProps {
  onSearch: (filters: SearchFilters) => void
  className?: string
}

export default function TourSearch({ onSearch, className = "" }: TourSearchProps) {
  const { t } = useLanguage()
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    destination: "",
    departureDate: undefined,
    returnDate: undefined,
    travelers: "2",
    category: "",
    priceRange: "",
    duration: "",
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const updateSearchFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setSearchFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    onSearch(searchFilters)
  }

  const clearFilter = (key: keyof SearchFilters) => {
    setSearchFilters((prev) => ({
      ...prev,
      [key]: key === "departureDate" || key === "returnDate" ? undefined : "",
    }))
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (searchFilters.destination) count++
    if (searchFilters.departureDate) count++
    if (searchFilters.returnDate) count++
    if (searchFilters.travelers !== "2") count++
    if (searchFilters.category) count++
    if (searchFilters.priceRange) count++
    if (searchFilters.duration) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card className={`shadow-lg border-border ${className}`}>
      <CardContent className="p-6">
        {/* Main Search Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Destination Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search.placeholder")}
                className="pl-10 h-12"
                value={searchFilters.destination}
                onChange={(e) => updateSearchFilter("destination", e.target.value)}
              />
              {searchFilters.destination && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearFilter("destination")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Departure Date */}
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal h-12">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchFilters.departureDate ? format(searchFilters.departureDate, "PPP") : "Departure Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={searchFilters.departureDate}
                  onSelect={(date) => updateSearchFilter("departureDate", date)}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date */}
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal h-12">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchFilters.returnDate ? format(searchFilters.returnDate, "PPP") : "Return Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={searchFilters.returnDate}
                  onSelect={(date) => updateSearchFilter("returnDate", date)}
                  initialFocus
                  disabled={(date) =>
                    date < new Date() || (searchFilters.departureDate && date < searchFilters.departureDate)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Travelers */}
          <div className="flex-1">
            <Select value={searchFilters.travelers} onValueChange={(value) => updateSearchFilter("travelers", value)}>
              <SelectTrigger className="h-12">
                <Users className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Travelers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Traveler</SelectItem>
                <SelectItem value="2">2 Travelers</SelectItem>
                <SelectItem value="3">3 Travelers</SelectItem>
                <SelectItem value="4">4 Travelers</SelectItem>
                <SelectItem value="5">5+ Travelers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button className="lg:w-auto w-full h-12 px-8" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchFilters({
                  destination: "",
                  departureDate: undefined,
                  returnDate: undefined,
                  travelers: "2",
                  category: "",
                  priceRange: "",
                  duration: "",
                })
              }}
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={searchFilters.category} onValueChange={(value) => updateSearchFilter("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Beach">Beach</SelectItem>
                    <SelectItem value="City Breaks">City Breaks</SelectItem>
                    <SelectItem value="Wildlife">Wildlife</SelectItem>
                    <SelectItem value="Cruise">Cruise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <Select
                  value={searchFilters.priceRange}
                  onValueChange={(value) => updateSearchFilter("priceRange", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Price</SelectItem>
                    <SelectItem value="0-200">Under $200</SelectItem>
                    <SelectItem value="200-500">$200 - $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1000</SelectItem>
                    <SelectItem value="1000+">$1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Select value={searchFilters.duration} onValueChange={(value) => updateSearchFilter("duration", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Duration</SelectItem>
                    <SelectItem value="1-3">1-3 days</SelectItem>
                    <SelectItem value="4-7">4-7 days</SelectItem>
                    <SelectItem value="8-14">1-2 weeks</SelectItem>
                    <SelectItem value="15+">2+ weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {searchFilters.destination && (
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {searchFilters.destination}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => clearFilter("destination")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {searchFilters.departureDate && (
                    <Badge variant="secondary" className="gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      Departure: {format(searchFilters.departureDate, "MMM dd")}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => clearFilter("departureDate")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {searchFilters.returnDate && (
                    <Badge variant="secondary" className="gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      Return: {format(searchFilters.returnDate, "MMM dd")}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => clearFilter("returnDate")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {searchFilters.travelers !== "2" && (
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {searchFilters.travelers} {searchFilters.travelers === "1" ? "Traveler" : "Travelers"}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => updateSearchFilter("travelers", "2")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {searchFilters.category && (
                    <Badge variant="secondary" className="gap-1">
                      {searchFilters.category}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => clearFilter("category")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {searchFilters.priceRange && (
                    <Badge variant="secondary" className="gap-1">
                      ${searchFilters.priceRange === "1000+" ? "1000+" : searchFilters.priceRange}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => clearFilter("priceRange")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  {searchFilters.duration && (
                    <Badge variant="secondary" className="gap-1">
                      {searchFilters.duration === "15+" ? "2+ weeks" : `${searchFilters.duration} days`}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                        onClick={() => clearFilter("duration")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

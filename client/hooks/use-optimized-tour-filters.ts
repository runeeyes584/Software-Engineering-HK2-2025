"use client"

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { TourSearchEngine, type SearchResult, type Tour } from "@/lib/search-engine"

export interface FilterState {
  searchQuery: string
  priceRange: [number, number]
  durationRange: [number, number]
  categories: string[]
  countries: string[]
  difficulties: string[]
  activities: string[]
  activityLevels: string[]
  amenities: string[]
  accommodationTypes: string[]
  transportationTypes: string[]
  ratingMin: number
  groupSizeMax: number
  languages: string[]
}

interface FilterPerformanceMetrics {
  lastFilterTime: number
  totalTours: number
  filteredTours: number
  searchTime: number
}

const initialFilterState: FilterState = {
  searchQuery: "",
  priceRange: [0, 2000],
  durationRange: [1, 21],
  categories: [],
  countries: [],
  difficulties: [],
  activities: [],
  activityLevels: [],
  amenities: [],
  accommodationTypes: [],
  transportationTypes: [],
  ratingMin: 0,
  groupSizeMax: 50,
  languages: [],
}

export function useOptimizedTourFilters(tours: Tour[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState)
  const [sortBy, setSortBy] = useState<string>("recommended")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<FilterPerformanceMetrics>({
    lastFilterTime: 0,
    totalTours: tours.length,
    filteredTours: tours.length,
    searchTime: 0,
  })

  const searchEngine = useMemo(() => new TourSearchEngine(tours), [tours])
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const isInitializedRef = useRef<boolean>(false)

  // Load saved data only once on mount
  useEffect(() => {
    if (!isInitializedRef.current && typeof window !== "undefined") {
      isInitializedRef.current = true

      try {
        const savedHistory = localStorage.getItem("travel-booking-search-history")
        if (savedHistory) {
          setSearchHistory(JSON.parse(savedHistory))
        }
      } catch (error) {
        console.warn("Failed to load search history:", error)
      }
    }
  }, [])

  // Handle search with debouncing - separate effect to avoid dependency issues
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (filters.searchQuery.trim()) {
        const startTime = performance.now()
        const results = searchEngine.search(filters.searchQuery, 100)
        const endTime = performance.now()

        setSearchResults(results)
        setPerformanceMetrics((prev) => ({
          ...prev,
          searchTime: endTime - startTime,
        }))

        if (filters.searchQuery.length >= 2) {
          const suggestions = searchEngine.getSearchSuggestions(filters.searchQuery)
          setSearchSuggestions(suggestions)
        } else {
          setSearchSuggestions([])
        }
      } else {
        setSearchResults([])
        setSearchSuggestions([])
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [filters.searchQuery, searchEngine])

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleArrayFilter = useCallback(<K extends keyof FilterState>(key: K, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[key] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      return { ...prev, [key]: newArray }
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilterState)
    setSearchResults([])
    setSearchSuggestions([])
  }, [])

  const addToSearchHistory = useCallback((query: string) => {
    if (query.trim()) {
      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item !== query)
        const newHistory = [query, ...filtered].slice(0, 10)

        // Save to localStorage
        try {
          localStorage.setItem("travel-booking-search-history", JSON.stringify(newHistory))
        } catch (error) {
          console.warn("Failed to save search history:", error)
        }

        return newHistory
      })
    }
  }, [])

  // Optimized filtering with memoization
  const filteredTours = useMemo(() => {
    const startTime = performance.now()

    let result: Tour[]

    // Use search results if available
    if (filters.searchQuery && searchResults.length > 0) {
      result = searchResults.map((sr) => sr.tour)
    } else if (filters.searchQuery && searchResults.length === 0) {
      result = []
    } else {
      result = tours
    }

    // Apply filters
    result = result.filter((tour) => {
      // Price range
      if (tour.price < filters.priceRange[0] || tour.price > filters.priceRange[1]) {
        return false
      }

      // Duration range
      if (tour.duration < filters.durationRange[0] || tour.duration > filters.durationRange[1]) {
        return false
      }

      // Rating
      if (tour.rating < filters.ratingMin) {
        return false
      }

      // Categories
      if (filters.categories.length > 0 && !filters.categories.includes(tour.category)) {
        return false
      }

      // Countries
      if (filters.countries.length > 0 && !filters.countries.includes(tour.country)) {
        return false
      }

      // Difficulties
      if (filters.difficulties.length > 0 && tour.difficulty && !filters.difficulties.includes(tour.difficulty)) {
        return false
      }

      // Activities
      if (filters.activities.length > 0) {
        const hasActivity = tour.activities?.some((activity) => filters.activities.includes(activity))
        if (!hasActivity) return false
      }

      // Activity levels
      if (
        filters.activityLevels.length > 0 &&
        tour.activityLevel &&
        !filters.activityLevels.includes(tour.activityLevel)
      ) {
        return false
      }

      // Amenities
      if (filters.amenities.length > 0) {
        const hasAmenity = tour.amenities?.some((amenity) => filters.amenities.includes(amenity))
        if (!hasAmenity) return false
      }

      // Accommodation types
      if (
        filters.accommodationTypes.length > 0 &&
        tour.accommodation &&
        !filters.accommodationTypes.includes(tour.accommodation)
      ) {
        return false
      }

      // Transportation types
      if (filters.transportationTypes.length > 0) {
        const hasTransportation = tour.transportation?.some((transport) =>
          filters.transportationTypes.includes(transport),
        )
        if (!hasTransportation) return false
      }

      // Group size
      if (tour.groupSize && tour.groupSize > filters.groupSizeMax) {
        return false
      }

      // Languages
      if (filters.languages.length > 0) {
        const hasLanguage = tour.languages?.some((language) => filters.languages.includes(language))
        if (!hasLanguage) return false
      }

      return true
    })

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "duration-short":
        result.sort((a, b) => a.duration - b.duration)
        break
      case "duration-long":
        result.sort((a, b) => b.duration - a.duration)
        break
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "relevance":
        if (filters.searchQuery && searchResults.length > 0) {
          const scoreMap = new Map(searchResults.map((sr) => [sr.tour.id, sr.score]))
          result.sort((a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0))
        }
        break
    }

    const endTime = performance.now()
    setPerformanceMetrics((prev) => ({
      ...prev,
      lastFilterTime: endTime - startTime,
      filteredTours: result.length,
      totalTours: tours.length,
    }))

    return result
  }, [tours, filters, sortBy, searchResults])

  // Filter counts - simplified to avoid circular dependencies
  const filterCounts = useMemo(() => {
    const counts = {
      categories: {} as Record<string, number>,
      countries: {} as Record<string, number>,
      difficulties: {} as Record<string, number>,
      activities: {} as Record<string, number>,
      activityLevels: {} as Record<string, number>,
      amenities: {} as Record<string, number>,
      accommodationTypes: {} as Record<string, number>,
      transportationTypes: {} as Record<string, number>,
      languages: {} as Record<string, number>,
    }

    tours.forEach((tour) => {
      counts.categories[tour.category] = (counts.categories[tour.category] || 0) + 1
      counts.countries[tour.country] = (counts.countries[tour.country] || 0) + 1

      if (tour.difficulty) {
        counts.difficulties[tour.difficulty] = (counts.difficulties[tour.difficulty] || 0) + 1
      }

      tour.activities?.forEach((activity) => {
        counts.activities[activity] = (counts.activities[activity] || 0) + 1
      })

      if (tour.activityLevel) {
        counts.activityLevels[tour.activityLevel] = (counts.activityLevels[tour.activityLevel] || 0) + 1
      }

      tour.amenities?.forEach((amenity) => {
        counts.amenities[amenity] = (counts.amenities[amenity] || 0) + 1
      })

      if (tour.accommodation) {
        counts.accommodationTypes[tour.accommodation] = (counts.accommodationTypes[tour.accommodation] || 0) + 1
      }

      tour.transportation?.forEach((transport) => {
        counts.transportationTypes[transport] = (counts.transportationTypes[transport] || 0) + 1
      })

      tour.languages?.forEach((language) => {
        counts.languages[language] = (counts.languages[language] || 0) + 1
      })
    })

    return counts
  }, [tours])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.searchQuery) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) count++
    if (filters.durationRange[0] > 1 || filters.durationRange[1] < 21) count++
    if (filters.categories.length > 0) count++
    if (filters.countries.length > 0) count++
    if (filters.difficulties.length > 0) count++
    if (filters.activities.length > 0) count++
    if (filters.activityLevels.length > 0) count++
    if (filters.amenities.length > 0) count++
    if (filters.accommodationTypes.length > 0) count++
    if (filters.transportationTypes.length > 0) count++
    if (filters.ratingMin > 0) count++
    if (filters.groupSizeMax < 50) count++
    if (filters.languages.length > 0) count++
    return count
  }, [filters])

  const getPopularSearches = useCallback(() => {
    return searchEngine.getPopularSearches()
  }, [searchEngine])

  return {
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
  }
}

export interface TourUI {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  destination?: string;
  location?: string;
  images?: string[];
  image?: string;
  averageRating?: number;
  rating?: number;
  reviewCount?: number;
  duration?: string | number;
  days?: number;
  price?: number;
  // ... các trường khác nếu có
}

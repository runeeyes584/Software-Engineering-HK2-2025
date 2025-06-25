"use client"

import { TourSearchEngine, type SearchResult, type Tour } from "@/lib/search-engine"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export interface FilterState {
  searchQuery: string
  priceRange: [number, number]
  durationRange: [number, number]
  categories: string[]
  groupSizeMax: number
  ratingMin: number
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
  ratingMin: 0,
  groupSizeMax: 50
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

      // Duration range - handle both direct duration property and calculated value from departureOptions
      const duration = typeof tour.duration === 'number' ? 
        tour.duration : 
        (tour.departureOptions && tour.departureOptions.length > 0 ? 
          Math.ceil((new Date(tour.departureOptions[0].returnDate).getTime() - 
                    new Date(tour.departureOptions[0].departureDate).getTime()) / 
                    (1000 * 60 * 60 * 24)) + 1 : 0)

      if (duration < filters.durationRange[0] || duration > filters.durationRange[1]) {
        return false
      }

      // Rating - may not be present in all tours
      if (tour.rating && tour.rating < filters.ratingMin) {
        return false
      }

      // Categories - now an array of ObjectIds in the model
      if (filters.categories.length > 0) {
        // So sánh theo tên danh mục
        const tourCategories = Array.isArray(tour.category)
          ? tour.category.map(cat => (cat && typeof cat === 'object' && cat.name ? cat.name : String(cat)))
          : (tour.category ? [typeof tour.category === 'object' && tour.category.name ? tour.category.name : String(tour.category)] : []);

        if (!tourCategories.some(cat => filters.categories.includes(cat))) {
          return false
        }
      }
      
      // Group size - using maxGuests property from the model
      if (filters.groupSizeMax < (tour.maxGuests || 50)) {
        return false
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
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "duration-short":
        result.sort((a, b) => {
          const durationA = typeof a.duration === 'number' ? a.duration : 0
          const durationB = typeof b.duration === 'number' ? b.duration : 0
          return durationA - durationB
        })
        break
      case "duration-long":
        result.sort((a, b) => {
          const durationA = typeof a.duration === 'number' ? a.duration : 0
          const durationB = typeof b.duration === 'number' ? b.duration : 0
          return durationB - durationA
        })
        break
      case "alphabetical":
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
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
  // Filter counts - updated for category array support
  const filterCounts = useMemo(() => {
    const counts = {
      categories: {} as Record<string, number>
    }
    
    tours.forEach((tour) => {
      // Categories - handle array of categories
      if (Array.isArray(tour.category)) {
        tour.category.forEach((cat) => {
          let catLabel = '';
          if (typeof cat === 'object' && cat !== null && cat.name) {
            catLabel = cat.name;
          } else if (typeof cat === 'string') {
            catLabel = cat;
          }
          if (catLabel) {
            counts.categories[catLabel] = (counts.categories[catLabel] || 0) + 1;
          }
        });
      } else if (tour.category) {
        let catLabel = '';
        if (typeof tour.category === 'object' && tour.category !== null && tour.category.name) {
          catLabel = tour.category.name;
        } else if (typeof tour.category === 'string') {
          catLabel = tour.category;
        }
        if (catLabel) {
          counts.categories[catLabel] = (counts.categories[catLabel] || 0) + 1;
        }
      }
      // Destinations đã bị loại bỏ để hỗ trợ thêm địa điểm mới một cách linh hoạt
    })

    return counts
  }, [tours])
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.searchQuery) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) count++
    if (filters.durationRange[0] > 1 || filters.durationRange[1] < 21) count++
    if (filters.categories.length > 0) count++
    // if (filters.destinations.length > 0) count++ // Destinations đã bị loại bỏ
    if (filters.ratingMin > 0) count++
    if (filters.groupSizeMax < 50) count++
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

// Legacy interface for backward compatibility
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
  category?: string[] | string | any;
  maxGuests?: number;
  availableSlots?: number;
}

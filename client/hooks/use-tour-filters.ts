"use client"

import { useState, useMemo } from "react"

export interface Tour {
  id: number
  title: string
  location: string
  country: string
  image: string
  price: number
  duration: number
  rating: number
  category: string
  description: string
  difficulty?: string
  activities?: string[]
  features?: string[]
  amenities?: string[]
  activityLevel?: "Low" | "Moderate" | "High" | "Extreme"
  accommodation?: string
  transportation?: string[]
  groupSize?: number
  languages?: string[]
  included?: string[]
  excluded?: string[]
}

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

export function useTourFilters(tours: Tour[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState)
  const [sortBy, setSortBy] = useState<string>("recommended")

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = <K extends keyof FilterState>(key: K, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[key] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      return { ...prev, [key]: newArray }
    })
  }

  const resetFilters = () => {
    setFilters(initialFilterState)
  }

  const filteredTours = useMemo(() => {
    const result = tours.filter((tour) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const searchableText = [
          tour.title,
          tour.location,
          tour.country,
          tour.description,
          tour.category,
          ...(tour.activities || []),
          ...(tour.features || []),
        ]
          .join(" ")
          .toLowerCase()

        if (!searchableText.includes(query)) return false
      }

      // Price range filter
      if (tour.price < filters.priceRange[0] || tour.price > filters.priceRange[1]) {
        return false
      }

      // Duration range filter
      if (tour.duration < filters.durationRange[0] || tour.duration > filters.durationRange[1]) {
        return false
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(tour.category)) {
        return false
      }

      // Country filter
      if (filters.countries.length > 0 && !filters.countries.includes(tour.country)) {
        return false
      }

      // Difficulty filter
      if (filters.difficulties.length > 0 && tour.difficulty && !filters.difficulties.includes(tour.difficulty)) {
        return false
      }

      // Activity filter
      if (filters.activities.length > 0) {
        const hasActivity = tour.activities?.some((activity) => filters.activities.includes(activity))
        if (!hasActivity) return false
      }

      // Activity level filter
      if (
        filters.activityLevels.length > 0 &&
        tour.activityLevel &&
        !filters.activityLevels.includes(tour.activityLevel)
      ) {
        return false
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAmenity = tour.amenities?.some((amenity) => filters.amenities.includes(amenity))
        if (!hasAmenity) return false
      }

      // Accommodation type filter
      if (
        filters.accommodationTypes.length > 0 &&
        tour.accommodation &&
        !filters.accommodationTypes.includes(tour.accommodation)
      ) {
        return false
      }

      // Transportation type filter
      if (filters.transportationTypes.length > 0) {
        const hasTransportation = tour.transportation?.some((transport) =>
          filters.transportationTypes.includes(transport),
        )
        if (!hasTransportation) return false
      }

      // Rating filter
      if (tour.rating < filters.ratingMin) {
        return false
      }

      // Group size filter
      if (tour.groupSize && tour.groupSize > filters.groupSizeMax) {
        return false
      }

      // Languages filter
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
      default:
        // Keep original order for "recommended"
        break
    }

    return result
  }, [tours, filters, sortBy])

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
      // Count categories
      counts.categories[tour.category] = (counts.categories[tour.category] || 0) + 1

      // Count countries
      counts.countries[tour.country] = (counts.countries[tour.country] || 0) + 1

      // Count difficulties
      if (tour.difficulty) {
        counts.difficulties[tour.difficulty] = (counts.difficulties[tour.difficulty] || 0) + 1
      }

      // Count activities
      tour.activities?.forEach((activity) => {
        counts.activities[activity] = (counts.activities[activity] || 0) + 1
      })

      // Count activity levels
      if (tour.activityLevel) {
        counts.activityLevels[tour.activityLevel] = (counts.activityLevels[tour.activityLevel] || 0) + 1
      }

      // Count amenities
      tour.amenities?.forEach((amenity) => {
        counts.amenities[amenity] = (counts.amenities[amenity] || 0) + 1
      })

      // Count accommodation types
      if (tour.accommodation) {
        counts.accommodationTypes[tour.accommodation] = (counts.accommodationTypes[tour.accommodation] || 0) + 1
      }

      // Count transportation types
      tour.transportation?.forEach((transport) => {
        counts.transportationTypes[transport] = (counts.transportationTypes[transport] || 0) + 1
      })

      // Count languages
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

  return {
    filters,
    filteredTours,
    filterCounts,
    activeFilterCount,
    sortBy,
    updateFilter,
    toggleArrayFilter,
    resetFilters,
    setSortBy,
  }
}

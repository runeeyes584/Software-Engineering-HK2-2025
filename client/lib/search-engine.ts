export interface SearchResult {
  tour: Tour
  score: number
  matchedFields: string[]
}

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

export class TourSearchEngine {
  private tours: Tour[]
  private searchIndex: Map<string, Set<number>>
  private categoryIndex: Map<string, Set<number>>
  private locationIndex: Map<string, Set<number>>

  constructor(tours: Tour[]) {
    this.tours = tours
    this.searchIndex = new Map()
    this.categoryIndex = new Map()
    this.locationIndex = new Map()
    this.buildIndex()
  }

  private buildIndex() {
    this.tours.forEach((tour, index) => {
      // Build search index
      const searchableText = [
        tour.title,
        tour.location,
        tour.country,
        tour.category,
        tour.description,
        ...(tour.activities || []),
        ...(tour.amenities || []),
        ...(tour.features || []),
      ]
        .join(" ")
        .toLowerCase()

      const words = searchableText.split(/\s+/)
      words.forEach((word) => {
        if (word.length > 2) {
          if (!this.searchIndex.has(word)) {
            this.searchIndex.set(word, new Set())
          }
          this.searchIndex.get(word)!.add(index)
        }
      })

      // Build category index
      if (!this.categoryIndex.has(tour.category)) {
        this.categoryIndex.set(tour.category, new Set())
      }
      this.categoryIndex.get(tour.category)!.add(index)

      // Build location index
      const locationKey = `${tour.location}, ${tour.country}`
      if (!this.locationIndex.has(locationKey)) {
        this.locationIndex.set(locationKey, new Set())
      }
      this.locationIndex.get(locationKey)!.add(index)
    })
  }

  search(query: string, limit = 50): SearchResult[] {
    if (!query.trim()) return []

    const queryWords = query.toLowerCase().split(/\s+/)
    const tourScores = new Map<number, { score: number; matchedFields: Set<string> }>()

    queryWords.forEach((word) => {
      // Exact matches
      if (this.searchIndex.has(word)) {
        this.searchIndex.get(word)!.forEach((tourIndex) => {
          const existing = tourScores.get(tourIndex) || { score: 0, matchedFields: new Set() }
          existing.score += 10
          existing.matchedFields.add("exact")
          tourScores.set(tourIndex, existing)
        })
      }

      // Partial matches
      this.searchIndex.forEach((tourIndices, indexWord) => {
        if (indexWord.includes(word) && indexWord !== word) {
          tourIndices.forEach((tourIndex) => {
            const existing = tourScores.get(tourIndex) || { score: 0, matchedFields: new Set() }
            existing.score += 5
            existing.matchedFields.add("partial")
            tourScores.set(tourIndex, existing)
          })
        }
      })
    })

    const results: SearchResult[] = Array.from(tourScores.entries())
      .map(([tourIndex, { score, matchedFields }]) => ({
        tour: this.tours[tourIndex],
        score,
        matchedFields: Array.from(matchedFields),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return results
  }

  getSearchSuggestions(query: string, limit = 5): string[] {
    if (!query.trim()) return []

    const suggestions = new Set<string>()
    const queryLower = query.toLowerCase()

    // Add location suggestions
    this.locationIndex.forEach((_, location) => {
      if (location.toLowerCase().includes(queryLower)) {
        suggestions.add(location)
      }
    })

    // Add category suggestions
    this.categoryIndex.forEach((_, category) => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.add(category)
      }
    })

    // Add tour title suggestions
    this.tours.forEach((tour) => {
      if (tour.title.toLowerCase().includes(queryLower)) {
        suggestions.add(tour.title)
      }
    })

    return Array.from(suggestions).slice(0, limit)
  }

  getPopularSearches(): string[] {
    const popularCategories = Array.from(this.categoryIndex.keys())
    const popularLocations = Array.from(this.locationIndex.keys()).slice(0, 5)

    return [...popularCategories, ...popularLocations].slice(0, 8)
  }
}

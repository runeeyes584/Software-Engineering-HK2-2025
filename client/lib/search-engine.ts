import Fuse from 'fuse.js'

export interface SearchResult {
  tour: Tour
  score: number
  matchedFields: string[]
}

export interface Tour {
  id: string
  _id?: string
  name: string
  description: string
  images: string[]
  videos?: string[]
  price: number
  duration?: number
  rating?: number
  destination: string
  maxGuests: number
  availableSlots: number
  category: string[] | string | any
  status?: string
  createdBy?: string
  departureOptions?: Array<{
    departureDate: string | Date
    returnDate: string | Date
  }>
  title?: string // For backward compatibility
  groupSize?: number // For backward compatibility
  location?: string // For backward compatibility
  country?: string // For backward compatibility
}

export class TourSearchEngine {
  private tours: Tour[]
  private fuse: Fuse<Tour>
  private categoryIndex: Map<string, Set<number>>
  private locationIndex: Map<string, Set<number>>

  constructor(tours: Tour[]) {
    this.tours = tours
    this.categoryIndex = new Map()
    this.locationIndex = new Map()
      // Cấu hình Fuse.js cho tìm kiếm mờ (fuzzy search) - chỉ tìm theo title và description
    const fuseOptions = {
      includeScore: true,
      threshold: 0.4,
      keys: [
        { name: 'name', weight: 2.5 },  // Tìm theo name
        { name: 'title', weight: 2.5 }, // Tìm theo title (backward compatibility)
        { name: 'description', weight: 1.5 }  // Tìm theo description
      ]
    }
    
    this.fuse = new Fuse(tours, fuseOptions)
    this.buildIndex()
  }

  private buildIndex() {
    this.tours.forEach((tour, index) => {
      // Build category index - handle different category types
      if (Array.isArray(tour.category)) {
        tour.category.forEach(cat => {
          const categoryKey = typeof cat === 'string' ? cat : String(cat)
          if (!this.categoryIndex.has(categoryKey)) {
            this.categoryIndex.set(categoryKey, new Set())
          }
          this.categoryIndex.get(categoryKey)!.add(index)
        })
      } else if (tour.category) {
        const categoryKey = typeof tour.category === 'string' ? tour.category : String(tour.category)
        if (!this.categoryIndex.has(categoryKey)) {
          this.categoryIndex.set(categoryKey, new Set())
        }
        this.categoryIndex.get(categoryKey)!.add(index)
      }

      // Build location index with destination
      const locationKey = tour.destination || (tour.location ? `${tour.location}${tour.country ? `, ${tour.country}` : ''}` : '')
      if (locationKey && !this.locationIndex.has(locationKey)) {
        this.locationIndex.set(locationKey, new Set())
      }
      if (locationKey) {
        this.locationIndex.get(locationKey)!.add(index)
      }
    })
  }

  search(query: string, limit = 50): SearchResult[] {
    if (!query.trim()) return []

    // Sử dụng Fuse.js cho tìm kiếm mờ
    const fuseResults = this.fuse.search(query)
      return fuseResults.map(result => ({
      tour: result.item,
      score: result.score ? 1 - result.score : 1, // Chuyển đổi điểm từ Fuse.js (thấp hơn = tốt hơn) sang điểm của chúng ta (cao hơn = tốt hơn)
      matchedFields: result.matches?.map(match => match.key || 'unknown') || ['fuzzy']
    })).slice(0, limit)
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

    // Thêm gợi ý từ tìm kiếm Fuse.js
    const fuseResults = this.fuse.search(query, { limit: 10 })
    fuseResults.forEach(result => {
      // Add name/title to suggestions
      if (result.item.name) suggestions.add(result.item.name)
      if (result.item.title) suggestions.add(result.item.title)
    })

    return Array.from(suggestions).slice(0, limit)
  }

  getPopularSearches(): string[] {
    const popularCategories = Array.from(this.categoryIndex.keys())
    const popularLocations = Array.from(this.locationIndex.keys()).slice(0, 5)

    return [...popularCategories, ...popularLocations].slice(0, 8)
  }
}

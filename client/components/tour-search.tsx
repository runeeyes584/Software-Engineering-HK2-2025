"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, Loader2, MapPin, Clock, Star } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce" 

interface SearchFilters {
  searchQuery: string
}

interface TourSearchProps {
  onSearch: (filters: SearchFilters) => void
  className?: string
}

interface SearchSuggestion {
  id: string
  name: string
  type: 'tour' | 'destination' | 'category' | 'popular'
  imageUrl?: string
  price?: number
  duration?: string
  rating?: number
}

export default function TourSearch({ onSearch, className = "" }: TourSearchProps) {  const { t } = useLanguage()
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchQuery: "",
  })
  const [showHint, setShowHint] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const debouncedSearch = useDebounce(searchFilters.searchQuery, 300)

  // Lấy gợi ý tìm kiếm từ server
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setSuggestions([])
        return
      }
      
      setIsLoading(true)
      try {        // Gọi API backend để lấy gợi ý tìm kiếm
        const res = await fetch(`http://localhost:5000/api/search/suggestions?query=${encodeURIComponent(debouncedSearch)}`)
        
        if (res.ok) {
          const data = await res.json()
          // Chuyển đổi dữ liệu API thành định dạng gợi ý
          const transformedSuggestions: SearchSuggestion[] = [
            // Tours phù hợp với từ khóa tìm kiếm (chỉ trong tiêu đề và mô tả)
            ...(data.tours || []).map((tour: any) => ({
              id: tour._id,
              name: tour.name,
              type: 'tour',
              imageUrl: tour.images?.[0] || '/placeholder.svg',
              price: tour.price,
              duration: `${tour.duration || ''} ngày`,
              rating: tour.averageRating
            })).slice(0, 3),
            
            // Điểm đến phù hợp
            ...(data.destinations || []).map((dest: any) => ({
              id: `dest-${dest}`,
              name: dest,
              type: 'destination'
            })).slice(0, 2),
            
            // Danh mục phù hợp
            ...(data.categories || []).map((cat: any) => ({
              id: `cat-${cat.name || cat}`,
              name: typeof cat === 'string' ? cat : cat.name,
              type: 'category'
            })).slice(0, 2)
          ]
          
          setSuggestions(transformedSuggestions)
          setShowSuggestions(transformedSuggestions.length > 0)
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSuggestions()
  }, [debouncedSearch])

  // Xử lý click bên ngoài để đóng gợi ý
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  const updateSearchFilter = (value: string) => {
    setSearchFilters({ searchQuery: value })
    // Hiển thị gợi ý về fuzzy search khi người dùng bắt đầu gõ
    setShowHint(value.length > 0)
    setShowSuggestions(value.length >= 2)
    setSelectedIndex(-1)
  }
  const handleSearch = (selectedSuggestion?: SearchSuggestion) => {
    if (selectedSuggestion) {
      setSearchFilters({ searchQuery: selectedSuggestion.name })
      onSearch({ searchQuery: selectedSuggestion.name })
    } else {
      onSearch(searchFilters)
    }
    setShowHint(false)
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return
    
    // Điều hướng bằng phím lên/xuống
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSearch(suggestions[selectedIndex])
      } else {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }
  const clearFilter = () => {
    setSearchFilters({ searchQuery: "" })
    setShowHint(false)
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  // Hiển thị icon theo loại gợi ý
  const renderSuggestionIcon = (type: string) => {
    switch (type) {
      case 'destination':
        return <MapPin className="h-4 w-4 text-blue-500" />
      case 'category':
        return <Clock className="h-4 w-4 text-green-500" />
      case 'popular':
        return <Star className="h-4 w-4 text-yellow-500" />
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card className={`shadow-lg border-border ${className}`}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Destination Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />              <Input
                ref={inputRef}
                placeholder={t("search.placeholder")}
                className="pl-10 h-12"
                value={searchFilters.searchQuery}
                onChange={(e) => updateSearchFilter(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchFilters.searchQuery.length >= 2 && setShowSuggestions(true)}
              />
              
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              
              {searchFilters.searchQuery && !isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={clearFilter}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              
              {/* Gợi ý tìm kiếm */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute w-full mt-1 bg-card rounded-md border shadow-lg z-50"
                >
                  <div className="max-h-[350px] overflow-y-auto p-1">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={suggestion.id}
                        className={`flex items-start gap-3 p-2 rounded-md cursor-pointer ${
                          selectedIndex === index ? 'bg-muted' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleSearch(suggestion)}
                      >
                        {suggestion.imageUrl && suggestion.type === 'tour' ? (
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={suggestion.imageUrl} 
                              alt={suggestion.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            {renderSuggestionIcon(suggestion.type)}
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="font-medium text-sm">{suggestion.name}</div>
                          {suggestion.type === 'tour' && (
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              {suggestion.price && (
                                <div>{new Intl.NumberFormat('vi-VN', { 
                                  style: 'currency', 
                                  currency: 'VND' 
                                }).format(suggestion.price)}</div>
                              )}
                              {suggestion.duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {suggestion.duration}
                                </div>
                              )}
                              {suggestion.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {suggestion.rating.toFixed(1)}
                                </div>
                              )}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {suggestion.type === 'destination' && 'Điểm đến'}
                            {suggestion.type === 'category' && 'Danh mục'}
                            {suggestion.type === 'popular' && 'Phổ biến'}
                            {suggestion.type === 'tour' && 'Tour du lịch'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Thông báo fuzzy search */}
              {showHint && !showSuggestions && (
                <div className="absolute w-full mt-1 bg-card rounded-md border p-2 text-xs text-muted-foreground shadow-sm">
                  <p>Đang sử dụng tìm kiếm thông minh (Fuzzy Search)</p>
                  <p>Kết quả sẽ bao gồm các tour có tên tương tự, kể cả khi gõ sai chính tả</p>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <Button className="h-12 px-8" onClick={() => handleSearch()}>
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useLanguage } from "@/components/language-provider-fixed"
import OptimizedSearch from "@/components/optimized-search"
import TourCard from "@/components/tour-card"
import TourFiltersSimplified from "@/components/tour-filters-simplified"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOptimizedTourFilters } from "@/hooks/use-optimized-tour-filters"
import { Tour } from "@/lib/search-engine"
import { useAuth, useUser } from "@clerk/nextjs"
import { Filter, Loader2, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ToursPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [allTours, setAllTours] = useState<Tour[]>([])
  const [allCategories, setAllCategories] = useState<Record<string, string>>({}) // Map of category IDs to names
  const [savedTourIds, setSavedTourIds] = useState<string[]>([])
  const { getToken } = useAuth()
  const { user } = useUser()
  const [currentPage, setCurrentPage] = useState(1);
  const TOURS_PER_PAGE = 6;
  const [tourImageIndexes, setTourImageIndexes] = useState<Record<string, number>>({});

  // Fetch all categories
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const categoriesMap: Record<string, string> = {}
        data.forEach((cat: any) => {
          const id = typeof cat._id === 'object' ? cat._id.toString() : String(cat._id)
          categoriesMap[id] = cat.name || ''
        })
        setAllCategories(categoriesMap)
      })
      .catch((err) => console.error("Failed to fetch categories:", err))
  }, [])

  // Fetch all tours
  useEffect(() => {
    fetch("http://localhost:5000/api/tours")
      .then((res) => res.json())
      .then((data) => {
        setAllTours(
          data.map((tour: any) => ({
            ...tour,
            id: tour._id?.toString() || tour.id,
            name: tour.name || tour.title || '',
            // Giữ nguyên category là object như API trả về
          }))
        )
        const initialIndexes: Record<string, number> = {};
        data.forEach((tour: any) => {
          const id = tour._id && typeof tour._id === 'object' ? tour._id.toString() : String(tour._id || tour.id);
          initialIndexes[id] = 0;
        });
        setTourImageIndexes(initialIndexes);
      })
      .catch(() => setAllTours([]))
  }, [allCategories]) // Re-fetch tours when categories are loaded to translate IDs to names

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
    fetchSavedTours()  }, [user])

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

  const totalPages = Math.ceil(filteredTours.length / TOURS_PER_PAGE);
  const paginatedTours = filteredTours.slice((currentPage - 1) * TOURS_PER_PAGE, currentPage * TOURS_PER_PAGE);
  // Lấy các tìm kiếm phổ biến và chuyển đổi định dạng để phù hợp với component
  const rawPopularSearches = getPopularSearches()
  const popularSearches = rawPopularSearches.map(search => {
    return typeof search === 'string' ? { name: search } : search
  })  // State cho tìm kiếm từ server
  const [serverSearchResults, setServerSearchResults] = useState<any[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [serverSearchParams, setServerSearchParams] = useState({
    query: '',
    category: '',
    destination: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });
  // Kiểm tra và đọc các tham số URL khi trang được load
  useEffect(() => {
    const searchParam = searchParams.get('query') || searchParams.get('search'); // hỗ trợ cả hai tham số
    const categoryParam = searchParams.get('category');
    const destinationParam = searchParams.get('destination');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const sortByParam = searchParams.get('sortBy') || 'newest';
      const newSearchParams = {
      query: searchParam || '',
      category: categoryParam || '',
      destination: destinationParam || '',
      minPrice: minPriceParam || '',
      maxPrice: maxPriceParam || '',
      sortBy: sortByParam
    };
    
    setServerSearchParams(newSearchParams);
    
    if (searchParam) {
      // Thêm vào lịch sử tìm kiếm
      addToSearchHistory(searchParam);
      // Cũng cập nhật filter phía client để tương thích với cả hai cách tìm kiếm
      updateFilter("searchQuery", searchParam);
    }
      // Gọi API tìm kiếm từ server
    fetchSearchResults(newSearchParams);
  }, [searchParams.toString(), addToSearchHistory, updateFilter]);

  // Hàm gọi API tìm kiếm
  const fetchSearchResults = async (params: any) => {
    setIsLoadingSearch(true);
    try {
      // Xây dựng URL với các tham số tìm kiếm
      const searchUrl = new URLSearchParams();
      if (params.query) searchUrl.append('query', params.query);
      if (params.category) searchUrl.append('category', params.category);
      if (params.destination) searchUrl.append('destination', params.destination);
      if (params.minPrice) searchUrl.append('minPrice', params.minPrice);
      if (params.maxPrice) searchUrl.append('maxPrice', params.maxPrice);
      if (params.sortBy) searchUrl.append('sortBy', params.sortBy);
      
      // Thêm tham số phân trang
      const pageParam = params.page || 1;
      searchUrl.append('page', pageParam.toString());
      searchUrl.append('limit', TOURS_PER_PAGE.toString());
      
      const response = await fetch(`http://localhost:5000/api/search?${searchUrl.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setServerSearchResults(data.tours || []);
        setPagination(data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalCount: 0
        });
      } else {
        console.error("Lỗi khi tìm kiếm tours từ API");
      }
    } catch (error) {
      console.error("Lỗi kết nối tới API:", error);
    } finally {
      setIsLoadingSearch(false);
    }
  };
    // Xác định danh sách tour hiển thị - ưu tiên kết quả từ server nếu có
  const displayTours = serverSearchParams.query || serverSearchParams.category || serverSearchParams.destination ? 
    serverSearchResults : filteredTours;
  
  // Tính toán phân trang cho kết quả
  const currentPageTours = serverSearchParams.query || serverSearchParams.category || serverSearchParams.destination ?
    displayTours : // Kết quả từ server đã được phân trang
    displayTours.slice((currentPage - 1) * TOURS_PER_PAGE, currentPage * TOURS_PER_PAGE);
  
  // Cờ để biết có đang tìm kiếm không
  const hasActiveSearch = (serverSearchParams.query && serverSearchParams.query.length > 0) || 
                         filters.searchQuery.length > 0;  const handleSearchChange = (query: string) => {
    // Cập nhật filter local
    updateFilter("searchQuery", query)
    
    // Nếu xóa trắng truy vấn, hãy cập nhật URL và gọi API để lấy lại tất cả tour
    if (!query.trim()) {
      const queryParams = new URLSearchParams(searchParams.toString())
      queryParams.delete("query")
      
      const newUrl = `${window.location.pathname}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      window.history.pushState(null, '', newUrl)
      
      setServerSearchParams({...serverSearchParams, query: ''})
      fetchSearchResults({...serverSearchParams, query: ''})
    }
  }
    const handleSearchSelect = (query: string) => {
    updateFilter("searchQuery", query)
    
    // Cập nhật URL và search params
    const queryParams = new URLSearchParams(searchParams.toString())
    queryParams.set("query", query)
    
    // Cập nhật URL mà không refresh trang
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`
    window.history.pushState(null, '', newUrl)
    
    // Cập nhật state và gọi API tìm kiếm
    setServerSearchParams({...serverSearchParams, query})
    fetchSearchResults({...serverSearchParams, query})
  }

  const noResultsFound = hasActiveSearch && currentPageTours.length === 0 && !isLoadingSearch

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

  const handleNextImage = (tourId: string, imageCount: number) => {
    setTourImageIndexes(prev => ({
      ...prev,
      [tourId]: (prev[tourId] + 1) % imageCount,
    }));
  };

  const handlePrevImage = (tourId: string, imageCount: number) => {
    setTourImageIndexes(prev => ({
      ...prev,
      [tourId]: (prev[tourId] - 1 + imageCount) % imageCount,
    }));
  };

  return (
    <div className="py-8">      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("nav.tours")}</h1>
        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="lg:hidden flex items-center gap-1"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter className="h-4 w-4" />
            {t("filters.title")}
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          
          {/* Desktop Badge */}
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="hidden lg:flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {activeFilterCount} {t("filters.active")}
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-8">
        <OptimizedSearch
          searchQuery={filters.searchQuery}
          searchSuggestions={searchSuggestions}
          searchHistory={searchHistory}
          popularSearches={popularSearches}
          onSearchChange={handleSearchChange}
          onSearchSelect={handleSearchSelect}
          onAddToHistory={addToSearchHistory}
          isSearching={isLoadingSearch}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <TourFiltersSimplified
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
            <div className="text-sm text-muted-foreground flex items-center gap-2">              <span>
                {t("search.showing")} {currentPageTours.length} 
                {serverSearchParams.query ? 
                  ` ${t("search.of")} ${pagination.totalCount} ${t("search.tours")}` :
                  ` ${t("search.of")} ${allTours.length} ${t("search.tours")}`}
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {activeFilterCount} {t("filters.title")}
                </Badge>
              )}              {hasActiveSearch && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  {t("search.active")}: {serverSearchParams.query || filters.searchQuery}
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
            <>              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoadingSearch && (
                  <div className="col-span-3 py-20 flex flex-col items-center justify-center text-center">
                    <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary/70" />
                    <h3 className="text-lg font-medium mb-1">{t("search.searching")}</h3>
                    <p className="text-sm text-muted-foreground">{t("search.searchingMessage")}</p>
                  </div>
                )}
                
                {!isLoadingSearch && currentPageTours.map((tour) => {
                  const tItem = tour as any;
                  const id = String(tItem._id || tItem.id || "");
                  const images = Array.isArray(tItem.images) && tItem.images.length > 0
                    ? tItem.images
                    : (tItem.image ? [tItem.image] : ["/placeholder.svg"]);
                  const durationStr = typeof tItem.duration === "string"
                    ? tItem.duration
                    : (typeof tItem.duration === "number"
                      ? `${tItem.duration} ngày`
                      : (typeof tItem.days === "number" ? `${tItem.days} ngày` : ""));
                  // Map category sang tên khi render
                  const categoryNames = Array.isArray(tItem.category)
                    ? tItem.category.map((cat: any) => cat && cat.name ? cat.name : '').filter(Boolean)
                    : [];
                  // Log debug
                  console.log('DEBUG tour:', tItem.name || tItem.title, 'category raw:', tItem.category, 'categoryNames:', categoryNames);
                  return (
                    <TourCard
                      key={id}
                      id={id}
                      name={tItem.name || tItem.title || ""}
                      destination={tItem.destination || tItem.location || ""}
                      price={tItem.price ?? 0}
                      averageRating={typeof tItem.averageRating === "number" && !isNaN(tItem.averageRating)
                        ? tItem.averageRating
                        : (typeof tItem.rating === "number" && !isNaN(tItem.rating) ? tItem.rating : 0)}
                      reviewCount={tItem.reviewCount ?? 0}
                      images={images}
                      duration={durationStr}
                      currentIndex={tourImageIndexes[id] || 0}
                      isSaved={savedTourIds.map(String).includes(id)}
                      onPrev={() => handlePrevImage(id, images.length)}
                      onNext={() => handleNextImage(id, images.length)}
                      onViewDetail={() => window.location.href = `/tours/${id}`}
                      category={categoryNames}
                    />
                  );
                })}
              </div>              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={e => { 
                        e.preventDefault();                        if (hasActiveSearch) {
                          // Sử dụng API search với trang trước
                          const newPage = Math.max(1, pagination.currentPage - 1);
                          const newParams = {...serverSearchParams, page: newPage};
                          fetchSearchResults(newParams);
                        } else {
                          // Phân trang client-side
                          setCurrentPage(p => Math.max(1, p - 1));
                        }
                      }}
                      aria-disabled={hasActiveSearch ? pagination.currentPage === 1 : currentPage === 1}
                    >
                      {t('common.paginationPrevious')}
                    </PaginationPrevious>
                  </PaginationItem>
                  
                  {/* Hiển thị số trang dựa trên nguồn dữ liệu */}
                  {Array.from({ length: hasActiveSearch ? pagination.totalPages : totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={hasActiveSearch ? pagination.currentPage === i + 1 : currentPage === i + 1}
                        onClick={e => { 
                          e.preventDefault();                          if (hasActiveSearch) {
                            // Sử dụng API search cho trang được chọn
                            const newPage = i + 1;
                            const newParams = {...serverSearchParams, page: newPage};
                            fetchSearchResults(newParams);
                          } else {
                            // Phân trang client-side
                            setCurrentPage(i + 1);
                          }
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={e => { 
                        e.preventDefault();                        if (hasActiveSearch) {
                          // Sử dụng API search với trang tiếp theo
                          const newPage = Math.min(pagination.totalPages, pagination.currentPage + 1);
                          const newParams = {...serverSearchParams, page: newPage};
                          fetchSearchResults(newParams);
                        } else {
                          // Phân trang client-side
                          setCurrentPage(p => Math.min(totalPages, p + 1));
                        }
                      }}
                      aria-disabled={hasActiveSearch ? pagination.currentPage === pagination.totalPages : currentPage === totalPages}
                    >
                      {t('common.paginationNext')}
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>          ) : (
              <div className="flex flex-col items-center justify-center min-h-[320px] py-12 text-center space-y-6">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-2xl font-semibold text-muted-foreground mb-2">{t("search.noToursFound")}</h3>
                <p className="text-base text-muted-foreground mb-4">
                  {hasActiveSearch
                    ? t("search.noToursMatchSearch", { query: serverSearchParams.query || filters.searchQuery })
                    : t("search.noToursMatchFilters")}
                </p>
                <p className="text-sm text-muted-foreground mb-4">{t("search.suggestionReduceFilters") || "Hãy thử giảm điều kiện lọc hoặc xóa tất cả bộ lọc để xem thêm tour."}</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" onClick={resetFilters}>
                    {t("filters.clearAll")}
                  </Button>
                  {popularSearches.filter(s => typeof s === 'string' || (s && typeof s.name === 'string')).length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                      <span className="text-sm text-muted-foreground">{t("search.try")}:</span>
                      {popularSearches.slice(0, 3).map((search, index) => {
                        const label = typeof search === 'string' ? search : (search && typeof search.name === 'string' ? search.name : null);
                        if (!label) return null;
                        return (
                          <Button key={index} variant="ghost" size="sm" onClick={() => handleSearchSelect(label)}>
                            {label}
                          </Button>
                        );
                      })}
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
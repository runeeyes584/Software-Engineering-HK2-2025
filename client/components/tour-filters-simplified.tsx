"use client"

import { useLanguage } from "@/components/language-provider-fixed"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { FilterState } from "@/hooks/use-optimized-tour-filters"
import { X } from "lucide-react"
import { useMemo } from "react"

interface TourFiltersProps {
  filters: FilterState
  filterCounts: {
    categories: Record<string, number>
  }
  activeFilterCount: number
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  onToggleArrayFilter: <K extends keyof FilterState>(key: K, value: string) => void
  onResetFilters: () => void
  showMobileFilters: boolean
  onToggleMobileFilters: () => void
}

export default function TourFiltersSimplified({
  filters,
  filterCounts,
  activeFilterCount,
  onUpdateFilter,
  onToggleArrayFilter,
  onResetFilters,
  showMobileFilters,
  onToggleMobileFilters,
}: TourFiltersProps) {
  const { t } = useLanguage()

  const removeFilter = (key: keyof FilterState, value?: string) => {
    if (key === "searchQuery") {
      onUpdateFilter(key, "")
    } else if (key === "priceRange") {
      onUpdateFilter(key, [0, 2000])
    } else if (key === "durationRange") {
      onUpdateFilter(key, [1, 21])
    } else if (key === "ratingMin") {
      onUpdateFilter(key, 0)
    } else if (key === "groupSizeMax") {
      onUpdateFilter(key, 50)
    } else if (value && Array.isArray(filters[key])) {
      onToggleArrayFilter(key, value)
    }
  }

  const getActiveFilters = useMemo(() => {
    const active: Array<{ key: keyof FilterState; value?: string; label: string }> = []

    // Search query
    if (filters.searchQuery) {
      active.push({ key: "searchQuery", label: `${t("filters.search")}: ${filters.searchQuery}` })
    }

    // Price range
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) {
      active.push({
        key: "priceRange",
        label: `${t("filters.priceRange")}: ${filters.priceRange[0].toLocaleString("vi-VN")}đ - ${filters.priceRange[1].toLocaleString("vi-VN")}đ`,
      })
    }

    // Duration range
    if (filters.durationRange[0] > 1 || filters.durationRange[1] < 21) {
      active.push({
        key: "durationRange",
        label: `${t("filters.durationRange")}: ${filters.durationRange[0]} - ${filters.durationRange[1]} ${t("common.days")}`,
      })
    }

    // Rating minimum
    if (filters.ratingMin > 0) {
      active.push({
        key: "ratingMin",
        label: `${t("filters.ratingMin")}: ${filters.ratingMin}+`,
      })
    }

    // Group size maximum
    if (filters.groupSizeMax < 50) {
      active.push({
        key: "groupSizeMax",
        label: `${t("filters.groupSizeMax")}: ${filters.groupSizeMax}`,
      })
    }

    // Categories
    if (filters.categories.length > 0) {
      filters.categories.forEach(category => {
        active.push({
          key: "categories",
          value: category,
          label: `${t("filters.category")}: ${category}`
        });
      });
    }

    // Destinations đã được loại bỏ

    return active;
  }, [filters, t]);

  return (
    <>
      {/* Mobile Filters */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden ${
          showMobileFilters ? "block" : "hidden"
        }`}
      >
        <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background border-r p-6 overflow-y-auto shadow-lg">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-background pt-2 pb-3 border-b">
            <h2 className="font-semibold text-lg">{t("filters.title")}</h2>
            <Button variant="ghost" size="icon" onClick={onToggleMobileFilters}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-8">
            {/* Mobile Price Range Filter */}
            <div className="space-y-4 w-full border-b pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-md">{t("filters.priceRange")}</h3>
              </div>
              <div className="px-2">
                <div className="flex items-center justify-between mb-2 text-sm font-medium text-muted-foreground">
                  <span>Tối thiểu</span>
                  <span>Tối đa</span>
                </div>
                <Slider
                  min={0}
                  max={2000}
                  step={100}
                  value={filters.priceRange}
                  onValueChange={(value) => onUpdateFilter("priceRange", value as [number, number])}
                  className="my-1"
                />
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="font-semibold">{filters.priceRange[0].toLocaleString("vi-VN")}đ</span>
                  <span className="font-semibold">{filters.priceRange[1].toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            </div>

            {/* Mobile Duration Range Filter */}
            <div className="space-y-4 w-full border-b pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-md">{t("filters.durationRange")}</h3>
              </div>
              <div className="px-2">
                <div className="flex items-center justify-between mb-2 text-sm font-medium text-muted-foreground">
                  <span>Ngắn nhất</span>
                  <span>Dài nhất</span>
                </div>
                <Slider
                  min={1}
                  max={21}
                  step={1}
                  value={filters.durationRange}
                  onValueChange={(value) => onUpdateFilter("durationRange", value as [number, number])}
                  className="my-1"
                />
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="font-semibold">
                    {filters.durationRange[0]} {t("common.days")}
                  </span>
                  <span className="font-semibold">
                    {filters.durationRange[1]} {t("common.days")}
                  </span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4 w-full border-b pb-4">
              <h3 className="font-medium text-md flex items-center justify-between">
                <span>{t("filters.category")}</span>
                {filters.categories.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{filters.categories.length}</Badge>
                )}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {Object.entries(filterCounts.categories || {})
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between py-1 hover:bg-muted/40 px-1 rounded-sm">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-cat-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => onToggleArrayFilter("categories", category)}
                        />
                        <Label htmlFor={`mobile-cat-${category}`} className="cursor-pointer">
                          {category}
                        </Label>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">({count as number})</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Destinations đã được loại bỏ để hỗ trợ thêm địa điểm mới một cách linh hoạt */}

            {/* Rating Min */}
            <div className="space-y-4 w-full border-b pb-4">
              <h3 className="font-medium text-md flex items-center gap-1">
                {t("filters.ratingMin")}
                {filters.ratingMin > 0 && (
                  <Badge variant="secondary" className="ml-2">{filters.ratingMin}+</Badge>
                )}
              </h3>
              <div className="px-2">
                <div className="flex items-center justify-between mb-2 text-sm font-medium text-muted-foreground">
                  <span>Không lọc</span>
                  <span>Cao nhất</span>
                </div>
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  value={[filters.ratingMin]}
                  onValueChange={(value) => onUpdateFilter("ratingMin", value[0])}
                  className="my-1"
                />
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="font-semibold">{filters.ratingMin}+</span>
                  <span className="font-semibold">5.0</span>
                </div>
              </div>
            </div>

            {/* Group Size Max */}
            <div className="space-y-4 w-full border-b pb-4">
              <h3 className="font-medium text-md flex items-center gap-1">
                {t("filters.groupSizeMax")}
                {filters.groupSizeMax < 50 && (
                  <Badge variant="secondary" className="ml-2">{filters.groupSizeMax}</Badge>
                )}
              </h3>
              <div className="px-2">
                <div className="flex items-center justify-between mb-2 text-sm font-medium text-muted-foreground">
                  <span>Nhỏ nhất</span>
                  <span>Không giới hạn</span>
                </div>
                <Slider
                  min={1}
                  max={50}
                  step={1}
                  value={[filters.groupSizeMax]}
                  onValueChange={(value) => onUpdateFilter("groupSizeMax", value[0])}
                  className="my-1"
                />
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="font-semibold">1</span>
                  <span className="font-semibold">{filters.groupSizeMax}</span>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <Button onClick={onResetFilters} variant="outline" className="w-full mt-2">
              {t("filters.clearAll")}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Filters */}
      <Card className="hidden lg:block sticky top-20 w-72 shadow-md border-2 border-muted">
        <CardHeader className="pb-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{t("filters.title")}</CardTitle>
            <Button onClick={onResetFilters} variant="ghost" size="sm" className="h-8">
              {t("filters.clearAll")}
            </Button>
          </div>
          
          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              {getActiveFilters.map((filter, i) => (
                <Badge key={i} variant="outline" className="flex items-center justify-between gap-1 py-1 px-2 w-full">
                  <span className="truncate">{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.key, filter.value)}
                    className="rounded-full hover:bg-muted flex-shrink-0"
                    aria-label="Remove filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0 flex flex-col space-y-8">
          {/* Price Range - Fixed not collapsible */}
          <div className="space-y-4 w-full border-b pb-4">
            <h3 className="font-medium text-md flex items-center gap-2">
              {t("filters.priceRange")}
            </h3>
            <div className="px-2">
              <div className="flex items-center justify-between mb-2 text-sm font-medium text-muted-foreground">
                <span>Tối thiểu</span>
                <span>Tối đa</span>
              </div>
              <Slider
                min={0}
                max={2000}
                step={100}
                value={filters.priceRange}
                onValueChange={(value) => onUpdateFilter("priceRange", value as [number, number])}
                className="my-1"
              />
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="font-semibold">{filters.priceRange[0].toLocaleString("vi-VN")}đ</span>
                <span className="font-semibold">{filters.priceRange[1].toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>

          {/* Duration Range - Fixed not collapsible */}
          <div className="space-y-4 w-full border-b pb-4">
            <h3 className="font-medium text-md flex items-center gap-2">
              {t("filters.durationRange")}
            </h3>
            <div className="px-2">
              <div className="flex items-center justify-between mb-2 text-sm font-medium text-muted-foreground">
                <span>Ngắn nhất</span>
                <span>Dài nhất</span>
              </div>
              <Slider
                min={1}
                max={21}
                step={1}
                value={filters.durationRange}
                onValueChange={(value) => onUpdateFilter("durationRange", value as [number, number])}
                className="my-1"
              />
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="font-semibold">
                  {filters.durationRange[0]} {t("common.days")}
                </span>
                <span className="font-semibold">
                  {filters.durationRange[1]} {t("common.days")}
                </span>
              </div>
            </div>
          </div>

          {/* Categories - Fixed not collapsible */}
          <div className="space-y-4 w-full border-b pb-4">
            <h3 className="font-medium text-md flex items-center justify-between">
              <span>{t("filters.category")}</span>
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-2">{filters.categories.length}</Badge>
              )}
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {Object.entries(filterCounts.categories || {})
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between py-1 hover:bg-muted/40 px-1 rounded-sm">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => onToggleArrayFilter("categories", category)}
                      />
                      <Label htmlFor={`cat-${category}`} className="cursor-pointer text-sm">
                        {category}
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">({count as number})</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Destinations đã được loại bỏ để hỗ trợ thêm địa điểm mới một cách linh hoạt */}

          {/* Rating Min - Fixed not collapsible */}
          <div className="space-y-4 w-full border-b pb-4">
            <h3 className="font-medium text-md flex items-center gap-1">
              {t("filters.ratingMin")}
              {filters.ratingMin > 0 && (
                <Badge variant="secondary" className="ml-2">{filters.ratingMin}+</Badge>
              )}
            </h3>
            <div className="px-2">
              <div className="flex items-center justify-between mb-2 text-sm font-medium text-muted-foreground">
                <span>Không lọc</span>
                <span>Cao nhất</span>
              </div>
              <Slider
                min={0}
                max={5}
                step={0.5}
                value={[filters.ratingMin]}
                onValueChange={(value) => onUpdateFilter("ratingMin", value[0])}
                className="my-1"
              />
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="font-semibold">{filters.ratingMin}+</span>
                <span className="font-semibold">5.0</span>
              </div>
            </div>
          </div>

          {/* Group Size Max - Fixed not collapsible */}
          <div className="space-y-4 w-full">
            <h3 className="font-medium text-md flex items-center gap-1">
              {t("filters.groupSizeMax")}
              {filters.groupSizeMax < 50 && (
                <Badge variant="secondary" className="ml-2">{filters.groupSizeMax}</Badge>
              )}
            </h3>
            <div className="px-2">
              <div className="flex items-center justify-between mb-2 text-sm font-medium text-muted-foreground">
                <span>Nhỏ nhất</span>
                <span>Không giới hạn</span>
              </div>
              <Slider
                min={1}
                max={50}
                step={1}
                value={[filters.groupSizeMax]}
                onValueChange={(value) => onUpdateFilter("groupSizeMax", value[0])}
                className="my-1"
              />
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="font-semibold">1</span>
                <span className="font-semibold">{filters.groupSizeMax}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

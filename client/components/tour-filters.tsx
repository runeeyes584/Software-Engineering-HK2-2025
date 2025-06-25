"use client"

import { useLanguage } from "@/components/language-provider-fixed"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { FilterState } from "@/hooks/use-optimized-tour-filters"
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react"
import { useState } from "react"

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

export default function TourFilters({
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    duration: true,
    categories: true,
    rating: true,
    groupSize: true,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

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

  const getActiveFilters = () => {
    const active: Array<{ key: keyof FilterState; value: string; label: string }> = []

    if (filters.searchQuery) {
      active.push({ key: "searchQuery", value: "", label: `${t("search.button")}: ${filters.searchQuery}` })
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) {
      active.push({
        key: "priceRange",
        value: "",
        label: `${t("filters.price")}: ${t("filters.currency")}${filters.priceRange[0]} - ${t("filters.currency")}${filters.priceRange[1]}`,
      })
    }

    if (filters.durationRange[0] > 1 || filters.durationRange[1] < 21) {
      active.push({
        key: "durationRange",
        value: "",
        label: `${t("filters.duration")}: ${filters.durationRange[0]} - ${filters.durationRange[1]} ${t("filters.days")}`,
      })
    }

    if (filters.ratingMin > 0) {
      active.push({
        key: "ratingMin",
        value: "",
        label: `${t("filters.rating")}: ${filters.ratingMin}+ ${t("filters.stars")}`,
      })
    }

    if (filters.groupSizeMax < 50) {
      active.push({
        key: "groupSizeMax",
        value: "",
        label: `${t("filters.groupSize")}: ≤${filters.groupSizeMax} ${t("filters.people")}`,
      })    }
      // Array filters with translations
    const arrayFilters: Array<{ key: keyof FilterState; labelKey: string }> = [
      { key: "categories", labelKey: "filters.category" }
    ]

    arrayFilters.forEach(({ key, labelKey }) => {
      const values = filters[key] as string[]
      values.forEach((value) => {
        // Try to get translated value, fallback to original value
        const translatedValue = getTranslatedFilterValue(key, value)
        active.push({ key, value, label: `${t(labelKey)}: ${translatedValue}` })
      })
    })

    return active
  }

  const getTranslatedFilterValue = (filterKey: keyof FilterState, value: string): string => {
    // Map filter keys to translation prefixes
    const translationMap: Record<string, string> = {
      categories: "categories",
      countries: "countries",
      difficulties: "tours.difficulty",
      activityLevels: "tours.activityLevel",
      amenities: "amenities",
      accommodationTypes: "accommodation",
      transportationTypes: "transport",
      languages: "languages",
      activities: "activities",
    }

    const prefix = translationMap[filterKey]
    if (prefix) {
      // Convert value to lowercase and replace spaces with camelCase for translation key
      const translationKey = `${prefix}.${value.toLowerCase().replace(/\s+/g, "")}`
      const translated = t(translationKey)
      // If translation exists (not same as key), return it, otherwise return original value
      return translated !== translationKey ? translated : value
    }

    return value
  }

  const activeFilters = getActiveFilters()

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button variant="outline" onClick={onToggleMobileFilters} className="w-full flex items-center justify-center">
          <Filter className="mr-2 h-4 w-4" />
          {showMobileFilters ? t("filters.hideFilters") : t("filters.showFilters")}
          {activeFilterCount > 0 && <Badge className="ml-2">{activeFilterCount}</Badge>}
        </Button>
      </div>

      {/* Filters Sidebar */}
      <aside className={`${showMobileFilters ? "block" : "hidden"} lg:block lg:w-80`}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {t("filters.title")}
              </CardTitle>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={onResetFilters}>
                  {t("filters.clearAll")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t("filters.activeFilters")}</Label>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <span className="text-xs">{filter.label}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 w-4 h-4"
                        onClick={() => removeFilter(filter.key, filter.value)}
                        aria-label={`${t("filters.remove")} ${filter.label}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <Label>{t("filters.priceRange")}</Label>
                  {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {t("filters.currency")}
                    {filters.priceRange[0]}
                  </span>
                  <span>
                    {t("filters.currency")}
                    {filters.priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => onUpdateFilter("priceRange", value as [number, number])}
                  max={2000}
                  step={50}
                  className="w-full"
                  aria-label={t("filters.priceRange")}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* Duration Range */}
            <Collapsible open={openSections.duration} onOpenChange={() => toggleSection("duration")}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <Label>
                    {t("filters.duration")} ({t("filters.days")})
                  </Label>
                  {openSections.duration ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {filters.durationRange[0]} {t("filters.days")}
                  </span>
                  <span>
                    {filters.durationRange[1]} {t("filters.days")}
                  </span>
                </div>
                <Slider
                  value={filters.durationRange}
                  onValueChange={(value) => onUpdateFilter("durationRange", value as [number, number])}
                  min={1}
                  max={21}
                  step={1}
                  className="w-full"
                  aria-label={t("filters.durationRange")}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* Categories */}
            <Collapsible open={openSections.categories} onOpenChange={() => toggleSection("categories")}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <Label>{t("filters.categories")}</Label>
                  {openSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {Object.entries(filterCounts.categories).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => onToggleArrayFilter("categories", category)}
                      />
                      <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                        {getTranslatedFilterValue("categories", category)}
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground">({count})</span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>            {/* Countries - Commented out as not in current FilterState
            <Collapsible open={openSections.countries} onOpenChange={() => toggleSection("countries")}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <Label>{t("filters.countries")}</Label>
                  {openSections.countries ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {Object.entries(filterCounts.countries || {}).map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`country-${country}`}
                        checked={filters.countries?.includes(country) || false}
                        onCheckedChange={() => onToggleArrayFilter("countries", country)}
                      />
                      <Label htmlFor={`country-${country}`} className="text-sm font-normal">
                        {getTranslatedFilterValue("countries", country)}
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground">({count})</span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
            */}            {/* Difficulties - Commented out as not in current FilterState
            <Collapsible open={openSections.difficulties} onOpenChange={() => toggleSection("difficulties")}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <Label>{t("filters.difficulties")}</Label>
                  {openSections.difficulties ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {Object.entries(filterCounts.difficulties || {}).map(([difficulty, count]) => (
                  <div key={difficulty} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`difficulty-${difficulty}`}
                        checked={filters.difficulties?.includes(difficulty) || false}
                        onCheckedChange={() => onToggleArrayFilter("difficulties", difficulty)}
                      />
                      <Label htmlFor={`difficulty-${difficulty}`} className="text-sm font-normal">
                        {getTranslatedFilterValue("difficulties", difficulty)}
                      </Label>
                    </div>
                    <span className="text-xs text-muted-foreground">({count})</span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
            */}            {/* Note: Advanced filter sections (Activities, Amenities, etc.) have been 
                 commented out as they don't match the current FilterState interface */}

            {/* Rating */}
            <div className="space-y-2">
              <Label>{t("filters.minimumRating")}</Label>
              <div className="flex items-center justify-between text-sm">
                <span>
                  {filters.ratingMin} {t("filters.stars")}
                </span>
                <span>5 {t("filters.stars")}</span>
              </div>
              <Slider
                value={[filters.ratingMin]}
                onValueChange={(value) => onUpdateFilter("ratingMin", value[0])}
                min={0}
                max={5}
                step={0.5}
                className="w-full"
                aria-label={t("filters.minimumRating")}
              />
            </div>

            {/* Group Size */}
            <div className="space-y-2">
              <Label>{t("filters.maxGroupSize")}</Label>
              <div className="flex items-center justify-between text-sm">
                <span>1 {t("filters.person")}</span>
                <span>
                  {filters.groupSizeMax} {t("filters.people")}
                </span>
              </div>
              <Slider
                value={[filters.groupSizeMax]}
                onValueChange={(value) => onUpdateFilter("groupSizeMax", value[0])}
                min={1}
                max={50}
                step={1}
                className="w-full"
                aria-label={t("filters.maxGroupSize")}
              />
            </div>
          </CardContent>
        </Card>
      </aside>
    </>
  )
}

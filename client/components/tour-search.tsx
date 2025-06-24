"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X } from "lucide-react"

interface SearchFilters {
  destination: string
}

interface TourSearchProps {
  onSearch: (filters: SearchFilters) => void
  className?: string
}

export default function TourSearch({ onSearch, className = "" }: TourSearchProps) {
  const { t } = useLanguage()
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    destination: "",
  })

  const updateSearchFilter = (value: string) => {
    setSearchFilters({ destination: value })
  }

  const handleSearch = () => {
    onSearch(searchFilters)
  }

  const clearFilter = () => {
    setSearchFilters({ destination: "" })
  }

  return (
    <Card className={`shadow-lg border-border ${className}`}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Destination Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search.placeholder")}
                className="pl-10 h-12"
                value={searchFilters.destination}
                onChange={(e) => updateSearchFilter(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {searchFilters.destination && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={clearFilter}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Search Button */}
          <Button className="h-12 px-8" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

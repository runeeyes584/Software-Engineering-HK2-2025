"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, MapPin, Tag, Clock } from "lucide-react"

interface SearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
  currentQuery: string
}

export default function SearchSuggestions({ onSuggestionClick, currentQuery }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<{
    trending: string[]
    destinations: string[]
    categories: string[]
    durations: string[]
  }>({
    trending: [],
    destinations: [],
    categories: [],
    durations: [],
  })

  useEffect(() => {
    // Simulate fetching suggestions based on current query
    const mockSuggestions = {
      trending: ["Beach Resorts", "Cultural Tours", "Adventure Travel", "City Breaks"],
      destinations: ["Thailand", "Japan", "Vietnam", "Indonesia", "Malaysia"],
      categories: ["Beach", "Cultural", "Adventure", "City Breaks", "Wildlife", "Cruise"],
      durations: ["Weekend (2-3 days)", "Short Trip (4-7 days)", "Long Trip (8+ days)"],
    }

    // Filter suggestions based on current query
    if (currentQuery) {
      const filtered = {
        trending: mockSuggestions.trending.filter((item) => item.toLowerCase().includes(currentQuery.toLowerCase())),
        destinations: mockSuggestions.destinations.filter((item) =>
          item.toLowerCase().includes(currentQuery.toLowerCase()),
        ),
        categories: mockSuggestions.categories.filter((item) =>
          item.toLowerCase().includes(currentQuery.toLowerCase()),
        ),
        durations: mockSuggestions.durations.filter((item) => item.toLowerCase().includes(currentQuery.toLowerCase())),
      }
      setSuggestions(filtered)
    } else {
      setSuggestions(mockSuggestions)
    }
  }, [currentQuery])

  const SuggestionSection = ({
    title,
    items,
    icon: Icon,
  }: {
    title: string
    items: string[]
    icon: any
  }) => {
    if (items.length === 0) return null

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="h-4 w-4" />
          {title}
        </div>
        <div className="flex flex-wrap gap-2">
          {items.slice(0, 6).map((item, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(item)}
              className="h-8 text-xs"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const hasAnySuggestions =
    suggestions.trending.length > 0 ||
    suggestions.destinations.length > 0 ||
    suggestions.categories.length > 0 ||
    suggestions.durations.length > 0

  if (!hasAnySuggestions) return null

  return (
    <Card className="mb-6">
      <CardContent className="p-4 space-y-4">
        <SuggestionSection title="Trending Searches" items={suggestions.trending} icon={TrendingUp} />
        <SuggestionSection title="Popular Destinations" items={suggestions.destinations} icon={MapPin} />
        <SuggestionSection title="Categories" items={suggestions.categories} icon={Tag} />
        <SuggestionSection title="Trip Duration" items={suggestions.durations} icon={Clock} />
      </CardContent>
    </Card>
  )
}

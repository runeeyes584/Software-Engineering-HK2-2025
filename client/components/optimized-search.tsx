"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, TrendingUp, X, Loader2 } from "lucide-react"

interface OptimizedSearchProps {
  searchQuery: string
  searchSuggestions: string[]
  searchHistory: string[]
  popularSearches: string[]
  onSearchChange: (query: string) => void
  onSearchSelect: (query: string) => void
  onAddToHistory: (query: string) => void
  isSearching?: boolean
  className?: string
}

export default function OptimizedSearch({
  searchQuery,
  searchSuggestions,
  searchHistory,
  popularSearches,
  onSearchChange,
  onSearchSelect,
  onAddToHistory,
  isSearching = false,
  className = "",
}: OptimizedSearchProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const allSuggestions = [
    ...searchSuggestions.map((s) => ({ type: "suggestion", value: s })),
    ...searchHistory.slice(0, 3).map((s) => ({ type: "history", value: s })),
    ...popularSearches.slice(0, 3).map((s) => ({ type: "popular", value: s })),
  ]
    .filter((item, index, self) => self.findIndex((i) => i.value === item.value) === index)
    .slice(0, 8)

  const handleInputChange = (value: string) => {
    onSearchChange(value)
    setIsOpen(value.length > 0)
    setHighlightedIndex(-1)
  }

  const handleSelectSuggestion = (value: string) => {
    onSearchSelect(value)
    onAddToHistory(value)
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < allSuggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < allSuggestions.length) {
          handleSelectSuggestion(allSuggestions[highlightedIndex].value)
        } else if (searchQuery.trim()) {
          handleSelectSuggestion(searchQuery.trim())
        }
        break
      case "Escape":
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleClearSearch = () => {
    onSearchChange("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search destinations, tours, activities..."
          className="pl-10 pr-20 h-12 text-base"
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(searchQuery.length > 0 || allSuggestions.length > 0)}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isSearching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {searchQuery && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleClearSearch}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {isOpen && allSuggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg border">
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {searchSuggestions.length > 0 && (
                <div className="p-2">
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Suggestions</div>
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={`suggestion-${index}`}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                        highlightedIndex === index ? "bg-muted" : ""
                      }`}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <Search className="h-3 w-3 text-muted-foreground" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchHistory.length > 0 && (
                <div className="p-2 border-t">
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Recent Searches</div>
                  {searchHistory.slice(0, 3).map((item, index) => (
                    <button
                      key={`history-${index}`}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                        highlightedIndex === searchSuggestions.length + index ? "bg-muted" : ""
                      }`}
                      onClick={() => handleSelectSuggestion(item)}
                    >
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              )}

              {popularSearches.length > 0 && (
                <div className="p-2 border-t">
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Popular Searches</div>
                  {popularSearches.slice(0, 3).map((item, index) => (
                    <button
                      key={`popular-${index}`}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                        highlightedIndex === searchSuggestions.length + searchHistory.slice(0, 3).length + index
                          ? "bg-muted"
                          : ""
                      }`}
                      onClick={() => handleSelectSuggestion(item)}
                    >
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!searchQuery && popularSearches.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-muted-foreground mb-2">Popular:</div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.slice(0, 6).map((search, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => handleSelectSuggestion(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

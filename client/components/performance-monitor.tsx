"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Clock, Database, TrendingUp } from "lucide-react"

interface PerformanceMetrics {
  lastFilterTime: number
  totalTours: number
  filteredTours: number
  searchTime: number
}

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics
  activeFilterCount: number
  searchQuery: string
}

export default function PerformanceMonitor({ metrics, activeFilterCount, searchQuery }: PerformanceMonitorProps) {
  const getPerformanceBadge = (time: number) => {
    if (time < 10) return { variant: "default" as const, label: "Excellent", color: "text-green-600" }
    if (time < 50) return { variant: "secondary" as const, label: "Good", color: "text-yellow-600" }
    return { variant: "destructive" as const, label: "Slow", color: "text-red-600" }
  }

  const filterBadge = getPerformanceBadge(metrics.lastFilterTime)
  const searchBadge = getPerformanceBadge(metrics.searchTime)

  const efficiency = metrics.totalTours > 0 ? ((metrics.filteredTours / metrics.totalTours) * 100).toFixed(1) : "0"

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="text-muted-foreground">Filter Time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono">{metrics.lastFilterTime.toFixed(2)}ms</span>
              <Badge variant={filterBadge.variant} className="text-xs">
                {filterBadge.label}
              </Badge>
            </div>
          </div>

          {searchQuery && (
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-muted-foreground">Search Time</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono">{metrics.searchTime.toFixed(2)}ms</span>
                <Badge variant={searchBadge.variant} className="text-xs">
                  {searchBadge.label}
                </Badge>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              <span className="text-muted-foreground">Results</span>
            </div>
            <div className="font-mono">
              {metrics.filteredTours.toLocaleString()} / {metrics.totalTours.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span className="text-muted-foreground">Efficiency</span>
            </div>
            <div className="font-mono">{efficiency}%</div>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="text-xs text-muted-foreground">
            {activeFilterCount} active filter{activeFilterCount !== 1 ? "s" : ""} applied
          </div>
        )}
      </CardContent>
    </Card>
  )
}

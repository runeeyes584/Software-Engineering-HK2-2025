"use client"

import { Badge } from "@/components/ui/badge"
import { useSyncAvatar } from "@/hooks/use-sync-avatar"
import { CheckCircle, RefreshCw } from "lucide-react"

export function AvatarSyncStatus() {
  const { syncing } = useSyncAvatar()

  if (syncing) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <RefreshCw className="h-3 w-3 animate-spin" />
        Syncing avatar...
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-200">
      <CheckCircle className="h-3 w-3" />
      Avatar synced
    </Badge>
  )
} 
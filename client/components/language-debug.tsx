"use client"

import { useLanguage, useTranslationDebug } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

// Debug component for development - only shows in dev mode
export default function LanguageDebug() {
  const { language, availableLanguages, t, isLoading } = useLanguage()
  const debugTranslations = useTranslationDebug()
  const [showDebug, setShowDebug] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const testKeys = [
    "nav.home",
    "nav.tours",
    "categories.adventure",
    "auth.login",
    "common.loading",
    "tour.bookNow",
    "nonexistent.key", // This should be missing
  ]

  const handleDebugTest = () => {
    debugTranslations(testKeys)
    console.group("🧪 Translation Test Results")
    testKeys.forEach((key) => {
      const result = t(key)
      console.log(`${key}: "${result}"`)
    })
    console.groupEnd()
  }

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDebug(true)}
          className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
        >
          🌐 Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="border-yellow-300 bg-yellow-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Language Debug</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
              ✕
            </Button>
          </div>
          <CardDescription className="text-xs">Development mode only</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Current:</span>
            <Badge variant="default">{language}</Badge>
            {isLoading && <Badge variant="secondary">Loading...</Badge>}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">Available:</span>
            <div className="flex gap-1">
              {availableLanguages.map((lang) => (
                <Badge key={lang} variant="outline" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Button size="sm" variant="outline" onClick={handleDebugTest} className="w-full text-xs">
              Test Translations
            </Button>

            <div className="text-xs space-y-1">
              <div>Sample: {t("nav.home")}</div>
              <div>Missing: {t("nonexistent.key")}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

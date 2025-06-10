"use client"

import { useEffect, useState } from "react"
import { getStoredLanguage, storeLanguage, detectBrowserLanguage, type SupportedLanguage } from "@/lib/language-utils"

export const useLanguagePersistence = () => {
  const [language, setLanguage] = useState<SupportedLanguage>("en")
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize language on client side
  useEffect(() => {
    const initLanguage = () => {
      const stored = getStoredLanguage()
      const detected = detectBrowserLanguage()

      // Use stored preference, fallback to detected, then default
      const initialLanguage = stored !== "en" ? stored : detected

      setLanguage(initialLanguage)
      storeLanguage(initialLanguage)
      setIsHydrated(true)
    }

    initLanguage()
  }, [])

  // Persist language changes
  const changeLanguage = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage)
    storeLanguage(newLanguage)
  }

  return {
    language,
    setLanguage: changeLanguage,
    isHydrated,
  }
}

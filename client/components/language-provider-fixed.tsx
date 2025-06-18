"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react"
import en from "@/public/locales/en.json";
import vi from "@/public/locales/vi.json";

interface LanguageContextType {
  language: string
  setLanguage: (language: string) => void
  t: (id: string, values?: Record<string, any>) => string
  isLoading: boolean
  availableLanguages: string[]
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (id: string) => id,
  isLoading: true,
  availableLanguages: ["en", "vi"],
})

const translations: Record<string, any> = { en, vi };

function getByPath(obj: any, path: string) {
  return path.split('.').reduce((o, i) => o?.[i], obj);
}

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<string>("en")
  const [isLoading, setIsLoading] = useState(true)

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "vi")) {
      setLanguageState(savedLanguage)
    }
    setIsLoading(false)
  }, [])

  // Save language to localStorage when it changes
  const setLanguage = useCallback((newLanguage: string) => {
    if (newLanguage === "en" || newLanguage === "vi") {
      setLanguageState(newLanguage)
      localStorage.setItem("language", newLanguage)
    }
  }, [])

  // Translation function with fallback (key phẳng)
  const t = useCallback(
    (id: string, values?: Record<string, any>): string => {
      let translation = getByPath(translations[language], id);
      if (!translation && language !== "en") {
        translation = getByPath(translations.en, id);
      }
      if (!translation) return id;
      if (values) {
        Object.keys(values).forEach((key) => {
          translation = translation.replace(`{${key}}`, String(values[key]));
        });
      }
      return translation;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isLoading,
      availableLanguages: ["en", "vi"],
    }),
    [language, setLanguage, t, isLoading],
  )

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Utility hook for debugging translations
export const useTranslationDebug = () => {
  const { language } = useLanguage()

  return useCallback(
    (keys: string[]) => {
      if (process.env.NODE_ENV === "development") {
        const currentTranslations = translations[language] || {}
        const missing = keys.filter((key) => !currentTranslations[key])

        if (missing.length > 0) {
          console.group(`🔍 Translation Debug - Language: ${language}`)
          console.log("Missing keys:", missing)
          console.log("Available keys:", Object.keys(currentTranslations).length)
          console.groupEnd()
        }
      }
    },
    [language],
  )
}

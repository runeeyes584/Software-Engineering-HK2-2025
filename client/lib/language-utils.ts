// Utility functions for language handling

export const SUPPORTED_LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
  vi: {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    flag: "🇻🇳",
  },
} as const

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES

export const DEFAULT_LANGUAGE: SupportedLanguage = "en"
export const LANGUAGE_STORAGE_KEY = "travel-vista-language"

// Detect browser language
export const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE

  const browserLang = navigator.language.split("-")[0] as SupportedLanguage
  return SUPPORTED_LANGUAGES[browserLang] ? browserLang : DEFAULT_LANGUAGE
}

// Get stored language preference
export const getStoredLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage
    return SUPPORTED_LANGUAGES[stored] ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

// Store language preference
export const storeLanguage = (language: SupportedLanguage): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch (error) {
    console.warn("Failed to store language preference:", error)
  }
}

// Validate language code
export const isValidLanguage = (language: string): language is SupportedLanguage => {
  return language in SUPPORTED_LANGUAGES
}

// Get language display info
export const getLanguageInfo = (language: SupportedLanguage) => {
  return SUPPORTED_LANGUAGES[language]
}

// Format translation key for debugging
export const formatTranslationKey = (key: string, language: SupportedLanguage): string => {
  return `[${language}] ${key}`
}

// Check if translation exists
export const hasTranslation = (translations: Record<string, any>, key: string): boolean => {
  return key in translations
}

// Get nested translation value
export const getNestedTranslation = (translations: Record<string, any>, key: string): any => {
  return key.split(".").reduce((obj, k) => obj?.[k], translations)
}

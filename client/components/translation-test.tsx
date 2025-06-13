"use client"

import { useLanguage } from "@/components/language-provider-fixed"

// Component để test tất cả translation keys mới
export default function TranslationTest() {
  const { t, language, setLanguage } = useLanguage()

  const testKeys = [
    // Categories
    "categories.adventure",
    "categories.cultural", 
    "categories.beach",
    "categories.cityBreaks",
    "categories.wildlife",
    "categories.cruise",
    
    // Regions
    "regions.asia",
    "regions.europe",
    "regions.americas", 
    "regions.africa",
    "regions.oceania",
    
    // Navigation
    "nav.allTours",
    "nav.allDestinations",
    "nav.tourCategories",
    "nav.regions",
    "nav.popular",
    
    // About
    "about.ourStory",
    "about.ourMission",
    "about.ourValues",
    "about.ourTeam",
    "about.role.ceo",
    "about.values.authentic.title",
    
    // Footer & Others
    "footer.terms",
    "footer.privacy",
    "backToTop",
    
    // Chatbot
    "chatbot.title",
    "chatbot.suggestion.beaches",
    "chatbot.suggestion.booking",
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Translation Keys Test</h1>
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setLanguage("en")}
            className={`px-4 py-2 rounded ${language === "en" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            English
          </button>
          <button 
            onClick={() => setLanguage("vi")}
            className={`px-4 py-2 rounded ${language === "vi" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Tiếng Việt
          </button>
        </div>
        <p className="text-sm text-gray-600">Current language: {language}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testKeys.map((key) => (
          <div key={key} className="border p-3 rounded">
            <div className="text-xs text-gray-500 mb-1">{key}</div>
            <div className="font-medium">{t(key)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

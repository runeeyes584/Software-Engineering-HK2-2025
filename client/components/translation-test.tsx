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
    
    // Filter Keys (newly added)
    "filters.title",
    "filters.active", 
    "filters.activeFilters",
    "filters.clearAll",
    "filters.days",
    "filters.stars",
    "filters.priceRange",
    "filters.duration",
    "filters.categories",
    "filters.countries",
    "filters.difficulties",
    "filters.activities",
    "filters.amenities",
    "filters.tourLanguages",
    "filters.groupSize",
    "filters.person",
    "filters.people",
    
    // Search Keys (newly added)
    "search.button",
    "search.active",
    "search.noToursMatchFilters",
    
    // Home Keys (newly added)
    "home.hero.title",
    "home.hero.subtitle",
    "home.hero.cta",
    "home.featured",
    "home.popular", 
    "home.testimonials",
    
    // Transport & Tour Keys (newly added)
    "transport.airplane",
    "transport.bus",
    "transport.cruiseShip",
    "transport.privateCar",
    "class.economy",
    "class.business",
    "class.luxury",
    
    // Contact Keys (newly fixed)
    "contact.getInTouch",
    "contact.contactInfo",
    "contact.officeHours",
    "contact.name",
    "contact.email",
    "contact.subject",
    "contact.selectSubject",
    "contact.message",
    "contact.send",
    "contact.sending",
    "contact.sent",
    "contact.subjects.general",
    "contact.subjects.booking",
    "contact.subjects.support",
    "contact.subjects.feedback",
    "contact.subjects.partnership",
    "contact.faq.title",
    "contact.faq.q1",
    "contact.faq.a1",
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

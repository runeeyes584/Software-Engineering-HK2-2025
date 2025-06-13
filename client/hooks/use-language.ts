import { useCallback } from "react"

type TranslationKey = keyof typeof translations

// Mock translations - in a real app, these would come from a translation file
const translations = {
  "tour.images": "Images",
  "tour.video": "Video",
  "tour.reviews": "reviews",
  "tour.days": "days",
  "tour.type": "Tour Type",
  "tour.availableSlots": "Available Slots",
  "tour.slots": "slots",
  "tour.perPerson": "per person",
  "tour.departureDate": "Departure Date",
  "tour.selectDepartureDate": "Select departure date",
  "tour.returnDate": "Return Date",
  "tour.selectReturnDate": "Select return date",
  "tour.transportation": "Transportation",
  "tour.class": "Class",
  "tour.selectClass": "Select class",
  "tour.adults": "Adults",
  "tour.children": "Children",
  "tour.infants": "Infants",
  "tour.serviceFee": "Service Fee",
  "tour.total": "Total",
  "tour.bookNow": "Book Now",
  "tour.wontBeCharged": "You won't be charged yet",
  "tour.selectDepartureDateFirst": "Please select a departure date first",
  "tour.selectReturnDateFirst": "Please select a return date first",
  "transport.airplane": "Airplane",
  "transport.bus": "Bus",
  "transport.cruiseShip": "Cruise Ship",
  "transport.privateCar": "Private Car",
  "class.economy": "Economy",
  "class.economyDesc": "Standard comfort and amenities",
  "class.business": "Business",
  "class.businessDesc": "Enhanced comfort and premium services",
  "class.luxury": "Luxury",
  "class.luxuryDesc": "Ultimate luxury experience with exclusive services",
} as const

export function useLanguage() {
  const t = useCallback((key: string): string => {
    return translations[key as TranslationKey] || key
  }, [])

  return { t }
} 
"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react"
import { IntlProvider, useIntl } from "react-intl"

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

// Comprehensive translation dictionary
const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.tours": "Tours",
    "nav.destinations": "Destinations",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.tourCategories": "Tour Categories",
    "nav.regions": "Regions",
    "nav.popular": "Popular",
    "nav.allTours": "View All Tours",
    "nav.allDestinations": "View All Destinations",

    // Categories
    "categories.adventure": "Adventure",
    "categories.cultural": "Cultural",
    "categories.beach": "Beach",
    "categories.cityBreaks": "City Breaks",
    "categories.wildlife": "Wildlife",
    "categories.cruise": "Cruise",

    // Regions
    "regions.asia": "Asia",
    "regions.europe": "Europe",
    "regions.americas": "Americas",
    "regions.africa": "Africa",
    "regions.oceania": "Oceania",

    // Countries
    "countries.vietnam": "Vietnam",
    "countries.thailand": "Thailand",
    "countries.japan": "Japan",
    "countries.indonesia": "Indonesia",
    "countries.singapore": "Singapore",
    "countries.malaysia": "Malaysia",
    "countries.cambodia": "Cambodia",
    "countries.maldives": "Maldives",

    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.logout": "Logout",
    "auth.myAccount": "My Account",
    "auth.myBookings": "My Bookings",
    "auth.settings": "Settings",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.name": "Name",
    "auth.rememberMe": "Remember Me",
    "auth.forgotPassword": "Forgot Password?",
    "auth.resetPassword": "Reset Password",
    "auth.loginSuccess": "Login successful!",
    "auth.registerSuccess": "Registration successful!",
    "auth.invalidCredentials": "Invalid credentials.",

    // Theme
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",

    // Home page
    "home.hero.title": "Discover Amazing Destinations",
    "home.hero.subtitle": "Explore the world with our carefully curated travel experiences",
    "home.hero.cta": "Start Your Journey",
    "home.popular": "Popular Destinations",
    "home.featured": "Featured Tours",
    "home.testimonials": "What Our Travelers Say",

    // Tours
    "tours.viewDetails": "View Details",
    "tours.bookNow": "Book Now",
    "tours.perPerson": "per person",
    "tours.more": "more",
    "tours.addToWishlist": "Add to Wishlist",
    "tours.share": "Share",
    "tours.topRated": "Top Rated",
    "tours.difficulty": "Difficulty",
    "tours.activityLevel": "Activity Level",
    "tours.reviews": "Reviews",

    // Tour difficulty levels
    "tours.difficulty.easy": "Easy",
    "tours.difficulty.moderate": "Moderate",
    "tours.difficulty.challenging": "Challenging",

    // Tour activity levels
    "tours.activityLevel.low": "Low",
    "tours.activityLevel.moderate": "Moderate",
    "tours.activityLevel.high": "High",
    "tours.activityLevel.extreme": "Extreme",

    // Tour details
    "tour.overview": "Overview",
    "tour.itinerary": "Itinerary",
    "tour.details": "Details",
    "tour.highlights": "Highlights",
    "tour.included": "Included",
    "tour.notIncluded": "Not Included",
    "tour.transportation": "Transportation",
    "tour.additionalInfo": "Additional Information",
    "tour.language": "Language",
    "tour.englishVietnamese": "English & Vietnamese",
    "tour.groupSize": "Group Size",
    "tour.maximum20People": "Maximum 20 people",
    "tour.airConditionedVehicle": "Air-conditioned vehicle",
    "tour.accommodation": "Accommodation",
    "tour.deluxeCabin": "Deluxe cabin on cruise ship",
    "tour.basedOnReviews": "Based on {count} reviews",
    "tour.departureDate": "Departure Date",
    "tour.returnDate": "Return Date",
    "tour.selectDepartureDate": "Select departure date",
    "tour.selectReturnDate": "Select return date",
    "tour.selectDepartureDateFirst": "Please select departure date first",
    "tour.selectReturnDateFirst": "Please select return date first",
    "tour.class": "Class",
    "tour.selectClass": "Select class",
    "tour.travelers": "Travelers",
    "tour.adults": "Adults",
    "tour.children": "Children",
    "tour.infants": "Infants",
    "tour.age12Plus": "Age 12+",
    "tour.age2to11": "Age 2-11",
    "tour.under2": "Under 2",
    "tour.serviceFee": "Service Fee",
    "tour.total": "Total",
    "tour.wontBeCharged": "You won't be charged yet",

    // Transport
    "transport.airplane": "Airplane",
    "transport.bus": "Bus",
    "transport.cruiseShip": "Cruise Ship",
    "transport.privateCar": "Private Car",

    // Class
    "class.economy": "Economy",
    "class.business": "Business",
    "class.luxury": "Luxury",
    "class.economyDesc": "Standard comfort and service",
    "class.businessDesc": "Enhanced comfort and priority service",
    "class.luxuryDesc": "Premium experience with exclusive amenities",

    // Specific tour content
    "tour.halongBay.title": "Ha Long Bay Luxury Cruise",
    "tour.halongBay.location": "Ha Long Bay, Vietnam",
    "tour.halongBay.description":
      "Experience the breathtaking beauty of Ha Long Bay on this luxury cruise adventure through emerald waters and limestone karsts.",
    "tour.halongBay.highlights": [
      "Luxury cruise ship accommodation",
      "Explore stunning limestone caves",
      "Kayaking through hidden lagoons",
      "Traditional Vietnamese cuisine",
      "Sunrise Tai Chi on deck",
      "Professional photography service",
    ],
    "tour.halongBay.included": [
      "2 nights luxury cruise accommodation",
      "All meals and beverages",
      "Kayaking equipment and guide",
      "Cave exploration tours",
      "Tai Chi classes",
      "Airport transfers",
    ],
    "tour.halongBay.excluded": [
      "International flights",
      "Personal expenses",
      "Spa treatments",
      "Alcoholic beverages",
      "Travel insurance",
      "Tips and gratuities",
    ],
    "tour.halongBay.itinerary.day1.title": "Arrival & Embarkation",
    "tour.halongBay.itinerary.day1.description":
      "Board your luxury cruise ship and enjoy a welcome lunch while sailing through the stunning karst formations.",
    "tour.halongBay.itinerary.day2.title": "Cave Exploration & Kayaking",
    "tour.halongBay.itinerary.day2.description":
      "Explore magnificent caves and kayak through hidden lagoons surrounded by towering limestone cliffs.",
    "tour.halongBay.itinerary.day3.title": "Sunrise Tai Chi & Departure",
    "tour.halongBay.itinerary.day3.description":
      "Start your day with Tai Chi on deck, enjoy brunch, and disembark with unforgettable memories.",

    // Reviews
    "tour.reviews.sarah.comment":
      "Absolutely incredible experience! The cruise was luxurious and the scenery was breathtaking. Highly recommend!",
    "tour.reviews.david.comment":
      "Great tour with excellent guides. The cave exploration was the highlight of our trip.",
    "tour.reviews.maria.comment": "Perfect romantic getaway. The sunset views from the deck were unforgettable.",

    // Filters
    "filters.currency": "$",
    "filters.days": "days",
    "filters.maximum": "Max",
    "filters.people": "people",
    "filters.activityLevel": "Activity Level",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.confirm": "Confirm",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.create": "Create",
    "common.update": "Update",
    "common.back": "Back",
    "common.next": "Next",
    "common.submit": "Submit",
    "common.search": "Search",
    "common.reset": "Reset",
    "common.actions": "Actions",
    "common.noData": "No data available",
    "common.save": "Save",
    "common.close": "Close",
    "common.apply": "Apply",
    "common.clear": "Clear",
    "common.all": "All",

    // Contact
    "contact.title": "Contact",
    "contact.description": "This is the contact page.",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.message": "Message",
    "contact.submit": "Submit",
    "contact.success": "Message sent successfully!",
    "contact.error": "Failed to send message.",

    // Booking
    "booking.title": "Booking",
    "booking.search": "Search for a destination or hotel",
    "booking.destination": "Destination",
    "booking.checkIn": "Check In",
    "booking.checkOut": "Check Out",
    "booking.guests": "Guests",
    "booking.searchButton": "Search",
    "booking.bookNow": "Book Now",
    "booking.total": "Total",

    // Admin
    "admin.dashboard.title": "Dashboard",
    "admin.dashboard.subtitle": "Overview of system performance and key metrics",
    "admin.dashboard.totalUsers": "Total Users",
    "admin.dashboard.activeUsers": "Active Users",
    "admin.dashboard.totalBookings": "Total Bookings",
    "admin.dashboard.revenueGenerated": "Revenue Generated",
    "admin.users.title": "Users",
    "admin.users.subtitle": "Manage user accounts and roles",
    "admin.bookings.title": "Bookings",
    "admin.bookings.subtitle": "Manage and view all bookings",
    "admin.settings.title": "Settings",
    "admin.settings.subtitle": "Configure your admin panel preferences and system settings",
  },
  vi: {
    // Navigation
    "nav.home": "Trang chủ",
    "nav.tours": "Tour du lịch",
    "nav.destinations": "Điểm đến",
    "nav.about": "Giới thiệu",
    "nav.contact": "Liên hệ",
    "nav.tourCategories": "Danh mục tour",
    "nav.regions": "Khu vực",
    "nav.popular": "Phổ biến",
    "nav.allTours": "Xem tất cả tour",
    "nav.allDestinations": "Xem tất cả điểm đến",

    // Categories
    "categories.adventure": "Phiêu lưu",
    "categories.cultural": "Văn hóa",
    "categories.beach": "Biển",
    "categories.cityBreaks": "Thành phố",
    "categories.wildlife": "Động vật hoang dã",
    "categories.cruise": "Du thuyền",

    // Regions
    "regions.asia": "Châu Á",
    "regions.europe": "Châu Âu",
    "regions.americas": "Châu Mỹ",
    "regions.africa": "Châu Phi",
    "regions.oceania": "Châu Đại Dương",

    // Countries
    "countries.vietnam": "Việt Nam",
    "countries.thailand": "Thái Lan",
    "countries.japan": "Nhật Bản",
    "countries.indonesia": "Indonesia",
    "countries.singapore": "Singapore",
    "countries.malaysia": "Malaysia",
    "countries.cambodia": "Campuchia",
    "countries.maldives": "Maldives",

    // Auth
    "auth.login": "Đăng nhập",
    "auth.register": "Đăng ký",
    "auth.logout": "Đăng xuất",
    "auth.myAccount": "Tài khoản của tôi",
    "auth.myBookings": "Đặt chỗ của tôi",
    "auth.settings": "Cài đặt",
    "auth.email": "Email",
    "auth.password": "Mật khẩu",
    "auth.confirmPassword": "Xác nhận mật khẩu",
    "auth.name": "Tên",
    "auth.rememberMe": "Ghi nhớ tôi",
    "auth.forgotPassword": "Quên mật khẩu?",
    "auth.resetPassword": "Đặt lại mật khẩu",
    "auth.loginSuccess": "Đăng nhập thành công!",
    "auth.registerSuccess": "Đăng ký thành công!",
    "auth.invalidCredentials": "Thông tin đăng nhập không hợp lệ.",

    // Theme
    "theme.light": "Sáng",
    "theme.dark": "Tối",
    "theme.system": "Hệ thống",

    // Home page
    "home.hero.title": "Khám phá những điểm đến tuyệt vời",
    "home.hero.subtitle": "Khám phá thế giới với những trải nghiệm du lịch được tuyển chọn cẩn thận",
    "home.hero.cta": "Bắt đầu hành trình",
    "home.popular": "Điểm đến phổ biến",
    "home.featured": "Tour nổi bật",
    "home.testimonials": "Khách hàng nói gì về chúng tôi",

    // Tours
    "tours.viewDetails": "Xem chi tiết",
    "tours.bookNow": "Đặt ngay",
    "tours.perPerson": "mỗi người",
    "tours.more": "thêm",
    "tours.addToWishlist": "Thêm vào danh sách yêu thích",
    "tours.share": "Chia sẻ",
    "tours.topRated": "Đánh giá cao",
    "tours.difficulty": "Độ khó",
    "tours.activityLevel": "Mức độ hoạt động",
    "tours.reviews": "Đánh giá",

    // Tour difficulty levels
    "tours.difficulty.easy": "Dễ",
    "tours.difficulty.moderate": "Trung bình",
    "tours.difficulty.challenging": "Thử thách",

    // Tour activity levels
    "tours.activityLevel.low": "Thấp",
    "tours.activityLevel.moderate": "Trung bình",
    "tours.activityLevel.high": "Cao",
    "tours.activityLevel.extreme": "Cực cao",

    // Tour details
    "tour.overview": "Tổng quan",
    "tour.itinerary": "Lịch trình",
    "tour.details": "Chi tiết",
    "tour.highlights": "Điểm nổi bật",
    "tour.included": "Bao gồm",
    "tour.notIncluded": "Không bao gồm",
    "tour.transportation": "Phương tiện",
    "tour.additionalInfo": "Thông tin bổ sung",
    "tour.language": "Ngôn ngữ",
    "tour.englishVietnamese": "Tiếng Anh & Tiếng Việt",
    "tour.groupSize": "Quy mô nhóm",
    "tour.maximum20People": "Tối đa 20 người",
    "tour.airConditionedVehicle": "Xe có điều hòa",
    "tour.accommodation": "Chỗ ở",
    "tour.deluxeCabin": "Cabin sang trọng trên du thuyền",
    "tour.basedOnReviews": "Dựa trên {count} đánh giá",
    "tour.departureDate": "Ngày khởi hành",
    "tour.returnDate": "Ngày về",
    "tour.selectDepartureDate": "Chọn ngày khởi hành",
    "tour.selectReturnDate": "Chọn ngày về",
    "tour.selectDepartureDateFirst": "Vui lòng chọn ngày khởi hành trước",
    "tour.selectReturnDateFirst": "Vui lòng chọn ngày về trước",
    "tour.class": "Hạng",
    "tour.selectClass": "Chọn hạng",
    "tour.travelers": "Du khách",
    "tour.adults": "Người lớn",
    "tour.children": "Trẻ em",
    "tour.infants": "Em bé",
    "tour.age12Plus": "Từ 12 tuổi",
    "tour.age2to11": "Từ 2-11 tuổi",
    "tour.under2": "Dưới 2 tuổi",
    "tour.serviceFee": "Phí dịch vụ",
    "tour.total": "Tổng cộng",
    "tour.wontBeCharged": "Bạn chưa bị tính phí",

    // Transport
    "transport.airplane": "Máy bay",
    "transport.bus": "Xe buýt",
    "transport.cruiseShip": "Du thuyền",
    "transport.privateCar": "Xe riêng",

    // Class
    "class.economy": "Phổ thông",
    "class.business": "Thương gia",
    "class.luxury": "Sang trọng",
    "class.economyDesc": "Tiện nghi và dịch vụ tiêu chuẩn",
    "class.businessDesc": "Tiện nghi nâng cao và dịch vụ ưu tiên",
    "class.luxuryDesc": "Trải nghiệm cao cấp với tiện nghi độc quyền",

    // Specific tour content
    "tour.halongBay.title": "Du thuyền sang trọng Vịnh Hạ Long",
    "tour.halongBay.location": "Vịnh Hạ Long, Việt Nam",
    "tour.halongBay.description":
      "Trải nghiệm vẻ đẹp ngoạn mục của Vịnh Hạ Long trong cuộc phiêu lưu du thuyền sang trọng qua vùng nước màu ngọc lục bảo và những tảng đá vôi.",
    "tour.halongBay.highlights": [
      "Chỗ ở du thuyền sang trọng",
      "Khám phá những hang động đá vôi tuyệt đẹp",
      "Chèo kayak qua các đầm phá ẩn giấu",
      "Ẩm thực truyền thống Việt Nam",
      "Tập Thái Cực Quyền lúc bình minh trên boong",
      "Dịch vụ chụp ảnh chuyên nghiệp",
    ],
    "tour.halongBay.included": [
      "2 đêm nghỉ dưỡng du thuyền sang trọng",
      "Tất cả bữa ăn và đồ uống",
      "Thiết bị chèo kayak và hướng dẫn viên",
      "Tour khám phá hang động",
      "Lớp học Thái Cực Quyền",
      "Đưa đón sân bay",
    ],
    "tour.halongBay.excluded": [
      "Vé máy bay quốc tế",
      "Chi phí cá nhân",
      "Dịch vụ spa",
      "Đồ uống có cồn",
      "Bảo hiểm du lịch",
      "Tiền tip và thưởng",
    ],
    "tour.halongBay.itinerary.day1.title": "Đến & Lên tàu",
    "tour.halongBay.itinerary.day1.description":
      "Lên du thuyền sang trọng và thưởng thức bữa trưa chào mừng trong khi du ngoạn qua những khối đá karst tuyệt đẹp.",
    "tour.halongBay.itinerary.day2.title": "Khám phá hang động & Chèo kayak",
    "tour.halongBay.itinerary.day2.description":
      "Khám phá những hang động tráng lệ và chèo kayak qua các đầm phá ẩn giấu được bao quanh bởi những vách đá vôi cao chót vót.",
    "tour.halongBay.itinerary.day3.title": "Thái Cực Quyền lúc bình minh & Khởi hành",
    "tour.halongBay.itinerary.day3.description":
      "Bắt đầu ngày mới với Thái Cực Quyền trên boong tàu, thưởng thức bữa brunch và rời tàu với những kỷ niệm khó quên.",

    // Reviews
    "tour.reviews.sarah.comment":
      "Trải nghiệm tuyệt vời! Du thuyền sang trọng và phong cảnh ngoạn mục. Rất khuyến khích!",
    "tour.reviews.david.comment":
      "Tour tuyệt vời với hướng dẫn viên xuất sắc. Khám phá hang động là điểm nhấn của chuyến đi.",
    "tour.reviews.maria.comment": "Kỳ nghỉ lãng mạn hoàn hảo. Cảnh hoàng hôn từ boong tàu thật khó quên.",

    // Filters
    "filters.currency": "$",
    "filters.days": "ngày",
    "filters.maximum": "Tối đa",
    "filters.people": "người",
    "filters.activityLevel": "Mức độ hoạt động",

    // Common
    "common.loading": "Đang tải...",
    "common.error": "Lỗi",
    "common.success": "Thành công",
    "common.confirm": "Xác nhận",
    "common.cancel": "Hủy",
    "common.edit": "Sửa",
    "common.delete": "Xóa",
    "common.view": "Xem",
    "common.create": "Tạo",
    "common.update": "Cập nhật",
    "common.back": "Quay lại",
    "common.next": "Tiếp theo",
    "common.submit": "Gửi",
    "common.search": "Tìm kiếm",
    "common.reset": "Đặt lại",
    "common.actions": "Hành động",
    "common.noData": "Không có dữ liệu",
    "common.save": "Lưu",
    "common.close": "Đóng",
    "common.apply": "Áp dụng",
    "common.clear": "Xóa",
    "common.all": "Tất cả",

    // Contact
    "contact.title": "Liên hệ",
    "contact.description": "Đây là trang liên hệ.",
    "contact.name": "Tên",
    "contact.email": "Email",
    "contact.message": "Tin nhắn",
    "contact.submit": "Gửi",
    "contact.success": "Tin nhắn đã được gửi thành công!",
    "contact.error": "Không thể gửi tin nhắn.",

    // Booking
    "booking.title": "Đặt phòng",
    "booking.search": "Tìm kiếm điểm đến hoặc khách sạn",
    "booking.destination": "Điểm đến",
    "booking.checkIn": "Nhận phòng",
    "booking.checkOut": "Trả phòng",
    "booking.guests": "Khách",
    "booking.searchButton": "Tìm kiếm",
    "booking.bookNow": "Đặt ngay",
    "booking.total": "Tổng cộng",

    // Admin
    "admin.dashboard.title": "Bảng điều khiển",
    "admin.dashboard.subtitle": "Tổng quan về hiệu suất hệ thống và các số liệu chính",
    "admin.dashboard.totalUsers": "Tổng số người dùng",
    "admin.dashboard.activeUsers": "Người dùng hoạt động",
    "admin.dashboard.totalBookings": "Tổng số lượt đặt phòng",
    "admin.dashboard.revenueGenerated": "Doanh thu được tạo",
    "admin.users.title": "Người dùng",
    "admin.users.subtitle": "Quản lý tài khoản và vai trò người dùng",
    "admin.bookings.title": "Đặt phòng",
    "admin.bookings.subtitle": "Quản lý và xem tất cả các đặt phòng",
    "admin.settings.title": "Cài đặt",
    "admin.settings.subtitle": "Cấu hình tùy chọn bảng quản trị và cài đặt hệ thống",
  },
}

// Debug utility for missing translations
const debugTranslations = (language: string, missingKeys: Set<string>) => {
  if (process.env.NODE_ENV === "development" && missingKeys.size > 0) {
    console.group(`🌐 Missing translations for language: ${language}`)
    Array.from(missingKeys).forEach((key) => {
      console.warn(`Missing key: ${key}`)
    })
    console.groupEnd()
  }
}

// Translation provider component that uses useIntl
const TranslationProvider = ({
  children,
  language,
  setLanguage,
  isLoading,
  setIsLoading,
}: {
  children: React.ReactNode
  language: string
  setLanguage: (language: string) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}) => {
  const intl = useIntl()
  const missingKeys = useMemo(() => new Set<string>(), [])

  const t = useCallback(
    (id: string, values?: Record<string, any>) => {
      try {
        const message = intl.formatMessage({ id }, values)
        return message
      } catch (error) {
        // Track missing keys for debugging
        missingKeys.add(id)

        // In development, show detailed error info
        if (process.env.NODE_ENV === "development") {
          console.warn(`🌐 Translation missing: ${id} for language: ${language}`)
        }

        // Return a fallback - try English first, then the key itself
        if (language !== "en" && translations.en[id]) {
          return translations.en[id]
        }

        // Return the key with a prefix to make it obvious it's missing
        return `[${id}]`
      }
    },
    [intl, language, missingKeys],
  )

  // Debug missing translations in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const timer = setTimeout(() => {
        debugTranslations(language, missingKeys)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [language, missingKeys])

  // Mark as loaded after intl is ready
  useEffect(() => {
    if (isLoading) {
      setIsLoading(false)
    }
  }, [intl, isLoading, setIsLoading])

  const availableLanguages = useMemo(() => Object.keys(translations), [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Main language provider component
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize language on client side
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Get stored language preference
        const storedLanguage = localStorage.getItem("travel-vista-language")

        if (storedLanguage && translations[storedLanguage]) {
          setLanguage(storedLanguage)
        } else {
          // Detect browser language
          const browserLanguage = navigator.language.split("-")[0]
          const detectedLanguage = translations[browserLanguage] ? browserLanguage : "en"

          setLanguage(detectedLanguage)
          localStorage.setItem("travel-vista-language", detectedLanguage)
        }
      } catch (error) {
        console.warn("Failed to initialize language:", error)
        setLanguage("en")
      } finally {
        setIsHydrated(true)
      }
    }

    initializeLanguage()
  }, [])

  // Persist language changes
  useEffect(() => {
    if (isHydrated && language) {
      try {
        localStorage.setItem("travel-vista-language", language)
      } catch (error) {
        console.warn("Failed to save language preference:", error)
      }
    }
  }, [language, isHydrated])

  // Handle language change with validation
  const handleLanguageChange = useCallback((newLanguage: string) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage)
      setIsLoading(true)
    } else {
      console.error(`Language ${newLanguage} is not supported`)
    }
  }, [])

  // Show minimal loading state during hydration
  if (!isHydrated) {
    return (
      <LanguageContext.Provider
        value={{
          language: "en",
          setLanguage: () => {},
          t: (id: string) => id,
          isLoading: true,
          availableLanguages: ["en", "vi"],
        }}
      >
        {children}
      </LanguageContext.Provider>
    )
  }

  // Get current language messages with fallback
  const messages = translations[language] || translations.en

  return (
    <IntlProvider
      locale={language}
      messages={messages}
      defaultLocale="en"
      onError={(error) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("IntlProvider error:", error)
        }
      }}
    >
      <TranslationProvider
        language={language}
        setLanguage={handleLanguageChange}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      >
        {children}
      </TranslationProvider>
    </IntlProvider>
  )
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

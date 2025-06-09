"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "vi"
type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    "nav.home": "Home",
    "nav.tours": "Tours",
    "nav.about": "About",
    "nav.contact": "Contact",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.logout": "Logout",
    "auth.forgotPassword": "Forgot Password",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.rememberMe": "Remember me",
    "auth.dontHaveAccount": "Don't have an account?",
    "auth.alreadyHaveAccount": "Already have an account?",
    "auth.resetPassword": "Reset Password",
    "auth.backToLogin": "Back to Login",
    "home.hero.title": "Discover Your Next Adventure",
    "home.hero.subtitle": "Explore the world with our carefully curated travel experiences",
    "home.hero.cta": "Book Now",
    "home.featured": "Featured Tours",
    "home.popular": "Popular Destinations",
    "home.testimonials": "What Our Customers Say",
    "tour.duration": "Duration",
    "tour.price": "Price",
    "tour.rating": "Rating",
    "tour.included": "What's Included",
    "tour.notIncluded": "What's Not Included",
    "tour.itinerary": "Itinerary",
    "tour.reviews": "Reviews",
    "tour.relatedTours": "Related Tours",
    "booking.title": "Book Your Tour",
    "booking.personalInfo": "Personal Information",
    "booking.travelDetails": "Travel Details",
    "booking.payment": "Payment",
    "booking.confirmation": "Confirmation",
    "booking.firstName": "First Name",
    "booking.lastName": "Last Name",
    "booking.email": "Email",
    "booking.phone": "Phone",
    "booking.adults": "Adults",
    "booking.children": "Children",
    "booking.departureDate": "Departure Date",
    "booking.returnDate": "Return Date",
    "booking.transportation": "Transportation",
    "booking.ticketClass": "Ticket Class",
    "booking.bus": "Bus",
    "booking.plane": "Plane",
    "booking.ship": "Ship",
    "booking.economy": "Economy",
    "booking.business": "Business",
    "booking.luxury": "Luxury",
    "booking.next": "Next",
    "booking.back": "Back",
    "booking.confirm": "Confirm Booking",
    "footer.company": "Company",
    "footer.about": "About Us",
    "footer.careers": "Careers",
    "footer.blog": "Blog",
    "footer.support": "Support",
    "footer.contact": "Contact Us",
    "footer.faq": "FAQ",
    "footer.terms": "Terms of Service",
    "footer.privacy": "Privacy Policy",
    "footer.copyright": "© 2025 TravelEase. All rights reserved.",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
  },
  vi: {
    "nav.home": "Trang chủ",
    "nav.tours": "Tour du lịch",
    "nav.about": "Giới thiệu",
    "nav.contact": "Liên hệ",
    "auth.login": "Đăng nhập",
    "auth.register": "Đăng ký",
    "auth.logout": "Đăng xuất",
    "auth.forgotPassword": "Quên mật khẩu",
    "auth.email": "Email",
    "auth.password": "Mật khẩu",
    "auth.confirmPassword": "Xác nhận mật khẩu",
    "auth.rememberMe": "Ghi nhớ đăng nhập",
    "auth.dontHaveAccount": "Chưa có tài khoản?",
    "auth.alreadyHaveAccount": "Đã có tài khoản?",
    "auth.resetPassword": "Đặt lại mật khẩu",
    "auth.backToLogin": "Quay lại đăng nhập",
    "home.hero.title": "Khám phá cuộc phiêu lưu tiếp theo của bạn",
    "home.hero.subtitle": "Khám phá thế giới với những trải nghiệm du lịch được chọn lọc kỹ lưỡng",
    "home.hero.cta": "Đặt ngay",
    "home.featured": "Tour nổi bật",
    "home.popular": "Điểm đến phổ biến",
    "home.testimonials": "Khách hàng nói gì về chúng tôi",
    "tour.duration": "Thời gian",
    "tour.price": "Giá",
    "tour.rating": "Đánh giá",
    "tour.included": "Bao gồm",
    "tour.notIncluded": "Không bao gồm",
    "tour.itinerary": "Lịch trình",
    "tour.reviews": "Đánh giá",
    "tour.relatedTours": "Tour liên quan",
    "booking.title": "Đặt tour của bạn",
    "booking.personalInfo": "Thông tin cá nhân",
    "booking.travelDetails": "Chi tiết chuyến đi",
    "booking.payment": "Thanh toán",
    "booking.confirmation": "Xác nhận",
    "booking.firstName": "Tên",
    "booking.lastName": "Họ",
    "booking.email": "Email",
    "booking.phone": "Điện thoại",
    "booking.adults": "Người lớn",
    "booking.children": "Trẻ em",
    "booking.departureDate": "Ngày khởi hành",
    "booking.returnDate": "Ngày trở về",
    "booking.transportation": "Phương tiện",
    "booking.ticketClass": "Hạng vé",
    "booking.bus": "Xe khách",
    "booking.plane": "Máy bay",
    "booking.ship": "Tàu thủy",
    "booking.economy": "Phổ thông",
    "booking.business": "Thương gia",
    "booking.luxury": "Sang trọng",
    "booking.next": "Tiếp theo",
    "booking.back": "Quay lại",
    "booking.confirm": "Xác nhận đặt tour",
    "footer.company": "Công ty",
    "footer.about": "Về chúng tôi",
    "footer.careers": "Tuyển dụng",
    "footer.blog": "Blog",
    "footer.support": "Hỗ trợ",
    "footer.contact": "Liên hệ",
    "footer.faq": "Câu hỏi thường gặp",
    "footer.terms": "Điều khoản dịch vụ",
    "footer.privacy": "Chính sách bảo mật",
    "footer.copyright": "© 2025 TravelEase. Bảo lưu mọi quyền.",
    "theme.light": "Sáng",
    "theme.dark": "Tối",
    "theme.system": "Hệ thống",
  },
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  // Use localStorage to persist language preference, but only on client
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "vi")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: string) => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}


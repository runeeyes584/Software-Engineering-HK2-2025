"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react"

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

// Type-safe translations structure
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.tours": "Tours",
    "nav.destinations": "Destinations",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.search": "Search",
    "nav.account": "Account",
    "nav.admin": "Admin",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.logout": "Logout",
    "nav.allTours": "All Tours",
    "nav.allDestinations": "All Destinations",
    "nav.tourCategories": "Tour Categories",
    "nav.regions": "Regions",
    "nav.popular": "Popular",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.reset": "Reset",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.all": "All",
    "common.none": "None",
    "common.yes": "Yes",
    "common.no": "No",
    "common.ok": "OK",
    "common.close": "Close",
    "common.open": "Open",
    "common.more": "More",
    "common.less": "Less",
    "common.show": "Show",
    "common.hide": "Hide",
    "common.expand": "Expand",
    "common.collapse": "Collapse",
    "common.days": "days",
    "common.hours": "hours",
    "common.minutes": "minutes",
    "common.performance": "Performance",
    "common.minutesAgo": "minutes ago",
    "common.hourAgo": "hour ago",
    "common.hoursAgo": "hours ago",

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

    // Search
    "search.placeholder": "Where do you want to go?",
    "search.showing": "Showing",
    "search.of": "of",
    "search.tours": "tours",
    "search.noToursFound": "No tours found",
    "search.searchResults": "Search Results",
    "search.filterResults": "Filter Results",
    "search.button": "Search",
    "search.active": "Active Search",
    "search.noToursMatchFilters": "No tours found matching your criteria",

    // Sort
    "sort.sortBy": "Sort by",
    "sort.recommended": "Recommended",
    "sort.priceLowToHigh": "Price: Low to High",
    "sort.priceHighToLow": "Price: High to Low",
    "sort.ratingHighToLow": "Rating: High to Low",
    "sort.durationShortToLong": "Duration: Short to Long",
    "sort.durationLongToShort": "Duration: Long to Short",
    "sort.newest": "Newest",
    "sort.popular": "Most Popular",

    // Filters
    "filters.title": "Filters",
    "filters.active": "Active Filters",
    "filters.activeFilters": "Active Filters",
    "filters.clearAll": "Clear All",
    "filters.showFilters": "Show Filters",
    "filters.hideFilters": "Hide Filters",
    "filters.remove": "Remove",
    "filters.currency": "USD",
    "filters.price": "Price",
    "filters.priceRange": "Price Range",
    "filters.duration": "Duration",
    "filters.durationRange": "Duration Range",
    "filters.days": "days",
    "filters.rating": "Rating",
    "filters.minimumRating": "Minimum Rating",
    "filters.stars": "stars",
    "filters.category": "Category",
    "filters.categories": "Categories",
    "filters.destination": "Destination",
    "filters.destinations": "Destinations",
    "filters.countries": "Countries",
    "filters.difficulties": "Difficulties",
    "filters.difficulty": "Difficulty",
    "filters.activities": "Activities",
    "filters.activity": "Activity",
    "filters.activityLevels": "Activity Levels",
    "filters.activityLevel": "Activity Level",
    "filters.amenities": "Amenities",
    "filters.amenity": "Amenity",
    "filters.accommodationTypes": "Accommodation Types",
    "filters.accommodation": "Accommodation",
    "filters.transportationTypes": "Transportation Types",
    "filters.transportation": "Transportation",
    "filters.tourLanguages": "Tour Languages",
    "filters.groupSize": "Group Size",
    "filters.maxGroupSize": "Maximum Group Size",
    "filters.person": "person",
    "filters.people": "people",

    // Home
    "home.hero.title": "Discover Amazing Destinations",
    "home.hero.subtitle": "Explore the world with our carefully curated travel experiences",
    "home.hero.cta": "Explore Tours",
    "home.featured.title": "Featured Tours",
    "home.featured": "Featured Tours",
    "home.popular": "Popular Destinations",
    "home.destinations.title": "Popular Destinations",
    "home.whyChoose.title": "Why Choose Us",
    "home.testimonials.title": "What Our Travelers Say",
    "home.testimonials": "What Our Travelers Say",

    // Transport
    "transport.airplane": "Airplane",
    "transport.bus": "Bus",
    "transport.cruiseShip": "Cruise Ship",
    "transport.privateCar": "Private Car",

    // Class
    "class.economy": "Economy",
    "class.economyDesc": "Standard comfort with essential amenities",
    "class.business": "Business",
    "class.businessDesc": "Enhanced comfort with premium services",
    "class.luxury": "Luxury",
    "class.luxuryDesc": "Ultimate comfort with exclusive experiences",

    // Tour Details
    "tour.halongBay.highlights": "Spectacular limestone karsts, overnight cruise, floating villages, cave exploration",
    "tour.halongBay.itinerary.day1.title": "Arrival & Cruise Departure",
    "tour.halongBay.itinerary.day1.description": "Board your traditional junk boat and begin cruising through the stunning bay",
    "tour.halongBay.itinerary.day2.title": "Cave Exploration & Kayaking", 
    "tour.halongBay.itinerary.day2.description": "Explore Sung Sot Cave and kayak through hidden lagoons",
    "tour.halongBay.itinerary.day3.title": "Sunrise & Return",
    "tour.halongBay.itinerary.day3.description": "Watch sunrise over the bay before returning to Hanoi",
    "tour.halongBay.included": "2 nights accommodation, all meals, transfers, English-speaking guide, entrance fees",
    "tour.halongBay.excluded": "Personal expenses, tips, travel insurance, international flights",

    // Tours
    "tours.title": "Tours",
    "tours.featuredTours": "Featured Tours",
    "tours.popularTours": "Popular Tours",
    "tours.viewDetails": "View Details",
    "tours.bookNow": "Book Now",
    "tours.from": "From",
    "tours.perPerson": "per person",
    "tours.rating": "Rating",
    "tours.reviews": "reviews",
    "tours.includes": "Includes",
    "tours.excludes": "Excludes",
    "tours.itinerary": "Itinerary",
    "tours.gallery": "Gallery",
    "tours.location": "Location",
    "tours.duration": "Duration",
    "tours.groupSize": "Group Size",
    "tours.difficulty": "Difficulty",
    "tours.languages": "Languages",
    "tours.cancellation": "Cancellation",
    "tours.activityLevel": "Activity Level",

    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "Get in touch with our travel experts",
    "contact.getInTouch": "Get in Touch",
    "contact.contactInfo": "Contact Information",
    "contact.officeHours": "Office Hours",
    "contact.name": "Full Name",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.subject": "Subject",
    "contact.selectSubject": "Select a subject",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    "contact.sent": "Message sent successfully!",
    "contact.error": "Failed to send message. Please try again.",
    "contact.headquarters": "Headquarters",
    "contact.weekdays": "Monday - Friday",
    "contact.saturday": "Saturday",
    "contact.sunday": "Sunday",
    "contact.closed": "Closed",
    "contact.timeZoneNote": "All times are in Vietnam timezone (GMT+7)",

    "contact.subjects.general": "General Inquiry",
    "contact.subjects.booking": "Booking Assistance",
    "contact.subjects.support": "Customer Support",
    "contact.subjects.feedback": "Feedback",
    "contact.subjects.partnership": "Partnership Inquiry",

    "contact.faq.title": "Frequently Asked Questions",
    "contact.faq.q1": "How do I book a tour?",
    "contact.faq.a1": "You can book a tour directly through our website by selecting your preferred tour and following the booking process.",
    "contact.faq.q2": "What is your cancellation policy?",
    "contact.faq.a2": "We offer free cancellation up to 24 hours before the tour start time. Please check individual tour policies for specific details.",
    "contact.faq.q3": "Do you offer group discounts?",
    "contact.faq.a3": "Yes, we offer special rates for groups of 10 or more people. Contact us for a custom quote.",
    "contact.faq.q4": "Are your tours suitable for children?",
    "contact.faq.a4": "Many of our tours are family-friendly. Check the tour details or contact us to find the best options for your family.",

    // About
    "about.ourStory": "Our Story",
    "about.storyText": "Founded in 2015, TravelVista has been dedicated to creating unforgettable travel experiences for adventurers worldwide. We believe that travel has the power to transform lives and create lasting memories.",
    "about.ourMission": "Our Mission", 
    "about.missionText": "To provide exceptional travel experiences that connect people with the world's most beautiful destinations while promoting sustainable tourism and cultural understanding.",
    "about.ourVision": "Our Vision",
    "about.visionText": "To become the world's most trusted travel companion, inspiring people to explore, discover, and create memories that last a lifetime.",
    "about.ourValues": "Our Values",
    "about.values.authentic.title": "Authentic Experiences",
    "about.values.authentic.description": "We create genuine connections with local cultures and communities.",
    "about.values.sustainable.title": "Sustainable Tourism",
    "about.values.sustainable.description": "We are committed to protecting the environment and supporting local economies.",
    "about.values.satisfaction.title": "Customer Satisfaction",
    "about.values.satisfaction.description": "Your happiness and safety are our top priorities on every journey.",
    "about.values.innovation.title": "Innovation",
    "about.values.innovation.description": "We continuously improve our services using the latest technology and feedback.",
    "about.ourTeam": "Our Team",
    "about.role.ceo": "CEO & Founder",
    "about.bio.sarah": "With over 15 years in the travel industry, Sarah leads our vision for exceptional travel experiences.",
    "about.role.operations": "Head of Operations",
    "about.bio.david": "David ensures every tour runs smoothly with his expertise in logistics and customer service.",
    "about.role.consultant": "Senior Travel Consultant",
    "about.bio.maria": "Maria designs unique itineraries that showcase the best of each destination.",
    "about.role.marketing": "Marketing Director",
    "about.bio.james": "James helps travelers discover their perfect adventure through strategic marketing and partnerships.",
    "about.locations": "Our Locations",
    "about.getInTouch": "Get in Touch",
    "about.cta": "Ready to Start Your Adventure?",
    "about.ctaText": "Join thousands of satisfied travelers who have experienced the world with TravelVista.",

    // Theme
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",

    // Language
    "language.english": "English",
    "language.vietnamese": "Tiếng Việt",

    // Auth
    "auth.login": "Sign In",
    "auth.register": "Sign Up",
    "auth.logout": "Sign Out",
    "auth.profile": "Profile",
    "auth.settings": "Settings",

    // Admin
    "admin.dashboard": "Dashboard",
    "admin.tours": "Tours",
    "admin.bookings": "Bookings",
    "admin.users": "Users",
    "admin.settings": "Settings",
    "admin.analytics": "Analytics",
    "admin.profile": "Profile",

    // Footer
    "footer.terms": "Terms of Service",
    "footer.privacy": "Privacy Policy", 
    "footer.rights": "All rights reserved",

    // Back to Top
    "backToTop": "Back to Top",

    // Chatbot
    "chatbot.title": "Travel Assistant",
    "chatbot.suggestion.beaches": "Best beaches to visit",
    "chatbot.suggestion.booking": "How to book a tour",
    "chatbot.suggestion.cancellation": "Cancellation policy",
    "chatbot.suggestion.discounts": "Available discounts",
    "chatbot.suggestion.bestTime": "Best time to travel",

    // New keys for en
    "tour.departureDate": "Departure Date",
    "tour.returnDate": "Return Date",
    "tour.selectDepartureDate": "Select departure date",
    "tour.selectDepartureDateRequired": "You need to select a departure date",
    "tour.perPerson": "per person",
    "tour.transportation": "Transportation",
    "tour.days": "days",
    "tour.type": "Tour Type",
    "tour.availableSlots": "Available Slots",
    "tour.slots": "slots",
    "tour.reviews": "reviews",
    "tour.class": "Class",
    "tour.adults": "Adults",
    "tour.children": "Children",
    "tour.infants": "Infants",
    "tour.serviceFee": "Service Fee",
    "tour.total": "Total",
    "tour.bookNow": "Book Now",
    "tour.images": "Images",
    "tour.video": "Video",
    "tour.wontBeCharged": "You won't be charged yet",
    "tour.adminReply": "Admin reply",
    "review.updated": "Review updated successfully!",
    "review.editReview": "Edit review",
    "review.update": "Update",
    "review.rating": "Rating",
    "review.ratingDistribution": "Rating Distribution",
    "review.deleted": "Review deleted successfully!",
    "review.deleteError": "Failed to delete review!",
    "review.leaveReview": "Leave a review",
    "review.commentPlaceholder": "Share your experience...",
    "review.submit": "Submit review",
    "review.noReviews": "There are no reviews for this tour yet.",
    "review.edit": "Edit",
    "review.delete": "Delete",
    "review.submitted": "Review submitted successfully!",
    "review.deleteConfirm": "Are you sure you want to delete this review?",
    "review.likeError": "Failed to like review!",
    "review.uploadFile": "Upload file",
    "tour.saved": "Tour saved to favorites!",
    "tour.unsaved": "Tour removed from favorites!",
    "tour.saveButton": "Save",
    "tour.savedButton": "Saved",
    "review.loadMore": "Load More",
    "review.reply": "Reply",
    "review.replyToReview": "Reply to Review",
    "review.yourReply": "Your Reply",
    "review.replyPlaceholder": "Enter your reply here...",
    "review.replySuccess": "Reply sent successfully!",
    "review.replyError": "Failed to send reply!",

    // Home CTA (phẳng)
    "home.cta.title": "Ready for your next adventure?",
    "home.cta.subtitle": "Join thousands of satisfied travelers who have experienced the world with us",
    "home.cta.button": "Browse Tours"
  },
  vi: {
    // Navigation
    "nav.home": "Trang chủ",
    "nav.tours": "Tours",
    "nav.destinations": "Điểm đến",
    "nav.about": "Giới thiệu",
    "nav.contact": "Liên hệ",
    "nav.search": "Tìm kiếm",
    "nav.account": "Tài khoản",
    "nav.admin": "Quản trị",
    "nav.login": "Đăng nhập",
    "nav.signup": "Đăng ký",
    "nav.logout": "Đăng xuất",
    "nav.allTours": "Tất cả Tours",
    "nav.allDestinations": "Tất cả điểm đến",
    "nav.tourCategories": "Danh mục Tours",
    "nav.regions": "Khu vực",
    "nav.popular": "Phổ biến",

    // Common
    "common.loading": "Đang tải...",
    "common.error": "Lỗi",
    "common.success": "Thành công",
    "common.cancel": "Hủy",
    "common.save": "Lưu",
    "common.delete": "Xóa",
    "common.edit": "Chỉnh sửa",
    "common.view": "Xem",
    "common.back": "Quay lại",
    "common.next": "Tiếp theo",
    "common.previous": "Trước đó",
    "common.submit": "Gửi",
    "common.reset": "Đặt lại",
    "common.search": "Tìm kiếm",
    "common.filter": "Lọc",
    "common.sort": "Sắp xếp",
    "common.all": "Tất cả",
    "common.none": "Không có",
    "common.yes": "Có",
    "common.no": "Không",
    "common.ok": "OK",
    "common.close": "Đóng",
    "common.open": "Mở",
    "common.more": "Thêm",
    "common.less": "Ít hơn",
    "common.show": "Hiển thị",
    "common.hide": "Ẩn",
    "common.expand": "Mở rộng",
    "common.collapse": "Thu gọn",
    "common.days": "ngày",
    "common.hours": "giờ",
    "common.minutes": "phút",
    "common.performance": "Hiệu suất",
    "common.minutesAgo": "phút trước",
    "common.hourAgo": "giờ trước",
    "common.hoursAgo": "giờ trước",

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

    // Search
    "search.placeholder": "Bạn muốn đi đâu?",
    "search.showing": "Hiển thị",
    "search.of": "trên",
    "search.tours": "tours",
    "search.noToursFound": "Không tìm thấy tour nào",
    "search.searchResults": "Kết quả tìm kiếm",
    "search.filterResults": "Lọc kết quả",
    "search.button": "Tìm kiếm",
    "search.active": "Tìm kiếm đang hoạt động",
    "search.noToursMatchFilters": "Không tìm thấy tour phù hợp với bộ lọc",

    // Sort
    "sort.sortBy": "Sắp xếp theo",
    "sort.recommended": "Đề xuất",
    "sort.priceLowToHigh": "Giá: Thấp đến Cao",
    "sort.priceHighToLow": "Giá: Cao đến Thấp",
    "sort.ratingHighToLow": "Đánh giá: Cao đến Thấp",
    "sort.durationShortToLong": "Thời gian: Ngắn đến Dài",
    "sort.durationLongToShort": "Thời gian: Dài đến Ngắn",
    "sort.newest": "Mới nhất",
    "sort.popular": "Phổ biến nhất",

    // Filters
    "filters.title": "Bộ lọc",
    "filters.active": "Bộ lọc đang áp dụng",
    "filters.activeFilters": "Bộ lọc đang hoạt động",
    "filters.clearAll": "Xóa tất cả",
    "filters.showFilters": "Hiển thị bộ lọc",
    "filters.hideFilters": "Ẩn bộ lọc",
    "filters.remove": "Xóa",
    "filters.currency": "VND",
    "filters.price": "Giá",
    "filters.priceRange": "Khoảng giá",
    "filters.duration": "Thời gian",
    "filters.durationRange": "Khoảng thời gian",
    "filters.days": "ngày",
    "filters.rating": "Đánh giá",
    "filters.minimumRating": "Đánh giá tối thiểu",
    "filters.stars": "sao",
    "filters.category": "Danh mục",
    "filters.categories": "Danh mục",
    "filters.destination": "Điểm đến",
    "filters.destinations": "Điểm đến",
    "filters.countries": "Quốc gia",
    "filters.difficulties": "Độ khó",
    "filters.difficulty": "Độ khó",
    "filters.activities": "Hoạt động",
    "filters.activity": "Hoạt động",
    "filters.activityLevels": "Mức độ hoạt động",
    "filters.activityLevel": "Mức độ hoạt động",
    "filters.amenities": "Tiện nghi",
    "filters.amenity": "Tiện nghi",
    "filters.accommodationTypes": "Loại chỗ ở",
    "filters.accommodation": "Chỗ ở",
    "filters.transportationTypes": "Phương tiện di chuyển",
    "filters.transportation": "Phương tiện",
    "filters.tourLanguages": "Ngôn ngữ tour",
    "filters.groupSize": "Kích thước nhóm",
    "filters.maxGroupSize": "Kích thước nhóm tối đa",
    "filters.person": "người",
    "filters.people": "người",

    // Home
    "home.hero.title": "Khám Phá Những Điểm Đến Tuyệt Vời",
    "home.hero.subtitle": "Trải nghiệm thế giới với những chuyến du lịch được tuyển chọn kỹ lưỡng",
    "home.hero.cta": "Khám Phá Tours",
    "home.featured.title": "Tours Nổi Bật",
    "home.featured": "Tours Nổi Bật",
    "home.popular": "Điểm Đến Phổ Biến",
    "home.destinations.title": "Điểm Đến Phổ Biến",
    "home.whyChoose.title": "Tại Sao Chọn Chúng Tôi",
    "home.testimonials.title": "Khách Hàng Nói Gì Về Chúng Tôi",
    "home.testimonials": "Khách Hàng Nói Gì Về Chúng Tôi",

    // Transport
    "transport.airplane": "Máy bay",
    "transport.bus": "Xe buýt",
    "transport.cruiseShip": "Tàu du lịch",
    "transport.privateCar": "Xe riêng",

    // Class
    "class.economy": "Phổ thông",
    "class.economyDesc": "Tiện nghi cơ bản với dịch vụ thiết yếu",
    "class.business": "Thương gia",
    "class.businessDesc": "Tiện nghi nâng cao với dịch vụ cao cấp",
    "class.luxury": "Sang trọng",
    "class.luxuryDesc": "Tiện nghi đỉnh cao với trải nghiệm độc quyền",

    // Tour Details
    "tour.halongBay.highlights": "Núi đá vôi ngoạn mục, du thuyền qua đêm, làng chài, khám phá hang động",
    "tour.halongBay.itinerary.day1.title": "Đến & Khởi hành du thuyền",
    "tour.halongBay.itinerary.day1.description": "Lên thuyền buồm truyền thống và bắt đầu hành trình qua vịnh tuyệt đẹp",
    "tour.halongBay.itinerary.day2.title": "Khám phá hang động & Chèo kayak",
    "tour.halongBay.itinerary.day2.description": "Khám phá hang Sửng Sốt và chèo kayak qua những đầm phá ẩn giấu",
    "tour.halongBay.itinerary.day3.title": "Bình minh & Trở về",
    "tour.halongBay.itinerary.day3.description": "Ngắm bình minh trên vịnh trước khi trở về Hà Nội",
    "tour.halongBay.included": "2 đêm nghỉ dưỡng, tất cả bữa ăn, đưa đón, hướng dẫn viên tiếng Anh, phí tham quan",
    "tour.halongBay.excluded": "Chi phí cá nhân, tiền tip, bảo hiểm du lịch, vé máy bay quốc tế",

    // Tours
    "tours.title": "Tours",
    "tours.featuredTours": "Tours nổi bật",
    "tours.popularTours": "Tours phổ biến",
    "tours.viewDetails": "Xem chi tiết",
    "tours.bookNow": "Đặt ngay",
    "tours.from": "Từ",
    "tours.perPerson": "mỗi người",
    "tours.rating": "Đánh giá",
    "tours.reviews": "đánh giá",
    "tours.includes": "Bao gồm",
    "tours.excludes": "Không bao gồm",
    "tours.itinerary": "Lịch trình",
    "tours.gallery": "Thư viện ảnh",
    "tours.location": "Địa điểm",
    "tours.duration": "Thời gian",
    "tours.groupSize": "Kích thước nhóm",
    "tours.difficulty": "Độ khó",
    "tours.languages": "Ngôn ngữ",
    "tours.cancellation": "Hủy tour",
    "tours.activityLevel": "Mức độ hoạt động",

    // Contact
    "contact.title": "Liên hệ với chúng tôi",
    "contact.subtitle": "Liên hệ với các chuyên gia du lịch của chúng tôi",
    "contact.getInTouch": "Liên hệ",
    "contact.contactInfo": "Thông tin liên hệ",
    "contact.officeHours": "Giờ làm việc",
    "contact.name": "Họ và tên",
    "contact.email": "Địa chỉ email",
    "contact.phone": "Số điện thoại",
    "contact.subject": "Chủ đề",
    "contact.selectSubject": "Chọn chủ đề",
    "contact.message": "Tin nhắn",
    "contact.send": "Gửi tin nhắn",
    "contact.sending": "Đang gửi...",
    "contact.sent": "Tin nhắn đã được gửi thành công!",
    "contact.error": "Gửi tin nhắn thất bại. Vui lòng thử lại.",
    "contact.headquarters": "Trụ sở chính",
    "contact.weekdays": "Thứ 2 - Thứ 6",
    "contact.saturday": "Thứ 7",
    "contact.sunday": "Chủ nhật",
    "contact.closed": "Đóng cửa",
    "contact.timeZoneNote": "Tất cả thời gian theo múi giờ Việt Nam (GMT+7)",

    "contact.subjects.general": "Câu hỏi chung",
    "contact.subjects.booking": "Hỗ trợ đặt tour",
    "contact.subjects.support": "Hỗ trợ khách hàng",
    "contact.subjects.feedback": "Phản hồi",
    "contact.subjects.partnership": "Hợp tác kinh doanh",

    "contact.info.title": "Thông tin liên hệ",
    "contact.info.address": "123 Đường Du lịch, Thành phố Phiêu lưu, AC 12345",
    "contact.info.phone": "+84 (28) 123-4567",
    "contact.info.email": "info@travelvista.com",
    "contact.info.hours": "Giờ làm việc",
    "contact.info.weekdays": "Thứ 2 - Thứ 6: 9:00 - 18:00",
    "contact.info.weekend": "Thứ 7 - Chủ nhật: 10:00 - 16:00",

    "contact.faq.title": "Câu hỏi thường gặp",
    "contact.faq.q1": "Làm thế nào để đặt tour?",
    "contact.faq.a1": "Bạn có thể đặt tour trực tiếp trên website của chúng tôi bằng cách chọn tour mong muốn và làm theo quy trình đặt tour.",
    "contact.faq.q2": "Chính sách hủy tour của bạn như thế nào?",
    "contact.faq.a2": "Chúng tôi cho phép hủy tour miễn phí trước 24 giờ so với thời gian bắt đầu tour. Vui lòng kiểm tra chính sách cụ thể của từng tour.",
    "contact.faq.q3": "Bạn có cung cấp giảm giá cho nhóm không?",
    "contact.faq.a3": "Có, chúng tôi cung cấp giá đặc biệt cho nhóm từ 10 người trở lên. Liên hệ với chúng tôi để được báo giá tùy chỉnh.",
    "contact.faq.q4": "Các tour của bạn có phù hợp với trẻ em không?",
    "contact.faq.a4": "Nhiều tour của chúng tôi phù hợp với gia đình có trẻ em. Kiểm tra chi tiết tour hoặc liên hệ với chúng tôi để tìm lựa chọn tốt nhất cho gia đình bạn.",

    // About
    "about.ourStory": "Câu chuyện của chúng tôi",
    "about.storyText": "Được thành lập vào năm 2015, TravelVista đã tận tụy tạo ra những trải nghiệm du lịch khó quên cho các nhà thám hiểm trên toàn thế giới. Chúng tôi tin rằng du lịch có sức mạnh thay đổi cuộc sống và tạo ra những kỷ niệm lâu dài.",
    "about.ourMission": "Sứ mệnh của chúng tôi",
    "about.missionText": "Cung cấp những trải nghiệm du lịch đặc biệt kết nối mọi người với những điểm đến đẹp nhất thế giới đồng thời thúc đẩy du lịch bền vững và hiểu biết văn hóa.",
    "about.ourVision": "Tầm nhìn của chúng tôi",
    "about.visionText": "Trở thành người bạn đồng hành du lịch đáng tin cậy nhất thế giới, truyền cảm hứng cho mọi người khám phá, khám phá và tạo ra những kỷ niệm kéo dài suốt đời.",
    "about.ourValues": "Giá trị của chúng tôi",
    "about.values.authentic.title": "Trải nghiệm chân thực",
    "about.values.authentic.description": "Chúng tôi tạo ra những kết nối chân thực với văn hóa và cộng đồng địa phương.",
    "about.values.sustainable.title": "Du lịch bền vững",
    "about.values.sustainable.description": "Chúng tôi cam kết bảo vệ môi trường và hỗ trợ nền kinh tế địa phương.",
    "about.values.satisfaction.title": "Sự hài lòng của khách hàng",
    "about.values.satisfaction.description": "Hạnh phúc và an toàn của bạn là ưu tiên hàng đầu của chúng tôi trong mọi chuyến đi.",
    "about.values.innovation.title": "Đổi mới",
    "about.values.innovation.description": "Chúng tôi liên tục cải thiện dịch vụ bằng công nghệ mới nhất và phản hồi.",
    "about.ourTeam": "Đội ngũ của chúng tôi",
    "about.role.ceo": "CEO & Người sáng lập",
    "about.bio.sarah": "Với hơn 15 năm trong ngành du lịch, Sarah dẫn dắt tầm nhìn của chúng tôi về những trải nghiệm du lịch đặc biệt.",
    "about.role.operations": "Trưởng phòng Vận hành",
    "about.bio.david": "David đảm bảo mọi tour diễn ra suôn sẻ với chuyên môn về logistics và dịch vụ khách hàng.",
    "about.role.consultant": "Tư vấn Du lịch Cấp cao",
    "about.bio.maria": "Maria thiết kế những hành trình độc đáo thể hiện điều tốt nhất của mỗi điểm đến.",
    "about.role.marketing": "Giám đốc Marketing",
    "about.bio.james": "James giúp du khách khám phá cuộc phiêu lưu hoàn hảo thông qua marketing chiến lược và hợp tác.",
    "about.locations": "Địa điểm của chúng tôi",
    "about.getInTouch": "Liên hệ",
    "about.cta": "Sẵn sàng bắt đầu cuộc phiêu lưu?",
    "about.ctaText": "Tham gia cùng hàng nghìn du khách hài lòng đã trải nghiệm thế giới với TravelVista.",

    // Theme
    "theme.light": "Sáng",
    "theme.dark": "Tối",
    "theme.system": "Hệ thống",

    // Language
    "language.english": "English",
    "language.vietnamese": "Tiếng Việt",

    // Auth
    "auth.login": "Đăng nhập",
    "auth.register": "Đăng ký",
    "auth.logout": "Đăng xuất",
    "auth.profile": "Hồ sơ",
    "auth.settings": "Cài đặt",

    // Admin
    "admin.dashboard": "Bảng điều khiển",
    "admin.tours": "Tours",
    "admin.bookings": "Đặt tour",
    "admin.users": "Người dùng",
    "admin.settings": "Cài đặt",
    "admin.analytics": "Phân tích",
    "admin.profile": "Hồ sơ",

    // Footer
    "footer.terms": "Điều khoản dịch vụ",
    "footer.privacy": "Chính sách bảo mật",
    "footer.rights": "Bảo lưu mọi quyền",

    // Back to Top
    "backToTop": "Về đầu trang",

    // Chatbot
    "chatbot.title": "Trợ lý Du lịch",
    "chatbot.suggestion.beaches": "Bãi biển đẹp nhất để thăm",
    "chatbot.suggestion.booking": "Cách đặt tour",
    "chatbot.suggestion.cancellation": "Chính sách hủy tour",
    "chatbot.suggestion.discounts": "Ưu đãi có sẵn",
    "chatbot.suggestion.bestTime": "Thời gian tốt nhất để du lịch",

    // New keys for vi
    "tour.departureDate": "Ngày đi",
    "tour.returnDate": "Ngày đến",
    "tour.selectDepartureDate": "Chọn ngày đi",
    "tour.selectDepartureDateRequired": "Bạn cần chọn thời gian khởi hành",
    "tour.perPerson": "mỗi người",
    "tour.transportation": "Phương tiện",
    "tour.days": "ngày",
    "tour.type": "Loại tour",
    "tour.availableSlots": "Chỗ còn lại",
    "tour.slots": "chỗ",
    "tour.reviews": "đánh giá",
    "tour.class": "Hạng vé",
    "tour.adults": "Người lớn",
    "tour.children": "Trẻ em",
    "tour.infants": "Em bé",
    "tour.serviceFee": "Phí dịch vụ",
    "tour.total": "Tổng cộng",
    "tour.bookNow": "Đặt ngay",
    "tour.images": "Hình ảnh",
    "tour.video": "Video",
    "tour.wontBeCharged": "Bạn sẽ không bị trừ tiền ngay",
    "tour.adminReply": "Phản hồi từ quản trị viên",
    "review.updated": "Sửa review thành công!",
    "review.editReview": "Chỉnh sửa đánh giá",
    "review.update": "Cập nhật",
    "review.rating": "Đánh giá",
    "review.ratingDistribution": "Phân bố đánh giá",
    "review.deleted": "Xóa review thành công!",
    "review.deleteError": "Xóa review thất bại!",
    "review.leaveReview": "Để lại đánh giá",
    "review.commentPlaceholder": "Chia sẻ trải nghiệm của bạn...",
    "review.submit": "Gửi đánh giá",
    "review.noReviews": "Chưa có đánh giá nào cho tour này.",
    "review.edit": "Sửa",
    "review.delete": "Xóa",
    "review.submitted": "Gửi đánh giá thành công!",
    "review.deleteConfirm": "Bạn có chắc muốn xóa review này?",
    "review.likeError": "Lỗi khi like review!",
    "review.uploadFile": "Tải file lên",
    "tour.saved": "Đã lưu tour vào yêu thích!",
    "tour.unsaved": "Đã bỏ lưu tour!",
    "tour.saveButton": "Lưu",
    "tour.savedButton": "Đã lưu",
    "review.loadMore": "Xem thêm",
    "review.reply": "Phản hồi",
    "review.replyToReview": "Phản hồi đánh giá",
    "review.yourReply": "Phản hồi của bạn",
    "review.replyPlaceholder": "Nhập phản hồi của bạn vào đây...",
    "review.replySuccess": "Phản hồi đã được gửi thành công!",
    "review.replyError": "Gửi phản hồi thất bại!",

    // Home CTA (phẳng)
    "home.cta.title": "Sẵn sàng cho cuộc phiêu lưu tiếp theo?",
    "home.cta.subtitle": "Tham gia cùng hàng nghìn khách du lịch hài lòng đã trải nghiệm thế giới với chúng tôi",
    "home.cta.button": "Xem Tour"
  },
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
      const currentTranslations = translations[language] || {};
      let translation = currentTranslations[id];
      // Fallback to English if translation not found
      if (!translation && language !== "en") {
        translation = translations.en[id];
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

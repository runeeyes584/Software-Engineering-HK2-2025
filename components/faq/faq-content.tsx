"use client"

import { useLanguage } from "@/components/language-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { useState } from "react"

// FAQ data organized by categories
const faqData = {
  booking: [
    {
      question: "How do I book a tour?",
      answer:
        "You can book a tour directly through our website. Browse our available tours, select the one you're interested in, choose your preferred dates, and follow the booking process. You'll receive a confirmation email once your booking is complete.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For some destinations, we also offer payment on arrival, but this requires pre-approval.",
    },
    {
      question: "Can I book a tour for someone else?",
      answer:
        "Yes, you can book a tour for someone else. During the booking process, you'll have the option to enter the traveler's details. Just make sure to provide accurate information for all participants.",
    },
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking as early as possible, especially for popular destinations during peak season. For most tours, booking 2-3 months in advance is ideal, but last-minute bookings are sometimes available.",
    },
    {
      question: "Is there a minimum number of participants required for a tour?",
      answer:
        "Some of our group tours require a minimum number of participants to operate. This information is clearly stated on the tour page. If the minimum is not met, we'll offer you alternative dates, a different tour, or a full refund.",
    },
  ],
  cancellation: [
    {
      question: "What is your cancellation policy?",
      answer:
        "Our standard cancellation policy allows for a full refund if cancelled 30 days or more before the tour start date. Cancellations made 15-29 days before receive a 50% refund. Cancellations less than 15 days before the tour are non-refundable. Some tours may have specific cancellation policies, which will be clearly stated during booking.",
    },
    {
      question: "Can I change the date of my tour after booking?",
      answer:
        "Yes, date changes are possible subject to availability. Changes requested 30 days or more before the tour are free of charge. Changes requested within 30 days may incur a fee. Please contact our customer service team to request a date change.",
    },
    {
      question: "Is my deposit refundable if I cancel?",
      answer:
        "Deposit refunds follow our standard cancellation policy. If you cancel 30 days or more before the tour, your deposit is fully refundable. Within 30 days, refund policies vary based on how close to the tour date you cancel.",
    },
    {
      question: "What happens if TravelEase cancels a tour?",
      answer:
        "If we need to cancel a tour for any reason (such as insufficient participants, weather conditions, or safety concerns), you'll be offered a full refund or the option to transfer to another tour or date.",
    },
  ],
  tours: [
    {
      question: "What's included in the tour price?",
      answer:
        "Tour inclusions vary by package, but generally include accommodation, transportation during the tour, a professional guide, entrance fees to attractions listed in the itinerary, and some meals. The specific inclusions are clearly listed on each tour page.",
    },
    {
      question: "How many people are typically in a tour group?",
      answer:
        "Our standard group tours usually have between 8-16 participants. Small group tours are limited to 8 participants. Private tours can be arranged for any number of travelers.",
    },
    {
      question: "Are your tours suitable for children?",
      answer:
        "Many of our tours are family-friendly, but some may have age restrictions due to the nature of activities or the duration. Family-friendly tours are marked accordingly, and age recommendations are provided in the tour details.",
    },
    {
      question: "Do you offer private tours?",
      answer:
        "Yes, most of our tours can be arranged as private experiences. This gives you more flexibility with the itinerary and ensures a more personalized experience. Contact us for private tour options and pricing.",
    },
    {
      question: "What languages are your tours conducted in?",
      answer:
        "Our standard tours are conducted in English. We also offer guides who speak Vietnamese, French, Spanish, German, and Chinese for many destinations. Please request your preferred language when booking.",
    },
  ],
  practical: [
    {
      question: "Do I need a visa to visit Vietnam?",
      answer:
        "Visa requirements depend on your nationality and the length of your stay. Many countries are eligible for visa exemptions for stays up to 15 days. For longer stays, you'll need to obtain a visa in advance or an e-visa. We recommend checking the latest visa information with the Vietnamese embassy in your country.",
    },
    {
      question: "What's the best time to visit Vietnam?",
      answer:
        "Vietnam has diverse climates across regions. Generally, the best time to visit is during spring (February to April) and autumn (August to October) when temperatures are more moderate. The south has a tropical climate with a rainy season from May to November, while the north has distinct seasons with winter from November to April.",
    },
    {
      question: "Is travel insurance required?",
      answer:
        "While not mandatory for booking, we strongly recommend comprehensive travel insurance that covers medical expenses, trip cancellation, and lost luggage. For adventure tours and activities, insurance is required.",
    },
    {
      question: "What should I pack for my trip?",
      answer:
        "Packing recommendations depend on your specific tour and the season. Generally, lightweight, breathable clothing is recommended, along with comfortable walking shoes, sun protection, and insect repellent. For northern Vietnam in winter, warmer layers are necessary. A detailed packing list is provided with your booking confirmation.",
    },
    {
      question: "Is it safe to drink tap water in Vietnam?",
      answer:
        "We recommend drinking bottled or filtered water throughout Vietnam. Bottled water is widely available and inexpensive. On our tours, we often provide drinking water to reduce plastic waste.",
    },
  ],
  account: [
    {
      question: "How do I create an account?",
      answer:
        "You can create an account by clicking the 'Register' button in the top right corner of our website. Fill in your details, and you'll receive a confirmation email to activate your account.",
    },
    {
      question: "I forgot my password. How do I reset it?",
      answer:
        "Click on the 'Login' button, then select 'Forgot Password'. Enter your email address, and we'll send you instructions to reset your password.",
    },
    {
      question: "How can I view my booking history?",
      answer:
        "After logging in, go to your account dashboard and select 'My Bookings' to view all your past and upcoming tours.",
    },
    {
      question: "Can I save tours to book later?",
      answer:
        "Yes, you can add tours to your wishlist by clicking the heart icon on any tour. Access your wishlist from your account dashboard.",
    },
  ],
}

export default function FaqContent() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter FAQs based on search query and active tab
  const getFilteredFaqs = () => {
    const allFaqs = Object.values(faqData).flat()

    // Filter by search query
    const searchFiltered = searchQuery
      ? allFaqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : allFaqs

    // Filter by category tab
    if (activeTab === "all") {
      return searchFiltered
    } else {
      return searchQuery ? searchFiltered : faqData[activeTab as keyof typeof faqData] || []
    }
  }

  const filteredFaqs = getFilteredFaqs()

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-muted py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground mb-8">
              Find answers to common questions about our tours, booking process, and more.
            </p>

            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container py-16">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="flex flex-wrap justify-center">
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="cancellation">Cancellation & Changes</TabsTrigger>
            <TabsTrigger value="tours">Tours & Activities</TabsTrigger>
            <TabsTrigger value="practical">Practical Info</TabsTrigger>
            <TabsTrigger value="account">Account & Website</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any FAQs matching your search. Try different keywords or browse the categories.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-16 bg-muted/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If you couldn't find the answer to your question, our friendly customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <a href="/contact">Contact Us</a>
            </Button>
            <Button variant="outline">Live Chat</Button>
          </div>
        </div>
      </div>
    </div>
  )
}


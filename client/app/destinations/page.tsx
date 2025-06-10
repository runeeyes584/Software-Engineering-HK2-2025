"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function DestinationsPage() {
  const { t } = useLanguage()

  // Mock destinations data
  const destinations = [
    {
      id: 1,
      name: "Vietnam",
      image: "/placeholder.svg?height=400&width=600",
      description: "Discover the rich culture, stunning landscapes, and delicious cuisine of Vietnam.",
      popular: ["Hanoi", "Ho Chi Minh City", "Halong Bay", "Hoi An", "Sapa"],
    },
    {
      id: 2,
      name: "Thailand",
      image: "/placeholder.svg?height=400&width=600",
      description: "Experience the vibrant street life, beautiful beaches, and ancient temples of Thailand.",
      popular: ["Bangkok", "Phuket", "Chiang Mai", "Krabi", "Koh Samui"],
    },
    {
      id: 3,
      name: "Japan",
      image: "/placeholder.svg?height=400&width=600",
      description: "Explore the perfect blend of tradition and modernity in the Land of the Rising Sun.",
      popular: ["Tokyo", "Kyoto", "Osaka", "Hokkaido", "Okinawa"],
    },
    {
      id: 4,
      name: "Indonesia",
      image: "/placeholder.svg?height=400&width=600",
      description: "Relax on pristine beaches, trek through jungles, and immerse yourself in local traditions.",
      popular: ["Bali", "Jakarta", "Yogyakarta", "Lombok", "Komodo Island"],
    },
    {
      id: 5,
      name: "Malaysia",
      image: "/placeholder.svg?height=400&width=600",
      description: "Experience diverse cultures, modern cities, and untouched natural wonders.",
      popular: ["Kuala Lumpur", "Penang", "Langkawi", "Borneo", "Malacca"],
    },
    {
      id: 6,
      name: "Singapore",
      image: "/placeholder.svg?height=400&width=600",
      description: "Discover the ultimate urban destination with amazing food, shopping, and attractions.",
      popular: ["Marina Bay", "Sentosa Island", "Gardens by the Bay", "Orchard Road", "Chinatown"],
    },
  ]

  const continents = [
    { name: "Asia", count: 15 },
    { name: "Europe", count: 22 },
    { name: "Africa", count: 12 },
    { name: "North America", count: 10 },
    { name: "South America", count: 8 },
    { name: "Oceania", count: 6 },
  ]

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">{t("nav.destinations")}</h1>

      {/* Hero Section */}
      <div className="relative h-[300px] rounded-lg overflow-hidden mb-8">
        <Image src="/placeholder.svg?height=600&width=1200" alt="World map" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white p-6 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Explore the World</h2>
            <p className="mb-6">Discover amazing destinations and plan your next adventure</p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search destinations..." className="pl-10 bg-white/90 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Continents */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Explore by Continent</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {continents.map((continent) => (
            <Card key={continent.name} className="hover:bg-accent transition-colors">
              <CardContent className="p-4 text-center">
                <Link href={`/destinations/continent/${continent.name.toLowerCase()}`} className="block">
                  <h3 className="font-medium">{continent.name}</h3>
                  <p className="text-sm text-muted-foreground">{continent.count} countries</p>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Destinations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Featured Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                <p className="text-muted-foreground mb-4">{destination.description}</p>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Popular Places:</h4>
                  <div className="flex flex-wrap gap-2">
                    {destination.popular.map((place) => (
                      <div key={place} className="bg-muted px-2 py-1 rounded-md text-xs">
                        {place}
                      </div>
                    ))}
                  </div>
                </div>
                <Button asChild>
                  <Link href={`/destinations/${destination.id}`}>Explore</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

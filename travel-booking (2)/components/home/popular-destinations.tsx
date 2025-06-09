"use client"

import { useLanguage } from "@/components/language-provider"
import { Card } from "@/components/ui/card"

const destinations = [
  {
    id: 1,
    name: "Hanoi",
    tours: 24,
    image: "/Hanoi.jpg?height=400&width=300",
  },
  {
    id: 2,
    name: "Ho Chi Minh City",
    tours: 32,
    image: "/hcm.jpg?height=400&width=300",
  },
  {
    id: 3,
    name: "Da Nang",
    tours: 18,
    image: "/DaNang.jpg?height=400&width=300",
  },
  {
    id: 4,
    name: "Nha Trang",
    tours: 15,
    image: "/NhaTrang.jpg?height=400&width=300",
  },
  {
    id: 5,
    name: "Da Lat",
    tours: 20,
    image: "/DaLat.jpg?height=400&width=300",
  },
  {
    id: 6,
    name: "Hue",
    tours: 12,
    image: "/Hue.jpg?height=400&width=300",
  },
]

export default function PopularDestinations() {
  const { t } = useLanguage()

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{t("home.popular")}</h2>
          <div className="w-20 h-1 bg-primary rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden group">
              <div className="aspect-[3/4] relative">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-1">{destination.name}</h3>
                  <p className="text-white/80 text-sm">{destination.tours} tours available</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


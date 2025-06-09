"use client"

import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 5,
    text: "Our trip to Vietnam was absolutely amazing! The tour guides were knowledgeable and friendly, and the itinerary was perfectly balanced between activities and relaxation time.",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 5,
    text: "The Halong Bay cruise exceeded all my expectations. The boat was comfortable, the food was delicious, and the views were breathtaking. I'll definitely book with TravelEase again!",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 4,
    text: "We had a wonderful time exploring Hoi An. The ancient town is so charming, and our guide showed us all the best local spots. The only reason for 4 stars is that the hotel was a bit far from the center.",
  },
]

export default function Testimonials() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{t("home.testimonials")}</h2>
          <div className="w-20 h-1 bg-primary rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <div className="flex">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


"use client"

import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clock, Users, Heart, Share2, Eye, Award, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Tour } from "@/hooks/use-optimized-tour-filters"

interface LocalizedTourCardProps {
  tour: Tour
  isListView?: boolean
}

export default function LocalizedTourCard({ tour, isListView = false }: LocalizedTourCardProps) {
  const { t } = useLanguage()

  const getTranslatedValue = (key: string, value: string): string => {
    const translationKey = `${key}.${value.toLowerCase().replace(/\s+/g, "")}`
    const translated = t(translationKey)
    return translated !== translationKey ? translated : value
  }

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 group ${
        isListView ? "flex flex-row" : ""
      }`}
    >
      <div className={`relative ${isListView ? "w-80 flex-shrink-0" : ""}`}>
        <Image
          src={tour.image || "/placeholder.svg"}
          alt={tour.title}
          width={isListView ? 320 : 400}
          height={isListView ? 200 : 250}
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
            isListView ? "w-80 h-48" : "w-full h-48"
          }`}
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary">{getTranslatedValue("categories", tour.category)}</Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="default" className="bg-black/70 text-white">
            {t("filters.currency")}
            {tour.price}
          </Badge>
        </div>
        {tour.difficulty && (
          <div className="absolute bottom-2 left-2">
            <Badge
              variant={
                tour.difficulty === "Easy" ? "default" : tour.difficulty === "Moderate" ? "secondary" : "destructive"
              }
            >
              {getTranslatedValue("tours.difficulty", tour.difficulty)}
            </Badge>
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={t("tours.addToWishlist") || "Add to wishlist"}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={t("tours.share") || "Share"}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`flex flex-col ${isListView ? "flex-1" : ""}`}>
        <CardHeader className={isListView ? "pb-2" : ""}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle
                className={`line-clamp-1 group-hover:text-primary transition-colors ${isListView ? "text-lg" : ""}`}
              >
                {tour.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {tour.location}, {getTranslatedValue("countries", tour.country)}
              </CardDescription>
            </div>
            {tour.rating >= 4.8 && (
              <Badge variant="outline" className="ml-2">
                <Award className="h-3 w-3 mr-1" />
                {t("tours.topRated") || "Top Rated"}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className={`flex-1 ${isListView ? "pb-2" : ""}`}>
          <p className={`text-sm text-muted-foreground mb-3 ${isListView ? "line-clamp-2" : "line-clamp-2"}`}>
            {tour.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {tour.duration} {t("filters.days")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {t("filters.maximum")} {tour.groupSize} {t("filters.people")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{tour.rating}</span>
              </div>
            </div>

            {tour.features && tour.features.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tour.features.slice(0, isListView ? 4 : 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {tour.features.length > (isListView ? 4 : 3) && (
                  <Badge variant="outline" className="text-xs">
                    +{tour.features.length - (isListView ? 4 : 3)} {t("tours.more") || "more"}
                  </Badge>
                )}
              </div>
            )}

            {tour.activityLevel && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                {t("filters.activityLevel")}: {getTranslatedValue("tours.activityLevel", tour.activityLevel)}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className={`flex items-center justify-between ${isListView ? "pt-2" : ""}`}>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">
              {t("filters.currency")}
              {tour.price}
            </span>
            <span className="text-xs text-muted-foreground">{t("tours.perPerson")}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/tours/${tour.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                {t("tours.viewDetails")}
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/tours/${tour.id}`}>{t("tours.bookNow")}</Link>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}

"use client"

import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FeaturedTours() {
  const { t } = useLanguage();
  
  // State để lưu dữ liệu tour
  const [featuredTours, setFeaturedTours] = useState<any[]>([]);
  
  // State để lưu lỗi nếu có
  const [error, setError] = useState("");

  useEffect(() => {
    // Lấy dữ liệu tour từ API
    const fetchFeaturedTours = async () => {
      try {
        const response = await fetch("https://localhost:7129/api/tours"); // URL API của bạn
        const data = await response.json();
        // Lấy 4 tour đầu tiên
        setFeaturedTours(data.slice(0, 4)); // Chỉ lấy 4 tour đầu tiên
      } catch (error) {
        setError("Có lỗi khi tải danh sách tour.");
      }
    };

    fetchFeaturedTours();
  }, []);

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{t("home.featured")}</h2>
          <div className="w-20 h-1 bg-primary rounded-full"></div>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        {/* Hiển thị danh sách các tour */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTours.length > 0 ? (
            featuredTours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden">
                <div className="aspect-[3/2] relative">
                  <img src={tour.imageUrl || "/placeholder.svg"} alt={tour.name} className="object-cover w-full h-full" />
                  <Badge className="absolute top-2 right-2">
                    {tour.rating} <Star className="ml-1 h-3 w-3 fill-current" />
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle>{tour.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    {tour.destination}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-1 h-4 w-4" />
                    {tour.duration} days
                  </div>
                  <div className="mt-2 font-bold text-lg">
                    ${tour.price}
                    <span className="text-sm font-normal text-muted-foreground ml-1">/ person</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/tours/${tour.id}`}>{t("home.hero.cta")}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center">
              <p>{t("home.noToursAvailable")}</p>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/tours">Xem tất cả tour</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

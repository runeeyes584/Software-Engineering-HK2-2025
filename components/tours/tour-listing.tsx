"use client";

import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Clock, Filter, MapPin, Search, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TourListing() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [tours, setTours] = useState<any[]>([]); // State để lưu dữ liệu từ API
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");

  // Fetch dữ liệu từ API khi component được render
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("https://localhost:7129/api/tours"); // Đảm bảo API đang chạy ở cổng này
        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }
        const data = await response.json();
        setTours(data); // Cập nhật dữ liệu
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };
  
    fetchTours();
  }, []);
  
  // Filter tours based on search and filters
  const filteredTours = tours.filter((tour) => {
    // Search filter
    const matchesSearch =
      tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchQuery.toLowerCase());

    // Price filter
    const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1];

    // Duration filter
    let matchesDuration = true;
    if (selectedDurations.length > 0) {
      const days = Number.parseInt(tour.duration.toString());
      matchesDuration = false;

      for (const duration of selectedDurations) {
        if (duration === "1" && days === 1) matchesDuration = true;
        if (duration === "2-3" && days >= 2 && days <= 3) matchesDuration = true;
        if (duration === "4-7" && days >= 4 && days <= 7) matchesDuration = true;
        if (duration === "8+" && days >= 8) matchesDuration = true;
      }
    }

    return matchesSearch && matchesPrice && matchesDuration;
  });

  // Sort tours
  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "duration") {
      const aDays = Number.parseInt(a.duration.toString());
      const bDays = Number.parseInt(b.duration.toString());
      return aDays - bDays;
    }
    // Default: recommended (no specific sort)
    return 0;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 500]);
    setSelectedDurations([]);
    setSortBy("recommended");
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Our Tours</h1>
          <p className="text-muted-foreground">Discover amazing travel experiences in Vietnam</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tours, destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your search results</SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Price Range</h3>
                    <div className="space-y-2">
                      <Slider value={priceRange} min={0} max={1000} step={10} onValueChange={setPriceRange} />
                      <div className="flex justify-between text-sm">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Duration</h3>
                    <div className="space-y-2">
                      {["1", "2-3", "4-7", "8+"].map((duration) => (
                        <div key={duration} className="flex items-center space-x-2">
                          <Checkbox
                            id={`duration-${duration}`}
                            checked={selectedDurations.includes(duration)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedDurations([...selectedDurations, duration]);
                              } else {
                                setSelectedDurations(selectedDurations.filter((d) => d !== duration));
                              }
                            }}
                          />
                          <Label htmlFor={`duration-${duration}`}>{duration} days</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTours.length > 0 ? (
            sortedTours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden">
                <div className="aspect-[3/2] relative">
                  <img src={tour.imageUrl || "/placeholder.svg"} alt={tour.name} className="object-cover w-full h-full" />
                  <Badge className="absolute top-2 right-2">
                    {tour.rating} <Star className="ml-1 h-3 w-3 fill-current" />
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{tour.name}</CardTitle>
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
                    <Link href={`/tours/${tour.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <h3 className="text-xl font-semibold mb-2">No tours found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

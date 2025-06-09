"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, MapPin, Search } from "lucide-react"
import { useState } from "react"

export default function HeroSection() {
  const { t } = useLanguage()
  const [searchType, setSearchType] = useState("tour")

  // Search inputs
  const [destination, setDestination] = useState("")
  const [location, setLocation] = useState("")

  // Date selection
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined)
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined)

  // Participants
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  // Advanced options toggle
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = () => {
    // Here you would typically handle the search logic
    console.log({
      searchType,
      destination,
      location,
      departureDate,
      returnDate,
      adults,
      children,
    })

    // Redirect to search results page
    window.location.href = `/tours?destination=${encodeURIComponent(destination)}&location=${encodeURIComponent(location)}`
  }

  return (
    <div className="relative">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg?height=700&width=1200')" }}
      />
      <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
      <div className="container relative z-20 py-20 md:py-32">
        <div className="max-w-3xl space-y-4 text-white">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">{t("home.hero.title")}</h1>
          <p className="text-lg md:text-xl text-white/80">{t("home.hero.subtitle")}</p>
        </div>

        {/* Dark-themed Booking Widget */}
        <div className="mt-10 max-w-4xl">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6">
            <Tabs defaultValue="tour" value={searchType} onValueChange={setSearchType} className="mb-6">
              <TabsList className="grid grid-cols-3 bg-gray-800/50">
                <TabsTrigger value="tour" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  Tours
                </TabsTrigger>
                <TabsTrigger value="hotel" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  Hotels
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  Activities
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tour Type or Destination */}
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-white">
                    {searchType === "tour" ? "Tour Type or Destination" : "Search"}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="destination"
                      placeholder="Search tours..."
                      className="pl-10 bg-black/50 border-gray-700 text-white placeholder:text-gray-500"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>

                {/* Where to? */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">
                    Where to?
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="location"
                      placeholder="City, region, or specific place"
                      className="pl-10 bg-black/50 border-gray-700 text-white placeholder:text-gray-500"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Departure Date */}
                <div className="space-y-2">
                  <Label htmlFor="departureDate" className="text-white">
                    Departure Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="departureDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-black/50 border-gray-700",
                          !departureDate && "text-gray-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {departureDate ? format(departureDate, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={departureDate}
                        onSelect={setDepartureDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Return Date */}
                <div className="space-y-2">
                  <Label htmlFor="returnDate" className="text-white">
                    Return Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="returnDate"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-black/50 border-gray-700",
                          !returnDate && "text-gray-500",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {returnDate ? format(returnDate, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        initialFocus
                        disabled={(date) => (departureDate ? date < departureDate : date < new Date())}
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Travelers */}
                <div className="space-y-2 w-full md:w-auto">
                  <Label className="text-white">Travelers</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="bg-black/50 border-gray-700 text-white flex-1 md:w-40">
                          <span>
                            {adults} {adults === 1 ? "Adult" : "Adults"}
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 bg-gray-900 border-gray-700 text-white">
                        <div className="p-2">
                          <div className="flex items-center justify-between">
                            <p>Adults</p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-gray-800 border-gray-700"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                disabled={adults <= 1}
                              >
                                -
                              </Button>
                              <span className="w-4 text-center">{adults}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-gray-800 border-gray-700"
                                onClick={() => setAdults(adults + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="bg-black/50 border-gray-700 text-white flex-1 md:w-40">
                          <span>
                            {children} {children === 1 ? "Child" : "Children"}
                          </span>
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 bg-gray-900 border-gray-700 text-white">
                        <div className="p-2">
                          <div className="flex items-center justify-between">
                            <p>Children</p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-gray-800 border-gray-700"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                disabled={children <= 0}
                              >
                                -
                              </Button>
                              <span className="w-4 text-center">{children}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 bg-gray-800 border-gray-700"
                                onClick={() => setChildren(children + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Advanced Options Link */}
                <button
                  type="button"
                  className="text-sm text-primary hover:underline md:self-end"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? "Hide advanced options" : "Show advanced options"}
                </button>
              </div>

              {/* Book Now Button */}
              <Button className="w-full mt-2 bg-primary hover:bg-primary/90" size="lg" onClick={handleSearch}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


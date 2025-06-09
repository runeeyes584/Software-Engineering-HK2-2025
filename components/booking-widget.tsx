"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { CalendarIcon, Search, MapPin, Plane, Bus, Ship, Train, Car, CreditCard, Percent, Luggage } from "lucide-react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

export default function BookingWidget({ variant = "full" }: { variant?: "full" | "compact" | "sidebar" }) {
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
  const [infants, setInfants] = useState(0)

  // Transportation
  const [transportation, setTransportation] = useState("plane")

  // Ticket class
  const [ticketClass, setTicketClass] = useState("economy")

  // Price range
  const [priceRange, setPriceRange] = useState([0, 2000])

  // Duration
  const [duration, setDuration] = useState("any")

  // Additional options
  const [includesMeals, setIncludesMeals] = useState(false)
  const [includesGuide, setIncludesGuide] = useState(false)
  const [includesTransfers, setIncludesTransfers] = useState(false)

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
      infants,
      transportation,
      ticketClass,
      priceRange,
      duration,
      includesMeals,
      includesGuide,
      includesTransfers,
    })

    // Redirect to search results page
    window.location.href = `/tours?destination=${encodeURIComponent(destination)}&location=${encodeURIComponent(location)}`
  }

  if (variant === "compact") {
    return (
      <Card className="w-full bg-background/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search destinations..."
                className="pl-10"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Where to?"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-grow justify-start text-left font-normal",
                    !departureDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "PPP") : <span>When?</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>

            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "sidebar") {
    return (
      <Card className="w-full bg-background">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4">Find Your Perfect Tour</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Destination</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search destinations..."
                  className="pl-10"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("booking.departureDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !departureDate && "text-muted-foreground",
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
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Any duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any duration</SelectItem>
                  <SelectItem value="1-3">1-3 days</SelectItem>
                  <SelectItem value="4-7">4-7 days</SelectItem>
                  <SelectItem value="8-14">8-14 days</SelectItem>
                  <SelectItem value="15+">15+ days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Travelers</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select value={adults.toString()} onValueChange={(value) => setAdults(Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Adults" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Adult" : "Adults"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={children.toString()} onValueChange={(value) => setChildren(Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Children" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Child" : "Children"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Price Range</Label>
              <div className="px-2">
                <Slider value={priceRange} min={0} max={5000} step={100} onValueChange={setPriceRange} />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={handleSearch}>
              Search Tours
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default full variant
  return (
    <Card className="w-full bg-background/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <Tabs defaultValue="tour" value={searchType} onValueChange={setSearchType} className="mb-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="tour">Tours</TabsTrigger>
            <TabsTrigger value="hotel">Hotels</TabsTrigger>
            <TabsTrigger value="activity">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="tour">
            <p className="text-sm text-muted-foreground mb-4">
              Search for guided tours, packages, and travel experiences
            </p>
          </TabsContent>

          <TabsContent value="hotel">
            <p className="text-sm text-muted-foreground mb-4">Find accommodations for your stay</p>
          </TabsContent>

          <TabsContent value="activity">
            <p className="text-sm text-muted-foreground mb-4">Discover things to do at your destination</p>
          </TabsContent>
        </Tabs>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Destination Search */}
            <div className="space-y-2">
              <Label htmlFor="destination">{searchType === "tour" ? "Tour Type or Destination" : "Search"}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="destination"
                  placeholder={`Search ${searchType}s...`}
                  className="pl-10"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Where to?</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="location"
                  placeholder="City, region, or specific place"
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Departure Date */}
            <div className="space-y-2">
              <Label htmlFor="departureDate">{t("booking.departureDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="departureDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !departureDate && "text-muted-foreground",
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
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Return Date */}
            <div className="space-y-2">
              <Label htmlFor="returnDate">{t("booking.returnDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="returnDate"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !returnDate && "text-muted-foreground")}
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
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Travelers</Label>
              <span className="text-sm text-muted-foreground">
                Total: {adults + children + infants} {adults + children + infants === 1 ? "traveler" : "travelers"}
              </span>
            </div>

            <Card className="border border-input">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t("booking.adults")}</p>
                    <p className="text-sm text-muted-foreground">Ages 13+</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setAdults(Math.min(10, adults + 1))}
                      disabled={adults + children + infants >= 16}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t("booking.children")}</p>
                    <p className="text-sm text-muted-foreground">Ages 2-12</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setChildren(Math.min(10, children + 1))}
                      disabled={adults + children + infants >= 16}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Infants</p>
                    <p className="text-sm text-muted-foreground">Under 2</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      disabled={infants <= 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{infants}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setInfants(Math.min(5, infants + 1))}
                      disabled={adults + children + infants >= 16 || infants >= adults}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <button
            type="button"
            className="text-sm text-primary hover:underline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide advanced options" : "Show advanced options"}
          </button>

          {showAdvanced && (
            <div className="space-y-6">
              {/* Transportation */}
              <div className="space-y-2">
                <Label>{t("booking.transportation")}</Label>
                <RadioGroup
                  value={transportation}
                  onValueChange={setTransportation}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2"
                >
                  <div className="flex items-center space-x-1 border rounded-md px-3 py-2">
                    <RadioGroupItem value="plane" id="plane" />
                    <Label htmlFor="plane" className="flex items-center cursor-pointer">
                      <Plane className="h-3 w-3 mr-1" />
                      <span>{t("booking.plane")}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1 border rounded-md px-3 py-2">
                    <RadioGroupItem value="bus" id="bus" />
                    <Label htmlFor="bus" className="flex items-center cursor-pointer">
                      <Bus className="h-3 w-3 mr-1" />
                      <span>{t("booking.bus")}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1 border rounded-md px-3 py-2">
                    <RadioGroupItem value="ship" id="ship" />
                    <Label htmlFor="ship" className="flex items-center cursor-pointer">
                      <Ship className="h-3 w-3 mr-1" />
                      <span>{t("booking.ship")}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1 border rounded-md px-3 py-2">
                    <RadioGroupItem value="train" id="train" />
                    <Label htmlFor="train" className="flex items-center cursor-pointer">
                      <Train className="h-3 w-3 mr-1" />
                      <span>Train</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1 border rounded-md px-3 py-2">
                    <RadioGroupItem value="car" id="car" />
                    <Label htmlFor="car" className="flex items-center cursor-pointer">
                      <Car className="h-3 w-3 mr-1" />
                      <span>Car</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Ticket Class */}
              <div className="space-y-2">
                <Label>{t("booking.ticketClass")}</Label>
                <RadioGroup
                  value={ticketClass}
                  onValueChange={setTicketClass}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                >
                  <div className="flex items-center space-x-1 border rounded-md px-3 py-2">
                    <RadioGroupItem value="economy" id="economy" />
                    <Label htmlFor="economy" className="cursor-pointer flex items-center">
                      <span>{t("booking.economy")}</span>
                      <span className="ml-1 text-xs text-muted-foreground">(Standard)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1 border rounded-md px-3 py-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business" className="cursor-pointer flex items-center">
                      <span>{t("booking.business")}</span>
                      <span className="ml-1 text-xs text-muted-foreground">(+$100)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-1 border rounded-md px-3 py-2">
                    <RadioGroupItem value="luxury" id="luxury" />
                    <Label htmlFor="luxury" className="cursor-pointer flex items-center">
                      <span>{t("booking.luxury")}</span>
                      <span className="ml-1 text-xs text-muted-foreground">(+$200)</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Price Range</Label>
                  <span className="text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <div className="px-2">
                  <Slider value={priceRange} min={0} max={5000} step={100} onValueChange={setPriceRange} />
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-2">
                <Label>Additional Options</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                    <Checkbox
                      id="includesMeals"
                      checked={includesMeals}
                      onCheckedChange={(checked) => setIncludesMeals(checked === true)}
                    />
                    <Label htmlFor="includesMeals" className="cursor-pointer flex items-center">
                      <CreditCard className="h-3 w-3 mr-1" />
                      <span>Meals Included</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                    <Checkbox
                      id="includesGuide"
                      checked={includesGuide}
                      onCheckedChange={(checked) => setIncludesGuide(checked === true)}
                    />
                    <Label htmlFor="includesGuide" className="cursor-pointer flex items-center">
                      <Percent className="h-3 w-3 mr-1" />
                      <span>Tour Guide</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                    <Checkbox
                      id="includesTransfers"
                      checked={includesTransfers}
                      onCheckedChange={(checked) => setIncludesTransfers(checked === true)}
                    />
                    <Label htmlFor="includesTransfers" className="cursor-pointer flex items-center">
                      <Luggage className="h-3 w-3 mr-1" />
                      <span>Airport Transfers</span>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button className="w-full mt-2" size="lg" onClick={handleSearch}>
            {t("home.hero.cta")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


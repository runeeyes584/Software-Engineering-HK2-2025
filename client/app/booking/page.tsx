"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { Check, CreditCard, Plane, Bus, Ship, Car } from "lucide-react"

export default function BookingPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()

  const tourId = searchParams.get("tourId")
  const departureDateParam = searchParams.get("departureDate")
  const returnDateParam = searchParams.get("returnDate")
  const transportType = searchParams.get("transportType") || "plane"
  const ticketClass = searchParams.get("ticketClass") || "economy"
  const adults = Number.parseInt(searchParams.get("adults") || "1")
  const children = Number.parseInt(searchParams.get("children") || "0")
  const infants = Number.parseInt(searchParams.get("infants") || "0")

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Mock tour data - in a real app, you would fetch this based on the ID
  const tour = {
    id: tourId,
    title: "Halong Bay Cruise",
    location: "Vietnam",
    price: 299,
    duration: 3,
    transportOptions: [
      { id: "plane", name: "Airplane", icon: Plane, priceModifier: 1.2 },
      { id: "bus", name: "Bus", icon: Bus, priceModifier: 1.0 },
      { id: "ship", name: "Cruise Ship", icon: Ship, priceModifier: 1.3 },
      { id: "car", name: "Private Car", icon: Car, priceModifier: 1.5 },
    ],
    classOptions: [
      { id: "economy", name: "Economy", description: "Standard service", priceModifier: 1.0 },
      { id: "business", name: "Business", description: "Enhanced comfort and service", priceModifier: 1.5 },
      { id: "luxury", name: "Luxury", description: "Premium experience with exclusive benefits", priceModifier: 2.0 },
    ],
  }

  const departureDate = departureDateParam ? new Date(departureDateParam) : new Date()
  const returnDate = returnDateParam ? new Date(returnDateParam) : null

  // Calculate price based on selections
  const getSelectedTransport = () =>
    tour.transportOptions.find((t) => t.id === transportType) || tour.transportOptions[0]
  const getSelectedClass = () => tour.classOptions.find((c) => c.id === ticketClass) || tour.classOptions[0]

  const basePrice = tour.price
  const transportModifier = getSelectedTransport().priceModifier
  const classModifier = getSelectedClass().priceModifier

  const adultPrice = Math.round(basePrice * transportModifier * classModifier)
  const childPrice = Math.round(adultPrice * 0.7) // 70% of adult price
  const infantPrice = Math.round(adultPrice * 0.1) // 10% of adult price

  const subtotal = adults * adultPrice + children * childPrice + infants * infantPrice
  const serviceFee = Math.round(subtotal * 0.1)
  const totalPrice = subtotal + serviceFee

  const [formData, setFormData] = useState({
    // Traveler Information
    travelers: Array(adults + children)
      .fill()
      .map(() => ({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: "",
        passportExpiry: "",
      })),
    // Contact Information
    contactFirstName: "",
    contactLastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    // Special Requests
    specialRequests: "",
    dietaryRequirements: "",
    mobilityNeeds: "",
    // Payment
    paymentMethod: "credit-card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTravelerChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedTravelers = [...prev.travelers]
      updatedTravelers[index] = {
        ...updatedTravelers[index],
        [field]: value,
      }
      return {
        ...prev,
        travelers: updatedTravelers,
      }
    })
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleNext = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // This would connect to your .NET Core backend
      // const response = await fetch('/api/bookings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     tourId,
      //     departureDate: departureDateParam,
      //     returnDate: returnDateParam,
      //     transportType,
      //     ticketClass,
      //     adults,
      //     children,
      //     infants,
      //     ...formData
      //   })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Move to confirmation step
      setStep(4)
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinish = () => {
    router.push("/account")
  }

  const TransportIcon = getSelectedTransport().icon

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Book Your Tour</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {[
            t("booking.steps.select"),
            t("booking.steps.details"),
            t("booking.steps.payment"),
            t("booking.steps.confirm"),
          ].map((stepLabel, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index + 1 < step ? "text-primary" : index + 1 === step ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  index + 1 < step
                    ? "bg-primary text-primary-foreground"
                    : index + 1 === step
                      ? "border-2 border-primary"
                      : "border-2 border-muted"
                }`}
              >
                {index + 1 < step ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
              </div>
              <span className="text-sm hidden md:block">{stepLabel}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
            <div className="h-1 bg-primary transition-all" style={{ width: `${((step - 1) / 3) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Tour Selection (already done, just show summary) */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Tour Selection</CardTitle>
                <CardDescription>Review your selected tour and travel details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{tour.title}</h3>
                    <p className="text-muted-foreground">{tour.location}</p>
                    <p className="text-muted-foreground">{tour.duration} days</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${basePrice}</div>
                    <div className="text-sm text-muted-foreground">base price per person</div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Departure Date</Label>
                    <div className="font-medium">{format(departureDate, "PPP")}</div>
                  </div>
                  {returnDate && (
                    <div>
                      <Label>Return Date</Label>
                      <div className="font-medium">{format(returnDate, "PPP")}</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Transportation</Label>
                    <div className="font-medium flex items-center">
                      <TransportIcon className="h-4 w-4 mr-2" />
                      {getSelectedTransport().name}
                    </div>
                  </div>
                  <div>
                    <Label>Class</Label>
                    <div className="font-medium">{getSelectedClass().name}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Adults</Label>
                    <div className="font-medium">{adults}</div>
                  </div>
                  <div>
                    <Label>Children (2-11)</Label>
                    <div className="font-medium">{children}</div>
                  </div>
                  <div>
                    <Label>Infants (under 2)</Label>
                    <div className="font-medium">{infants}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleNext} className="ml-auto">
                  Continue to Traveler Details
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Traveler Details */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Traveler Details</CardTitle>
                <CardDescription>Enter information for all travelers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Traveler Information */}
                {formData.travelers.map((traveler, index) => (
                  <div key={index} className="space-y-4 border p-4 rounded-lg">
                    <h3 className="font-semibold">
                      {index < adults ? `Adult ${index + 1}` : `Child ${index - adults + 1}`}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          value={traveler.firstName}
                          onChange={(e) => handleTravelerChange(index, "firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          value={traveler.lastName}
                          onChange={(e) => handleTravelerChange(index, "lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={traveler.dateOfBirth}
                          onChange={(e) => handleTravelerChange(index, "dateOfBirth", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nationality</Label>
                        <Select
                          value={traveler.nationality}
                          onValueChange={(value) => handleTravelerChange(index, "nationality", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vietnam">Vietnam</SelectItem>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="japan">Japan</SelectItem>
                            <SelectItem value="china">China</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Passport Number</Label>
                        <Input
                          value={traveler.passportNumber}
                          onChange={(e) => handleTravelerChange(index, "passportNumber", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Passport Expiry Date</Label>
                        <Input
                          type="date"
                          value={traveler.passportExpiry}
                          onChange={(e) => handleTravelerChange(index, "passportExpiry", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Contact Information */}
                <div className="border p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactFirstName">First Name</Label>
                      <Input
                        id="contactFirstName"
                        name="contactFirstName"
                        value={formData.contactFirstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactLastName">Last Name</Label>
                      <Input
                        id="contactLastName"
                        name="contactLastName"
                        value={formData.contactLastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vietnam">Vietnam</SelectItem>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="japan">Japan</SelectItem>
                          <SelectItem value="china">China</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip/Postal Code</Label>
                      <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="border p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Special Requirements (Optional)</h3>

                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      placeholder="Any special requests or preferences"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
                    <Textarea
                      id="dietaryRequirements"
                      name="dietaryRequirements"
                      value={formData.dietaryRequirements}
                      onChange={handleChange}
                      placeholder="Any dietary restrictions or preferences"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobilityNeeds">Mobility or Accessibility Needs</Label>
                    <Textarea
                      id="mobilityNeeds"
                      name="mobilityNeeds"
                      value={formData.mobilityNeeds}
                      onChange={handleChange}
                      placeholder="Any mobility or accessibility requirements"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext}>Continue to Payment</Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>Enter your payment details</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <RadioGroup value={formData.paymentMethod} onValueChange={handleRadioChange} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit or Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <Label htmlFor="bank-transfer">Bank Transfer</Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "paypal" && (
                    <div className="text-center p-4">
                      <p>You will be redirected to PayPal to complete your payment.</p>
                    </div>
                  )}

                  {formData.paymentMethod === "bank-transfer" && (
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Bank Transfer Details</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Please transfer the total amount to the following bank account. Your booking will be confirmed
                        once payment is received.
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Bank Name:</span>
                          <span>TravelVista Bank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Account Name:</span>
                          <span>TravelVista Ltd.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Account Number:</span>
                          <span>1234567890</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">SWIFT/BIC:</span>
                          <span>TRVLVST123</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Reference:</span>
                          <span>
                            TOUR-{tourId}-{formData.contactLastName}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Complete Booking"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
                <CardDescription>Your booking has been successfully completed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Booking Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tour</p>
                      <p className="font-medium">{tour.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Booking Reference</p>
                      <p className="font-medium">
                        BK-
                        {Math.floor(Math.random() * 10000)
                          .toString()
                          .padStart(4, "0")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Departure Date</p>
                      <p className="font-medium">{format(departureDate, "PPP")}</p>
                    </div>
                    {returnDate && (
                      <div>
                        <p className="text-sm text-muted-foreground">Return Date</p>
                        <p className="font-medium">{format(returnDate, "PPP")}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Transportation</p>
                      <p className="font-medium flex items-center">
                        <TransportIcon className="h-4 w-4 mr-2" />
                        {getSelectedTransport().name}, {getSelectedClass().name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Travelers</p>
                      <p className="font-medium">
                        {adults} {adults === 1 ? "Adult" : "Adults"}
                        {children > 0 && `, ${children} ${children === 1 ? "Child" : "Children"}`}
                        {infants > 0 && `, ${infants} ${infants === 1 ? "Infant" : "Infants"}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-medium">${totalPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium">
                        {formData.paymentMethod === "credit-card"
                          ? "Credit Card"
                          : formData.paymentMethod === "paypal"
                            ? "PayPal"
                            : "Bank Transfer"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p>A confirmation email has been sent to {formData.email}</p>
                  <p className="text-sm text-muted-foreground">
                    You can view your booking details in your account dashboard
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={handleFinish}>Go to My Account</Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{tour.title}</span>
                <span>${basePrice} base price</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TransportIcon className="h-4 w-4 mr-2" />
                  <span>
                    {getSelectedTransport().name}, {getSelectedClass().name}
                  </span>
                </div>
              </div>

              {adults > 0 && (
                <div className="flex justify-between">
                  <span>
                    Adults ({adults} × ${adultPrice})
                  </span>
                  <span>${adults * adultPrice}</span>
                </div>
              )}

              {children > 0 && (
                <div className="flex justify-between">
                  <span>
                    Children ({children} × ${childPrice})
                  </span>
                  <span>${children * childPrice}</span>
                </div>
              )}

              {infants > 0 && (
                <div className="flex justify-between">
                  <span>
                    Infants ({infants} × ${infantPrice})
                  </span>
                  <span>${infants * infantPrice}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>${serviceFee}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>

              <div className="text-sm text-muted-foreground mt-4">
                <p>By proceeding with this booking, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

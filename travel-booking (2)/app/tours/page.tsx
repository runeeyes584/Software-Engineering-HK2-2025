import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TourListing from "@/components/tours/tour-listing"

export default function ToursPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <TourListing />
      </main>
      <Footer />
    </div>
  )
}


import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BookingForm from "@/components/booking/booking-form"

export default function BookingPage({
  searchParams,
}: {
  searchParams: { tourId?: string }
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-12 bg-muted/30">
        <BookingForm tourId={searchParams.tourId} />
      </main>
      <Footer />
    </div>
  )
}


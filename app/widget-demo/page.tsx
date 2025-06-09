import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BookingWidget from "@/components/booking-widget"
import DarkBookingWidget from "@/components/dark-booking-widget"

export default function WidgetDemoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-8">Booking Widget Demo</h1>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Dark Theme Booking Widget</h2>
              <p className="text-muted-foreground mb-6">
                Dark-themed booking widget with background image integration.
              </p>

              {/* Dark theme demo with background */}
              <div className="relative rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/placeholder.svg?height=600&width=1200')" }}
                />
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative p-8">
                  <div className="max-w-3xl mx-auto space-y-4 text-white mb-8">
                    <h3 className="text-4xl font-bold">Discover Your Next Adventure</h3>
                    <p className="text-white/80">Explore the world with our carefully curated travel experiences</p>
                  </div>

                  <div className="max-w-3xl mx-auto">
                    <DarkBookingWidget />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Light Theme Booking Widget</h2>
              <p className="text-muted-foreground mb-6">Standard light-themed booking widget for regular pages.</p>
              <div className="max-w-3xl mx-auto">
                <BookingWidget variant="full" />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Compact Booking Widget</h2>
              <p className="text-muted-foreground mb-6">Simplified version for header or minimal spaces.</p>
              <BookingWidget variant="compact" />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Sidebar Booking Widget</h2>
              <p className="text-muted-foreground mb-6">Vertical layout for sidebar placement.</p>
              <div className="max-w-sm">
                <BookingWidget variant="sidebar" />
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TourDetails from "@/components/tours/tour-details"

export default function TourPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <TourDetails id={params.id} />
      </main>
      <Footer />
    </div>
  )
}


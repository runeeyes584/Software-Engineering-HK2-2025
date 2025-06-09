import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import HeroSection from "@/components/home/hero-section"
import FeaturedTours from "@/components/home/featured-tours"
import PopularDestinations from "@/components/home/popular-destinations"
import Testimonials from "@/components/home/testimonials"
import Newsletter from "@/components/home/newsletter"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedTours />
        <PopularDestinations />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}


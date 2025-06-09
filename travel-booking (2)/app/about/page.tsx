import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AboutContent from "@/components/about/about-content"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AboutContent />
      </main>
      <Footer />
    </div>
  )
}


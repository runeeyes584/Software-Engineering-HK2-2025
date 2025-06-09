import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import FaqContent from "@/components/faq/faq-content"

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <FaqContent />
      </main>
      <Footer />
    </div>
  )
}


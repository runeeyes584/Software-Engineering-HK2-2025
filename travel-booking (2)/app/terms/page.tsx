import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import TermsContent from "@/components/legal/terms-content"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <TermsContent />
      </main>
      <Footer />
    </div>
  )
}


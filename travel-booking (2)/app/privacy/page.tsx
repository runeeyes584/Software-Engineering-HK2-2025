import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PrivacyContent from "@/components/legal/privacy-content"

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <PrivacyContent />
      </main>
      <Footer />
    </div>
  )
}


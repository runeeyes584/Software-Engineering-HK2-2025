import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AccountDashboard from "@/components/account/account-dashboard"

export default function AccountPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AccountDashboard />
      </main>
      <Footer />
    </div>
  )
}


import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <ForgotPasswordForm />
      </main>
      <Footer />
    </div>
  )
}


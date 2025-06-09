import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import RegisterForm from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  )
}


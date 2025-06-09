import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}


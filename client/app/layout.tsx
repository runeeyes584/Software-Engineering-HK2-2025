import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider-fixed"
import { AuthProvider } from "@/components/auth-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"
import Chatbot from "@/components/chatbot"
import LanguageDebug from "@/components/language-debug"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TravelVista - Your Ultimate Travel Companion",
  description: "Discover amazing destinations and book unforgettable tours with TravelVista",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LanguageProvider>
              <AuthProvider>
                <Toaster richColors expand={true} position="top-center" closeButton />
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">{children}</main>
                  <Footer />
                  <BackToTop />
                  <Chatbot />
                  <LanguageDebug />
                </div>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

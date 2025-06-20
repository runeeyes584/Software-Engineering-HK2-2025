import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import { LanguageProvider } from "../components/language-provider-fixed"
import { AuthProvider } from "@/components/auth-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import ConditionalLayoutWrapper from "@/components/conditional-layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travel Booking",
  description: "Book your next adventure with us",
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <AuthProvider>
                <Toaster richColors expand={true} position="top-center" closeButton />
                <ConditionalLayoutWrapper>{children}</ConditionalLayoutWrapper>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

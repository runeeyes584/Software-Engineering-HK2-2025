import { AuthProvider } from "@/components/auth-provider"
import { AutoRedirectAdmin } from "@/components/auto-redirect-admin"
import ConditionalLayoutWrapper from "@/components/conditional-layout-wrapper"
import { SocketProvider } from "@/components/socket-provider"
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { LanguageProvider } from "../components/language-provider-fixed"
import { ThemeProvider } from "../components/theme-provider"
import "./globals.css"

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
                <SocketProvider>
                  <AutoRedirectAdmin>
                    <Toaster richColors expand={true} position="top-center" closeButton />
                    <ConditionalLayoutWrapper>{children}</ConditionalLayoutWrapper>
                  </AutoRedirectAdmin>
                </SocketProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

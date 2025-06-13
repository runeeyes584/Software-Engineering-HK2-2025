"use client"

import Link from "next/link"
import { useLanguage } from "@/components/language-provider-fixed"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">TravelVista</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover the world with our expertly curated travel experiences.
              </p>
              <div className="flex mt-6 space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">{t("nav.destinations")}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/destinations/asia"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Asia
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinations/europe"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Europe
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinations/africa"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Africa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinations/americas"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Americas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinations/oceania"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Oceania
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">{t("nav.tours")}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/tours/adventure" className="text-muted-foreground hover:text-primary transition-colors">
                    Adventure
                  </Link>
                </li>
                <li>
                  <Link href="/tours/cultural" className="text-muted-foreground hover:text-primary transition-colors">
                    Cultural
                  </Link>
                </li>
                <li>
                  <Link href="/tours/beach" className="text-muted-foreground hover:text-primary transition-colors">
                    Beach
                  </Link>
                </li>
                <li>
                  <Link href="/tours/wildlife" className="text-muted-foreground hover:text-primary transition-colors">
                    Wildlife
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tours/city-breaks"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    City Breaks
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">{t("nav.about")}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    {t("nav.about")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    {t("nav.contact")}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    {t("footer.terms")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    {t("footer.privacy")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} TravelVista. {t("footer.rights")}
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {t("footer.terms")}
              </Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {t("footer.privacy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

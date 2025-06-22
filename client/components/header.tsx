"use client"

import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAdminRole } from "@/hooks/use-admin-role"
import { cn } from "@/lib/utils"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import {
    Building,
    ChevronDown,
    Compass,
    Globe,
    Menu,
    Monitor,
    Moon,
    Mountain,
    Palmtree,
    Shield,
    Sun,
    Tent,
    User,
    Waves
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { t, language, setLanguage } = useLanguage()
  const { user, isSignedIn } = useUser()
  const { isAdmin } = useAdminRole()
  const pathname = usePathname()

  const tourCategories = [
    { href: "/tours/adventure", label: t("categories.adventure"), icon: Mountain },
    { href: "/tours/cultural", label: t("categories.cultural"), icon: Compass },
    { href: "/tours/beach", label: t("categories.beach"), icon: Palmtree },
    { href: "/tours/city-breaks", label: t("categories.cityBreaks"), icon: Building },
    { href: "/tours/wildlife", label: t("categories.wildlife"), icon: Tent },
    { href: "/tours/cruise", label: t("categories.cruise"), icon: Waves },
  ]

  const destinations = [
    { href: "/destinations/asia", label: t("regions.asia") },
    { href: "/destinations/europe", label: t("regions.europe") },
    { href: "/destinations/americas", label: t("regions.americas") },
    { href: "/destinations/africa", label: t("regions.africa") },
    { href: "/destinations/oceania", label: t("regions.oceania") },
  ]

  const popularDestinations = [
    { href: "/destinations/vietnam", label: "Vietnam" },
    { href: "/destinations/japan", label: "Japan" },
    { href: "/destinations/thailand", label: "Thailand" },
    { href: "/destinations/indonesia", label: "Indonesia" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col h-full px-2">
                  <Link href="/" className="flex items-center space-x-2 mb-8 px-2">
                    <span className="font-bold text-xl">TravelVista</span>
                  </Link>
                  <nav className="grid gap-6 text-lg font-medium px-2">
                    <Link href="/" className="hover:text-foreground/80 py-2">
                      {t("nav.home")}
                    </Link>

                    <div className="space-y-3">
                      <div className="font-semibold py-2">{t("nav.tours")}</div>
                      <div className="grid gap-2 pl-4">
                        {tourCategories.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center text-base text-muted-foreground hover:text-foreground py-1"
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </Link>
                        ))}
                        <Link href="/tours" className="text-primary text-base hover:underline py-1">
                          {t("nav.allTours")}
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="font-semibold py-2">{t("nav.destinations")}</div>
                      <div className="grid gap-2 pl-4">
                        {destinations.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="text-base text-muted-foreground hover:text-foreground py-1"
                          >
                            {item.label}
                          </Link>
                        ))}
                        <Link href="/destinations" className="text-primary text-base hover:underline py-1">
                          {t("nav.allDestinations")}
                        </Link>
                      </div>
                    </div>

                    <Link href="/about" className="hover:text-foreground/80 py-2">
                      {t("nav.about")}
                    </Link>
                    <Link href="/contact" className="hover:text-foreground/80 py-2">
                      {t("nav.contact")}
                    </Link>
                  </nav>

                  <div className="mt-auto space-y-4 px-2 pb-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={language === "en" ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => setLanguage("en")}
                      >
                        English
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={language === "vi" ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => setLanguage("vi")}
                      >
                        Tiếng Việt
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={theme === "light" ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-4 w-4 mr-1" />
                        {t("theme.light")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={theme === "dark" ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-4 w-4 mr-1" />
                        {t("theme.dark")}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">TravelVista</span>
            </Link>
          </div>

          <nav className="hidden lg:flex gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary px-2 py-1",
                pathname === "/" ? "text-foreground" : "text-foreground/60",
              )}
            >
              {t("nav.home")}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary px-2 py-1",
                    pathname.startsWith("/tours") ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  {t("nav.tours")} <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[220px]">
                <DropdownMenuLabel>{t("nav.tourCategories")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {tourCategories.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center cursor-pointer">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/tours" className="font-medium text-primary cursor-pointer">
                    {t("nav.allTours")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary px-2 py-1",
                    pathname.startsWith("/destinations") ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  {t("nav.destinations")} <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[220px]">
                <DropdownMenuLabel>{t("nav.regions")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {destinations.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="cursor-pointer">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>{t("nav.popular")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {popularDestinations.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="cursor-pointer">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/destinations" className="font-medium text-primary cursor-pointer">
                    {t("nav.allDestinations")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/about"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary px-2 py-1",
                pathname === "/about" ? "text-foreground" : "text-foreground/60",
              )}
            >
              {t("nav.about")}
            </Link>

            <Link
              href="/contact"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary px-2 py-1",
                pathname === "/contact" ? "text-foreground" : "text-foreground/60",
              )}
            >
              {t("nav.contact")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Language">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-muted" : ""}>
                  <span className="mr-2">🇺🇸</span> English {language === "en" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("vi")} className={language === "vi" ? "bg-muted" : ""}>
                  <span className="mr-2">🇻🇳</span> Tiếng Việt {language === "vi" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Theme">
                  {theme === "light" ? (
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  ) : theme === "dark" ? (
                    <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  ) : (
                    <Monitor className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")} className={theme === "light" ? "bg-muted" : ""}>
                  <Sun className="mr-2 h-4 w-4" />
                  {t("theme.light")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className={theme === "dark" ? "bg-muted" : ""}>
                  <Moon className="mr-2 h-4 w-4" />
                  {t("theme.dark")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className={theme === "system" ? "bg-muted" : ""}>
                  <Monitor className="mr-2 h-4 w-4" />
                  {t("theme.system")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/account" passHref legacyBehavior>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {isSignedIn ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" className="ml-2">Sign in</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="default" className="ml-2">Sign up</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

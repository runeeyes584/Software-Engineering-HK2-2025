"use client"

import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  const { t } = useLanguage()

  const teamMembers = [
    {
      name: "Lê Anh Tiến",
      role: t("about.role.ceo"),
      image: "/images/LeAnhTien.jpg",
    },
    {
      name: "Nguyễn Hùng Sơn",
      role: t("about.role.operations"),
      image: "/images/NguyenHungSon.jpg",
    },
    {
      name: "Trương Vĩnh Phúc",
      role: t("about.role.consultant"),
      image: "/images/TruongVinhPhuc.jpg",
    },
    {
      name: "Trần Văn Thắng",
      role: t("about.role.marketing"),
      image: "/images/TranVanThang.jpg",
    },
  ]

  const values = [
    {
      title: t("about.values.authentic.title"),
      description: t("about.values.authentic.description"),
    },
    {
      title: t("about.values.sustainable.title"),
      description: t("about.values.sustainable.description"),
    },
    {
      title: t("about.values.satisfaction.title"),
      description: t("about.values.satisfaction.description"),
    },
    {
      title: t("about.values.innovation.title"),
      description: t("about.values.innovation.description"),
    },
  ]

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">{t("nav.about")}</h1>

      {/* Hero Section */}
      <div className="relative h-[400px] rounded-lg overflow-hidden mb-12">
        <Image src="https://images.unsplash.com/photo-1496950866446-3253e1470e8e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Our team exploring" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="text-white p-8 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">{t("about.ourStory")}</h2>
            <p className="text-lg mb-6">{t("about.storyText")}</p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">{t("about.getInTouch")}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t("about.ourMission")}</h2>
          <p className="text-muted-foreground">{t("about.missionText")}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t("about.ourVision")}</h2>
          <p className="text-muted-foreground">{t("about.visionText")}</p>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{t("about.ourValues")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{t("about.ourTeam")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Locations */}
      {/* <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{t("about.locations")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { city: "Hanoi", country: "Vietnam", address: "123 Tran Hung Dao St, Hoan Kiem District" },
            { city: "Bangkok", country: "Thailand", address: "456 Sukhumvit Road, Khlong Toei" },
            { city: "Singapore", country: "Singapore", address: "789 Orchard Road, Central Region" },
          ].map((location, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                  <div>
                    <h3 className="text-lg font-bold">
                      {location.city}, {location.country}
                    </h3>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div> */}

      {/* CTA */}
      <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("about.cta2.title")}</h2>
        <p className="max-w-2xl mx-auto mb-6">{t("about.cta2.description")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/tours">{t("about.cta2.button")}</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
            asChild
          >
            <Link href="/contact">{t("nav.contact")}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

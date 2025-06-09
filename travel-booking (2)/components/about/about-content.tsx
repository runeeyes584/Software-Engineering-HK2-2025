"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Clock, Globe, Heart, Shield, Users } from "lucide-react"
import Link from "next/link"

// Team members data
const teamMembers = [
  {
    name: "Lê Anh Tiến",
    position: "CEO & Founder",
    bio: "Có 30 năm kinh nghiệm trong ngành du lịch, Lê Anh Tiến là người sáng lập và giám đốc điều hành của TravelEase. Anh đã dành cả cuộc đời mình để khám phá vẻ đẹp của Việt Nam và chia sẻ nó với thế giới.",
    image: "/Tien.jpg?height=300&width=300",
  },
  {
    name: "Trần Văn Thắng",
    position: "Đồng sáng lập",
    bio: "Cùng với Lê Anh Tiến, Trần Văn Thắng là một trong những người sáng lập TravelEase. Với hơn 20 năm kinh nghiệm trong ngành du lịch, anh đã giúp xây dựng thương hiệu và phát triển các sản phẩm du lịch độc đáo.",
    image: "/Thang.jpg?height=300&width=300",
  },
  {
    name: "Trần Văn Phúc",
    position: "Giám đốc điều hành",
    bio: "Người đứng đầu bộ phận điều hành của TravelEase, Trần Văn Phúc có trách nhiệm đảm bảo rằng mọi chuyến đi đều diễn ra suôn sẻ và đáp ứng mong đợi của khách hàng.",
    image: "/Phuc.jpg?height=300&width=300",
  },
  {
    name: "Nguyễn Hùng Sơn",
    position: "Giám đốc Marketing",
    bio: "Nguyễn Hùng Sơn là người đứng đầu bộ phận marketing của TravelEase. Với hơn 15 năm kinh nghiệm trong ngành quảng cáo và truyền thông, anh đã giúp xây dựng thương hiệu TravelEase trở thành một trong những thương hiệu du lịch hàng đầu tại Việt Nam.",
    image: "/Son.jpg?height=300&width=300",
  },
]

// Company values
const values = [
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Sustainable Travel",
    description:
      "We are committed to promoting sustainable tourism practices that respect local communities and protect the environment.",
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: "Passion for Travel",
    description:
      "Our team shares a deep passion for travel and cultural exchange, which drives us to create exceptional experiences.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Customer-Centric",
    description:
      "We put our customers at the center of everything we do, tailoring experiences to meet their unique needs and preferences.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Safety First",
    description: "The safety and well-being of our travelers is our top priority in all the destinations we visit.",
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Quality Experiences",
    description: "We are dedicated to providing high-quality travel experiences that create lasting memories.",
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Reliability",
    description:
      "Our customers can count on us to deliver exceptional service and support before, during, and after their journey.",
  },
]

// Company milestones
const milestones = [
  {
    year: 2015,
    title: "Company Founded",
    description: "TravelEase was founded with a mission to provide authentic travel experiences in Vietnam.",
  },
  {
    year: 2017,
    title: "Expanded to 50+ Tours",
    description: "We expanded our tour offerings to cover all major destinations in Vietnam.",
  },
  {
    year: 2018,
    title: "Sustainable Tourism Award",
    description: "Received recognition for our commitment to sustainable tourism practices.",
  },
  {
    year: 2020,
    title: "Digital Transformation",
    description: "Launched our online booking platform to make travel planning easier for our customers.",
  },
  {
    year: 2022,
    title: "100,000 Travelers Milestone",
    description: "Celebrated serving our 100,000th traveler with unforgettable experiences.",
  },
  {
    year: 2023,
    title: "International Expansion",
    description: "Began offering tours to neighboring countries in Southeast Asia.",
  },
]

export default function AboutContent() {
  const { t } = useLanguage()

  return (
    <div>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 z-10" />
        <div
          className="h-[400px] bg-cover bg-center"
          style={{ backgroundImage: "url('/abouttravel.jpg?height=400&width=1200')" }}
        >
          <div className="container relative z-20 h-full flex flex-col justify-center">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About TravelEase</h1>
              <p className="text-lg md:text-xl text-muted-foreground" style={{color: 'white'}}>
                Discover our story, our team, and our commitment to creating unforgettable travel experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-16">
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">Our Story</TabsTrigger>
            <TabsTrigger value="team">Our Team</TabsTrigger>
            <TabsTrigger value="values">Our Values</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2015, TravelEase began with a simple mission: to help travelers discover the authentic
                  beauty of Vietnam through carefully crafted experiences.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our founder, John Smith, had spent years exploring Vietnam and was passionate about sharing its rich
                  culture, stunning landscapes, and warm hospitality with the world. He assembled a team of travel
                  enthusiasts who shared his vision and commitment to sustainable, responsible tourism.
                </p>
                <p className="text-muted-foreground">
                  Today, TravelEase has grown into a leading tour operator in Vietnam, serving thousands of travelers
                  each year. We remain dedicated to our original mission while continuously innovating to provide the
                  best possible travel experiences.
                </p>
              </div>
              <div>
                <img
                  src="/ourstory2.jpg?height=400&width=600"
                  alt="TravelEase team"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Journey</h2>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold">{milestone.year}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
                <p className="text-muted-foreground">
                  Our dedicated team of travel experts is passionate about creating unforgettable experiences for our
                  customers. With deep local knowledge and a commitment to excellence, they're the heart of TravelEase.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <Card key={index}>
                    <CardContent className="p-0">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                        <p className="text-primary text-sm mb-3">{member.position}</p>
                        <p className="text-muted-foreground text-sm">{member.bio}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">Join Our Team</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  We're always looking for passionate individuals to join our growing team. If you love travel and want
                  to help create amazing experiences for others, we'd love to hear from you.
                </p>
                <Button asChild>
                  <Link href="/careers">View Open Positions</Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Values Tab */}
          <TabsContent value="values">
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                <p className="text-muted-foreground">
                  These principles guide everything we do at TravelEase, from how we design our tours to how we interact
                  with our customers and partners.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="mb-4">{value.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-primary text-primary-foreground rounded-lg p-8">
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="text-2xl font-semibold mb-4">Our Commitment to Sustainability</h3>
                  <p className="mb-6">
                    At TravelEase, we believe that travel should enrich both the traveler and the destinations we visit.
                    We're committed to sustainable tourism practices that:
                  </p>
                  <ul className="space-y-2 text-left max-w-md mx-auto mb-6">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Support local communities and businesses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Minimize environmental impact</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Preserve cultural heritage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Promote responsible travel behaviors</span>
                    </li>
                  </ul>
                  <Button variant="secondary">Learn More About Our Initiatives</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


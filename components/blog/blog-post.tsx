"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

// Mock blog post data
const blogPostData = {
  id: "1",
  title: "Top 10 Must-Visit Destinations in Vietnam",
  content: `
    <p>Vietnam is a country of breathtaking natural beauty with a complex history and vibrant culture. From the terraced rice fields of the mountainous north to the bustling cities of Ho Chi Minh City and Hanoi, Vietnam offers visitors an authentic and unique experience.</p>
    
    <p>Here are the top 10 destinations you shouldn't miss when visiting Vietnam:</p>
    
    <h2>1. Halong Bay</h2>
    <p>A UNESCO World Heritage Site, Halong Bay features thousands of limestone karsts and isles in various shapes and sizes. Cruise among the karst formations, explore caves, and enjoy the emerald waters of this natural wonder.</p>
    
    <h2>2. Hoi An Ancient Town</h2>
    <p>This well-preserved ancient town was once a major port. Today, it's known for its charming architecture, colorful lanterns, tailor shops, and excellent food scene. The pedestrian-friendly streets make it a delight to explore on foot.</p>
    
    <h2>3. Hanoi</h2>
    <p>Vietnam's capital blends ancient and modern with its Old Quarter, French colonial architecture, and contemporary developments. Don't miss the Temple of Literature, Ho Chi Minh Mausoleum, and the vibrant street food scene.</p>
    
    <h2>4. Ho Chi Minh City</h2>
    <p>Formerly known as Saigon, this dynamic city is Vietnam's economic center. Visit the War Remnants Museum, Cu Chi Tunnels, and Ben Thanh Market to understand both the historical and contemporary aspects of Vietnamese life.</p>
    
    <h2>5. Sapa</h2>
    <p>Known for its terraced rice fields and trekking opportunities, Sapa offers stunning mountain landscapes and the chance to experience the cultures of ethnic minority groups like the Hmong and Dao people.</p>
    
    <h2>6. Phong Nha-Ke Bang National Park</h2>
    <p>Home to the world's largest cave, Son Doong, this national park features an extensive network of caves, underground rivers, and lush forests. It's a paradise for adventure seekers and nature lovers.</p>
    
    <h2>7. Hue</h2>
    <p>The former imperial capital of Vietnam, Hue is rich in history with its Imperial City, royal tombs, and historic pagodas. The city is also known for its distinctive cuisine.</p>
    
    <h2>8. Mekong Delta</h2>
    <p>Known as Vietnam's "rice bowl," the Mekong Delta is a maze of rivers, swamps, and islands. Take a boat tour to experience floating markets, fruit orchards, and the unique river lifestyle of the region.</p>
    
    <h2>9. Phu Quoc Island</h2>
    <p>With its white-sand beaches, clear waters, and lush forests, Phu Quoc is Vietnam's largest island and a growing beach destination. It's also known for its fish sauce production and pepper farms.</p>
    
    <h2>10. Da Nang</h2>
    <p>This coastal city is famous for its clean beaches, the Marble Mountains, and the iconic Dragon Bridge. It's also a gateway to both Hoi An and Hue, making it a convenient base for exploring central Vietnam.</p>
    
    <h2>Tips for Traveling in Vietnam</h2>
    <ul>
      <li>The best time to visit Vietnam depends on the region, as the country has distinct climate zones. Generally, spring (February to April) and autumn (August to October) offer pleasant weather in most areas.</li>
      <li>Learn a few basic Vietnamese phrases – locals appreciate the effort, and it can help with communication in less touristy areas.</li>
      <li>Try the street food, but choose busy stalls with high turnover for the freshest and safest options.</li>
      <li>Bargaining is expected in markets, but remember to be respectful and keep a sense of humor.</li>
      <li>Traffic can be overwhelming, especially in major cities. Take your time crossing streets, move steadily, and don't make sudden changes in direction.</li>
    </ul>
    
    <p>Vietnam offers an incredible diversity of experiences, from natural wonders to cultural immersion and historical exploration. Whether you're a foodie, adventure seeker, history buff, or beach lover, Vietnam has something special to offer.</p>
  `,
  excerpt:
    "Discover the most breathtaking places to visit in Vietnam, from the bustling streets of Hanoi to the serene waters of Halong Bay.",
  image: "/placeholder.svg?height=600&width=1200",
  date: "April 15, 2025",
  author: {
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Sarah is a travel writer and photographer who has been exploring Southeast Asia for over a decade. She specializes in cultural and culinary travel experiences.",
  },
  category: "destinations",
  tags: ["vietnam", "travel tips", "destinations", "halong bay", "hoi an", "hanoi"],
  relatedPosts: [
    {
      id: 2,
      title: "Vietnamese Cuisine: A Culinary Journey",
      excerpt:
        "Explore the rich flavors and unique dishes that make Vietnamese cuisine one of the most beloved in the world.",
      image: "/placeholder.svg?height=200&width=300",
      date: "April 10, 2025",
    },
    {
      id: 5,
      title: "Vietnam's Hidden Beaches: Off the Beaten Path",
      excerpt:
        "Escape the crowds and discover Vietnam's secret beaches that offer pristine sands and crystal-clear waters.",
      image: "/placeholder.svg?height=200&width=300",
      date: "March 20, 2025",
    },
    {
      id: 6,
      title: "Cultural Etiquette in Vietnam: Do's and Don'ts",
      excerpt:
        "Navigate Vietnamese customs and traditions with confidence by following these essential cultural guidelines.",
      image: "/placeholder.svg?height=200&width=300",
      date: "March 15, 2025",
    },
  ],
}

export default function BlogPost({ id }: { id: string }) {
  const { t } = useLanguage()

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Link href="/blog" className="text-primary hover:underline">
              ← Back to Blog
            </Link>
          </div>

          <article>
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {blogPostData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{blogPostData.title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {blogPostData.date}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {blogPostData.author.name}
                </div>
              </div>

              <img
                src={blogPostData.image || "/placeholder.svg"}
                alt={blogPostData.title}
                className="w-full h-auto rounded-lg"
              />
            </header>

            <div
              className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: blogPostData.content }}
            />

            <footer className="mt-8 pt-6 border-t">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {blogPostData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Share:</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </footer>

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={blogPostData.author.avatar} alt={blogPostData.author.name} />
                  <AvatarFallback>{blogPostData.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{blogPostData.author.name}</h3>
                  <p className="text-sm text-muted-foreground">{blogPostData.author.bio}</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div>
          <div className="lg:sticky lg:top-20 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {blogPostData.relatedPosts.map((post) => (
                    <div key={post.id} className="flex gap-3">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-20 h-16 object-cover rounded-md flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          <Link href={`/blog/${post.id}`} className="hover:text-primary">
                            {post.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-muted-foreground">{post.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "vietnam",
                    "travel tips",
                    "destinations",
                    "food",
                    "culture",
                    "adventure",
                    "beaches",
                    "photography",
                    "budget travel",
                    "hanoi",
                    "ho chi minh city",
                    "halong bay",
                  ].map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest travel tips and updates delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <input type="email" placeholder="Your email address" className="w-full px-3 py-2 border rounded-md" />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Explore Vietnam</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/tours">Browse Vietnam Tours</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/contact">Contact a Travel Expert</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


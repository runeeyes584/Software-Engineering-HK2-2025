"use client"

import { useLanguage } from "@/components/language-provider"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Must-Visit Destinations in Vietnam",
    excerpt:
      "Discover the most breathtaking places to visit in Vietnam, from the bustling streets of Hanoi to the serene waters of Halong Bay.",
    image: "/placeholder.svg?height=300&width=600",
    date: "April 15, 2025",
    author: "Sarah Johnson",
    category: "destinations",
    tags: ["vietnam", "travel tips", "destinations"],
  },
  {
    id: 2,
    title: "Vietnamese Cuisine: A Culinary Journey",
    excerpt:
      "Explore the rich flavors and unique dishes that make Vietnamese cuisine one of the most beloved in the world.",
    image: "/placeholder.svg?height=300&width=600",
    date: "April 10, 2025",
    author: "Michael Chen",
    category: "food",
    tags: ["food", "cuisine", "vietnam"],
  },
  {
    id: 3,
    title: "Sustainable Travel: Eco-Friendly Tips for Vietnam",
    excerpt: "Learn how to minimize your environmental impact while exploring Vietnam's natural wonders.",
    image: "/placeholder.svg?height=300&width=600",
    date: "April 5, 2025",
    author: "Emma Rodriguez",
    category: "tips",
    tags: ["sustainable travel", "eco-friendly", "responsible tourism"],
  },
  {
    id: 4,
    title: "Trekking in Sapa: A Complete Guide",
    excerpt:
      "Everything you need to know about trekking in the stunning mountains of Sapa, from preparation to the best trails.",
    image: "/placeholder.svg?height=300&width=600",
    date: "March 28, 2025",
    author: "John Smith",
    category: "adventure",
    tags: ["trekking", "sapa", "adventure", "mountains"],
  },
  {
    id: 5,
    title: "Vietnam's Hidden Beaches: Off the Beaten Path",
    excerpt:
      "Escape the crowds and discover Vietnam's secret beaches that offer pristine sands and crystal-clear waters.",
    image: "/placeholder.svg?height=300&width=600",
    date: "March 20, 2025",
    author: "Lisa Nguyen",
    category: "destinations",
    tags: ["beaches", "hidden gems", "off the beaten path"],
  },
  {
    id: 6,
    title: "Cultural Etiquette in Vietnam: Do's and Don'ts",
    excerpt:
      "Navigate Vietnamese customs and traditions with confidence by following these essential cultural guidelines.",
    image: "/placeholder.svg?height=300&width=600",
    date: "March 15, 2025",
    author: "David Wilson",
    category: "culture",
    tags: ["culture", "etiquette", "traditions"],
  },
  {
    id: 7,
    title: "Photography Tips for Capturing Vietnam's Beauty",
    excerpt:
      "Improve your travel photography skills with these tips specifically tailored for Vietnam's diverse landscapes and scenes.",
    image: "/placeholder.svg?height=300&width=600",
    date: "March 8, 2025",
    author: "Sophie Taylor",
    category: "tips",
    tags: ["photography", "travel tips", "landscapes"],
  },
  {
    id: 8,
    title: "Vietnam on a Budget: Travel Hacks and Savings",
    excerpt:
      "Experience the best of Vietnam without breaking the bank with these money-saving strategies and budget-friendly options.",
    image: "/placeholder.svg?height=300&width=600",
    date: "March 1, 2025",
    author: "Alex Brown",
    category: "tips",
    tags: ["budget travel", "money saving", "backpacking"],
  },
]

// Categories
const categories = [
  { id: "all", label: "All Categories" },
  { id: "destinations", label: "Destinations" },
  { id: "food", label: "Food & Cuisine" },
  { id: "culture", label: "Culture" },
  { id: "adventure", label: "Adventure" },
  { id: "tips", label: "Travel Tips" },
]

export default function BlogListing() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  // Filter blog posts based on search query and active category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = activeCategory === "all" || post.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-muted py-12">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Travel Blog</h1>
            <p className="text-muted-foreground mb-8">
              Discover travel tips, destination guides, and stories from our adventures in Vietnam and beyond.
            </p>

            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container py-16">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="space-y-8">
          <TabsList className="flex flex-wrap justify-center">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-6">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden flex flex-col">
                    <div className="aspect-[16/9] relative">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader className="flex-grow">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center border-t pt-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                    </CardFooter>
                    <CardFooter className="pt-0">
                      <Button asChild className="w-full">
                        <Link href={`/blog/${post.id}`}>Read More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any articles matching your search. Try different keywords or browse other categories.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>

        <div className="mt-16 bg-muted/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Stay updated with our latest travel tips, destination guides, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Your email address" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  )
}


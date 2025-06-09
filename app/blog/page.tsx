import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BlogListing from "@/components/blog/blog-listing"

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <BlogListing />
      </main>
      <Footer />
    </div>
  )
}


import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BlogPost from "@/components/blog/blog-post"

export default function BlogPostPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <BlogPost id={params.id} />
      </main>
      <Footer />
    </div>
  )
}


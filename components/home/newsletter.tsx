"use client"

import type React from "react"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function Newsletter() {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    setIsSubmitted(true)
  }

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8">
            Subscribe to our newsletter to receive exclusive offers, travel tips, and updates on new destinations.
          </p>

          {isSubmitted ? (
            <div className="bg-primary-foreground/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p>You've been successfully subscribed to our newsletter.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}


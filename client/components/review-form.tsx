"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@clerk/nextjs"

interface ReviewFormProps {
  tourId: string
  bookingId: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ tourId, bookingId, onReviewSubmitted }: ReviewFormProps) {
  const { t } = useLanguage()
  const { getToken } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error(t("review.pleaseSelectRating"))
      return
    }

    try {
      setIsSubmitting(true)
      console.log('DEBUG review submit:', { tourId, bookingId, rating, comment });
      const token = await getToken()
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tourId,
          bookingId,
          rating,
          comment,
        }),
      })

      const errorText = await response.text();
      if (!response.ok) {
        console.error("Review API error:", response.status, errorText);
        throw new Error("Failed to submit review");
      }

      toast.success(t("review.submitted"))
      setRating(0)
      setComment("")
      onReviewSubmitted?.()
    } catch (error) {
      toast.error(t("review.error"))
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("review.leaveReview")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder={t("review.commentPlaceholder")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("common.submitting") : t("review.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 
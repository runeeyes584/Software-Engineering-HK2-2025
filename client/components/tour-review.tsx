import { Star, ThumbsUp, MessageCircle, Calendar, Clock } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Review {
  id: string
  user: {
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  date: string
  adminReply?: string
  likes?: number
  replies?: number
  tourDate?: string
  duration?: string
}

interface TourReviewProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export function TourReview({ reviews, averageRating, totalReviews }: TourReviewProps) {
  const { t } = useLanguage()

  // Calculate rating distribution
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  return (
    <div className="space-y-12">
      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
          <div className="text-2xl font-bold text-primary mb-2">{averageRating}</div>
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < Math.floor(averageRating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted-foreground"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{totalReviews} Đánh giá</span>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2 space-y-3 p-6 bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl border border-border">
          <h3 className="text-base font-semibold mb-3">Rating Distribution</h3>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                </div>
                <Progress 
                  value={percentage} 
                  className="flex-1 h-2 bg-muted/50" 
                />
                <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                  {Math.round(percentage)}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Nếu chưa có review thì hiện thông báo */}
      {totalReviews === 0 && (
        <div className="py-12 text-center text-muted-foreground text-lg">
          Chưa có đánh giá nào cho tour này.
        </div>
      )}

      {/* Reviews List */}
      {totalReviews > 0 && (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 rounded-xl border border-border bg-card transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/10 shadow-sm">
                      <span className="text-base text-primary font-medium">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-base">{review.user.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {review.date}
                      </div>
                      {review.tourDate && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {review.tourDate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 to-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-sm">{review.rating}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{review.comment}</p>

              {/* Review Actions */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button variant="ghost" size="sm" className="gap-1.5 h-8 hover:bg-muted/50">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span className="text-sm">{review.likes || 0}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5 h-8 hover:bg-muted/50">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span className="text-sm">{review.replies || 0}</span>
                </Button>
              </div>

              {/* Admin Reply */}
              {review.adminReply && (
                <div className="mt-4 pl-4 border-l-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/10">
                      <span className="text-xs text-primary font-medium">A</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary">{t("tour.adminReply")}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{review.adminReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
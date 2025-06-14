import { Star, ThumbsUp, MessageCircle, Calendar, Clock, MoreVertical, Pencil, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useLanguage } from "@/components/language-provider-fixed"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import { ReviewForm } from "@/components/review-form"

interface Review {
  id: string
  user: {
    name: string
    avatar?: string
    clerkId?: string
  }
  rating: number
  comment: string
  date: string
  adminReply?: string
  likes?: string[]
  replies?: number
  tourDate?: string
  duration?: string
  images?: string[]
  videos?: string[]
}

interface TourReviewProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  onRefreshReviews?: () => void
}

export function TourReview({ reviews, averageRating, totalReviews, onRefreshReviews }: TourReviewProps) {
  const { t } = useLanguage()
  const { user } = useUser()
  const { getToken } = useAuth()
  const userId = user?.id
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ rating: number; comment: string } | null>(null)
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews)
  const [likingReviewId, setLikingReviewId] = useState<string | null>(null)
  const [imageModal, setImageModal] = useState<{images: string[], index: number} | null>(null)

  // Cập nhật localReviews khi reviews prop thay đổi
  useEffect(() => {
    setLocalReviews(reviews)
  }, [reviews])

  // Xử lý phím mũi tên trong modal
  useEffect(() => {
    if (!imageModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setImageModal((prev) => prev && {
          images: prev.images,
          index: (prev.index - 1 + prev.images.length) % prev.images.length
        });
      } else if (e.key === 'ArrowRight') {
        setImageModal((prev) => prev && {
          images: prev.images,
          index: (prev.index + 1) % prev.images.length
        });
      } else if (e.key === 'Escape') {
        setImageModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageModal]);

  // Calculate rating distribution
  const ratingDistribution = localReviews.reduce((acc, review) => {
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
          <span className="text-xs text-muted-foreground">{totalReviews} {t("review.rating")}</span>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2 space-y-3 p-6 bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl border border-border">
          <h3 className="text-base font-semibold mb-3">{t("review.ratingDistribution")}</h3>
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
          {t("review.noReviews")}
        </div>
      )}

      {/* Reviews List */}
      {totalReviews > 0 && (
        <div className="space-y-6">
          {localReviews.map((review) => {
            const isOwner = userId && review.user?.clerkId && userId === review.user.clerkId
            const hasLiked = userId && Array.isArray(review.likes) ? review.likes.includes(userId) : false
            return (
              <div
                key={review.id}
                className="p-4 rounded-xl border border-border bg-card transition-all duration-300 group relative"
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
                  <div className="flex flex-col items-end gap-1 relative">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/10 to-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-sm">{review.rating}</span>
                    </div>
                    {isOwner && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 p-0"><MoreVertical className="w-5 h-5" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="center" className="rounded-xl shadow-lg p-1 min-w-[140px]">
                            <DropdownMenuItem onClick={() => {
                              setEditingReviewId(review.id)
                              setEditData({ rating: review.rating, comment: review.comment })
                            }} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition">
                              <Pencil className="w-4 h-4 text-primary" />
                              <span>{t("review.edit")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDeletingReviewId(review.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition">
                              <Trash2 className="w-4 h-4" />
                              <span>{t("review.delete")}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </div>
                {/* Nếu đang edit review này thì hiện ReviewForm */}
                {editingReviewId === review.id ? (
                  <div className="mb-4">
                    <ReviewForm
                      tourId={""}
                      bookingId={""}
                      initialRating={editData?.rating}
                      initialComment={editData?.comment}
                      initialImages={review.images || []}
                      initialVideos={review.videos || []}
                      onReviewSubmitted={() => {
                        setEditingReviewId(null)
                        onRefreshReviews?.()
                      }}
                      onCancel={() => setEditingReviewId(null)}
                      reviewId={review.id}
                      isEdit
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{review.comment}</p>
                    {/* Gallery ảnh/video nếu có */}
                    {((Array.isArray(review.images) && review.images.length > 0) || (Array.isArray(review.videos) && review.videos.length > 0)) && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {Array.isArray(review.images) && review.images.map((url, idx, arr) => (
                          <img
                            key={url+idx}
                            src={url}
                            alt="img"
                            className="w-24 h-24 object-cover rounded cursor-pointer hover:ring-2 hover:ring-primary"
                            onClick={() => setImageModal({ images: arr, index: idx })}
                          />
                        ))}
                        {Array.isArray(review.videos) && review.videos.map((url, idx) => (
                          <video key={url+idx} src={url} controls className="w-24 h-24 rounded" />
                        ))}
                      </div>
                    )}
                  </>
                )}
                {/* Review Actions */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={likingReviewId === review.id}
                    className={cn(
                      "relative h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 border border-transparent",
                      hasLiked
                        ? "bg-yellow-50 border-yellow-300 text-yellow-600 shadow-md scale-105"
                        : "bg-white hover:bg-yellow-50 hover:border-yellow-200 text-muted-foreground hover:scale-105"
                    )}
                    onClick={async () => {
                      if (!userId) {
                        toast.error(t("auth.login"));
                        return;
                      }
                      // Optimistic update - cập nhật UI ngay lập tức
                      setLocalReviews(prev => prev.map(r => 
                        r.id === review.id ? {
                          ...r,
                          likes: hasLiked 
                            ? (r.likes || []).filter(id => id !== userId) // unlike
                            : [...(r.likes || []), userId] // like
                        } : r
                      ));
                      setLikingReviewId(review.id);
                      try {
                        const token = await getToken();
                        const url = `http://localhost:5000/api/reviews/${review.id}/${hasLiked ? "unlike" : "like"}`;
                        const res = await fetch(url, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                          }
                        });
                        if (!res.ok) {
                          // Nếu API fail, revert lại UI
                          setLocalReviews(prev => prev.map(r => 
                            r.id === review.id ? {
                              ...r,
                              likes: hasLiked 
                                ? [...(r.likes || []), userId] // revert like
                                : (r.likes || []).filter(id => id !== userId) // revert unlike
                            } : r
                          ));
                          toast.error(t("review.likeError") || "Lỗi khi like review");
                        }
                      } catch (error) {
                        setLocalReviews(prev => prev.map(r => 
                          r.id === review.id ? {
                            ...r,
                            likes: hasLiked 
                              ? [...(r.likes || []), userId] // revert like
                              : (r.likes || []).filter(id => id !== userId) // revert unlike
                          } : r
                        ));
                        toast.error(t("review.likeError") || "Lỗi khi like review");
                      } finally {
                        setLikingReviewId(null);
                        onRefreshReviews?.(); // Luôn đồng bộ lại với BE
                      }
                    }}
                  >
                    <ThumbsUp className={cn(
                      "h-5 w-5 transition-all duration-200 drop-shadow-sm",
                      hasLiked ? "fill-yellow-400 text-yellow-500 scale-110" : "hover:scale-110"
                    )} />
                    <span className={cn(
                      "absolute -right-2 -top-2 min-w-[22px] h-6 px-1 rounded-full text-xs font-bold flex items-center justify-center border border-yellow-200 bg-yellow-100 text-yellow-700 shadow-sm transition-all duration-200",
                      hasLiked ? "scale-100" : "scale-90 opacity-80"
                    )}>
                      {Array.isArray(review.likes) ? review.likes.length : (review.likes || 0)}
                    </span>
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
                {/* Dialog xác nhận xóa */}
                <Dialog open={deletingReviewId === review.id} onOpenChange={open => { if (!open) setDeletingReviewId(null) }}>
                  <DialogContent>
                    <DialogHeader>{t("review.deleteConfirm")}</DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeletingReviewId(null)}>{t("common.cancel")}</Button>
                      <Button variant="destructive" onClick={async () => {
                        // Gọi API xóa review với xác thực Clerk
                        const token = await getToken()
                        const res = await fetch(`http://localhost:5000/api/reviews/${review.id}`, {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                          }
                        })
                        setDeletingReviewId(null)
                        if (res.ok) {
                          toast.success(t("review.deleted") || "Xóa review thành công!")
                          onRefreshReviews?.()
                        } else {
                          toast.error(t("review.deleteError") || "Xóa review thất bại!")
                        }
                      }}>{t("common.delete")}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )
          })}
        </div>
      )}
      {/* Modal xem ảnh lớn, chuyển trái/phải */}
      <Dialog open={!!imageModal} onOpenChange={() => setImageModal(null)}>
        <DialogContent
          className="max-w-3xl w-auto p-0 flex flex-col items-center justify-center relative bg-transparent shadow-none border-none"
          style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}
        >
          {imageModal && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10"
                onClick={() => setImageModal(prev => prev && ({
                  images: prev.images,
                  index: (prev.index - 1 + prev.images.length) % prev.images.length
                }))}
                tabIndex={0}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <img
                src={imageModal.images[imageModal.index]}
                alt="Ảnh review"
                className="max-h-[80vh] max-w-full rounded-xl shadow-lg"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10"
                onClick={() => setImageModal(prev => prev && ({
                  images: prev.images,
                  index: (prev.index + 1) % prev.images.length
                }))}
                tabIndex={0}
                aria-label="Next image"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
              <button
                className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-white z-10"
                onClick={() => setImageModal(null)}
                tabIndex={0}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs rounded-full px-3 py-1">
                {imageModal.index + 1} / {imageModal.images.length}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 
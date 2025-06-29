import { useLanguage } from "@/components/language-provider-fixed"
import { ReviewForm } from "@/components/review-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAuth, useUser } from "@clerk/nextjs"
import { Calendar, ChevronLeft, ChevronRight, Clock, MessageCircle, MoreVertical, Pencil, PlayCircle, Reply, Star, ThumbsUp, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

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
  tourId: string
  bookingId: string | null
  hasReviewed: boolean
  bookingLoading: boolean
}

export function TourReview({ reviews, averageRating, totalReviews, onRefreshReviews, tourId, bookingId, hasReviewed, bookingLoading }: TourReviewProps) {
  const { t } = useLanguage()
  const { user } = useUser()
  const { getToken } = useAuth()
  const userId = user?.id

  const [isAdminFromDB, setIsAdminFromDB] = useState(false);
  const [currentReplyText, setCurrentReplyText] = useState<string>('');

  // Fetch user role from database
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userId) return;
      try {
        const token = await getToken();
        const res = await fetch(`http://localhost:5000/api/users/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.role === 'admin') {
            setIsAdminFromDB(true);
          } else {
            setIsAdminFromDB(false);
          }
        } else {
          console.error("Failed to fetch user profile for role check:", res.statusText);
          setIsAdminFromDB(false);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsAdminFromDB(false);
      }
    };
    fetchUserRole();
  }, [userId, getToken]);

  const isAdmin = isAdminFromDB; // Check if current user is admin from database
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ rating: number; comment: string } | null>(null)
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews)
  const [likingReviewId, setLikingReviewId] = useState<string | null>(null)
  const [mediaModal, setMediaModal] = useState<{ 
    url: string; 
    type: 'image' | 'video'; 
    reviewMedia: { url: string; type: 'image' | 'video' }[]; 
    currentIndex: number 
  } | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [replyingToReviewId, setReplyingToReviewId] = useState<string | null>(null);

  // Cập nhật localReviews khi reviews prop thay đổi
  useEffect(() => {
    setLocalReviews(reviews)
  }, [reviews])

  // Xử lý phím mũi tên và Esc trong modal chung
  useEffect(() => {
    if (!mediaModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const { reviewMedia, currentIndex } = mediaModal;
        const totalMedia = reviewMedia.length;
        let newIndex = currentIndex;

        if (e.key === 'ArrowLeft') {
          newIndex = (currentIndex - 1 + totalMedia) % totalMedia;
        } else { // ArrowRight
          newIndex = (currentIndex + 1) % totalMedia;
        }

        const nextMedia = reviewMedia[newIndex];
        setMediaModal({ ...mediaModal, url: nextMedia.url, type: nextMedia.type, currentIndex: newIndex });
      } else if (e.key === 'Escape') {
        setMediaModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mediaModal]);

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

      {/* Review Form */}
      {!bookingLoading && bookingId && !hasReviewed && (
        <ReviewForm
          tourId={tourId}
          bookingId={bookingId}
          onReviewSubmitted={onRefreshReviews}
        />
      )}

      {/* Nếu chưa có review thì hiện thông báo */}
      {totalReviews === 0 && (
        <div className="py-12 text-center text-muted-foreground text-lg">
          {t("review.noReviews")}
        </div>
      )}

      {/* Reviews List */}
      {totalReviews > 0 && (
        <div className="space-y-6">
          {localReviews.slice(0, showAllReviews ? localReviews.length : 3).map((review) => {
            const isOwner = userId && review.user?.clerkId && userId === review.user.clerkId
            const hasLiked = userId && Array.isArray(review.likes) ? review.likes.includes(userId) : false

            // Kết hợp ảnh và video vào một mảng media chung cho đánh giá này
            const reviewMedia: { url: string; type: 'image' | 'video' }[] = [];
            review.images?.forEach(url => reviewMedia.push({ url, type: 'image' }));
            review.videos?.forEach(url => reviewMedia.push({ url, type: 'video' }));

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
                    <p className="text-base font-bold text-foreground leading-relaxed mb-4">{review.comment}</p>
                    {/* Gallery ảnh/video nếu có */}
                    {((Array.isArray(review.images) && review.images.length > 0) || (Array.isArray(review.videos) && review.videos.length > 0)) && (
                      <div className="flex flex-wrap gap-2 mb-2 items-center">
                        {reviewMedia.slice(0, 4).map((media, index) => (
                          <div
                            key={index}
                            className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-300"
                            onClick={() => setMediaModal({ url: media.url, type: media.type, reviewMedia, currentIndex: index })}
                          >
                            {media.type === 'image' ? (
                              <img
                                src={media.url}
                                alt={`Review media ${index + 1}`}
                                className="w-full h-full object-cover rounded transition-transform duration-300"
                              />
                            ) : (
                              <>
                                <video
                                  src={media.url}
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                  muted
                                  playsInline
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                  <PlayCircle className="w-8 h-8 text-white/90 group-hover:text-white transition-colors" />
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        {reviewMedia.length > 4 && (
                          <div
                            className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center text-sm font-bold text-primary bg-primary/10 border border-primary/20 cursor-pointer"
                            onClick={() => setMediaModal({ url: reviewMedia[3].url, type: reviewMedia[3].type, reviewMedia, currentIndex: 3 })}
                          >
                            +{reviewMedia.length - 4}
                          </div>
                        )}
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
                    <span className="text-sm">{review.adminReply ? 1 : (review.replies || 0)}</span>
                  </Button>
                  {isAdmin && review.user?.clerkId !== userId && review.adminReply === undefined && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1.5 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/5 text-primary"
                      onClick={() => {
                        setReplyingToReviewId(review.id);
                        setCurrentReplyText(review.adminReply || ''); // Initialize with existing reply
                      }}
                    >
                      <Reply className="h-3.5 w-3.5" />
                      <span className="text-sm">{t("review.reply")}</span>
                    </Button>
                  )}
                </div>

                {/* Admin Reply Form Inline */}
                {replyingToReviewId === review.id && (
                  <div className="mt-4 pt-4 border-t border-border-2">
                    <div className="grid w-full items-center gap-4">
                      <Label htmlFor="adminReply" className="text-left">
                        {t("review.yourReply")}
                      </Label>
                      <Textarea
                        id="adminReply"
                        placeholder={t("review.replyPlaceholder")}
                        className="h-24"
                        value={currentReplyText}
                        onChange={(e) => setCurrentReplyText(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentReplyText(''); // Clear the input
                          setReplyingToReviewId(null);
                        }}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button
                        onClick={async () => {
                          if (currentReplyText) {
                            const token = await getToken();
                            const res = await fetch(`http://localhost:5000/api/reviews/${review.id}/admin-reply`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                              },
                              body: JSON.stringify({ adminReply: currentReplyText }),
                            });
                            if (res.ok) {
                              toast.success(t("review.replySuccess") || "Phản hồi thành công!");
                              setCurrentReplyText(''); // Clear the input
                              setReplyingToReviewId(null);
                              onRefreshReviews?.();
                            } else {
                              toast.error(t("review.replyError") || "Phản hồi thất bại!");
                            }
                          }
                        }}
                      >
                        {t("common.submit")}
                      </Button>
                    </div>
                  </div>
                )}

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
                    <DialogHeader>
                      <DialogTitle>{t("review.deleteConfirm")}</DialogTitle>
                    </DialogHeader>
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

          {totalReviews > 3 && !showAllReviews && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAllReviews(true)}
                className="w-fit px-8 py-2 rounded-full border-primary/20 text-primary hover:bg-primary/5"
              >
                {t("review.loadMore")}
              </Button>
            </div>
          )}
        </div>
      )}
      {/* Media Modal - Hiển thị ảnh hoặc video */}
      {mediaModal && (
        <Dialog open={!!mediaModal} onOpenChange={() => setMediaModal(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none z-[9999]">
            <DialogHeader className="sr-only">
              <DialogTitle>Review Media</DialogTitle>
            </DialogHeader>
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {mediaModal.type === 'image' ? (
                <img src={mediaModal.url} alt="Review Media" className="w-full h-full object-contain" />
              ) : (
                <video src={mediaModal.url} controls className="w-full h-full object-contain" autoPlay />
              )}

              {mediaModal.reviewMedia.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      const { reviewMedia, currentIndex } = mediaModal;
                      const newIndex = (currentIndex - 1 + reviewMedia.length) % reviewMedia.length;
                      const nextMedia = reviewMedia[newIndex];
                      setMediaModal({ ...mediaModal, url: nextMedia.url, type: nextMedia.type, currentIndex: newIndex });
                    }}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      const { reviewMedia, currentIndex } = mediaModal;
                      const newIndex = (currentIndex + 1) % reviewMedia.length;
                      const nextMedia = reviewMedia[newIndex];
                      setMediaModal({ ...mediaModal, url: nextMedia.url, type: nextMedia.type, currentIndex: newIndex });
                    }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 
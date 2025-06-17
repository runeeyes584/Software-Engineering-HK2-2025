"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider-fixed"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star, Send } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  tourId: string
  bookingId: string
  onReviewSubmitted?: () => void
  initialRating?: number
  initialComment?: string
  initialImages?: string[]
  initialVideos?: string[]
  reviewId?: string
  isEdit?: boolean
  onCancel?: () => void
}

// Thêm hàm upload file lên Cloudinary qua BE
async function uploadFilesToCloudinary(files: File[]): Promise<{images: string[], videos: string[]}> {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  const res = await fetch('http://localhost:5000/api/cloudinary/upload-multiple', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  const images: string[] = [];
  const videos: string[] = [];
  for (const file of data.files) {
    if (file.type === 'image') images.push(file.fileUrl);
    else if (file.type === 'video') videos.push(file.fileUrl);
  }
  return { images, videos };
}

export function ReviewForm({ tourId, bookingId, onReviewSubmitted, initialRating = 0, initialComment = "", initialImages = [], initialVideos = [], reviewId, isEdit = false, onCancel }: ReviewFormProps) {
  const { t } = useLanguage()
  const { getToken } = useAuth()
  const [rating, setRating] = useState(initialRating)
  const [comment, setComment] = useState(initialComment)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const maxLength = 500
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mediaUrls, setMediaUrls] = useState<{images: string[], videos: string[]}>(
    isEdit ? { images: initialImages, videos: initialVideos } : { images: [], videos: [] }
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setIsUploading(true);
    try {
      const urls = await uploadFilesToCloudinary(files);
      setMediaUrls(prev => ({
        images: [...prev.images, ...urls.images],
        videos: [...prev.videos, ...urls.videos],
      }));
      toast.success('Upload thành công!');
    } catch {
      toast.error('Upload thất bại!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMedia = (type: 'image' | 'video', url: string) => {
    setMediaUrls(prev => ({
      ...prev,
      [type === 'image' ? 'images' : 'videos']: prev[type === 'image' ? 'images' : 'videos'].filter(u => u !== url)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error(t("review.pleaseSelectRating"))
      return
    }
    try {
      setIsSubmitting(true)
      const token = await getToken()
      let response
      if (isEdit && reviewId) {
        response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ rating, comment, images: mediaUrls.images, videos: mediaUrls.videos }),
        })
      } else {
        response = await fetch("http://localhost:5000/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ tourId, bookingId, rating, comment, images: mediaUrls.images, videos: mediaUrls.videos }),
        })
      }
      const errorText = await response.text();
      if (!response.ok) {
        console.error("Review API error:", response.status, errorText);
        throw new Error("Failed to submit review");
      }
      toast.success(isEdit ? t("review.updated") : t("review.submitted"))
      setRating(0)
      setComment("")
      setMediaUrls({ images: [], videos: [] })
      setSelectedFiles([])
      onReviewSubmitted?.()
    } catch (error) {
      toast.error(t("review.error"))
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-0 sm:p-0 overflow-hidden mt-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-0"
      >
        {/* Left: Icon, Title, Star */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-white px-6 py-7 sm:py-10 sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-100">
          <Star className="w-10 h-10 text-yellow-400 mb-2 drop-shadow" />
          <h2 className="text-xl font-bold text-primary mb-1 text-center leading-tight">{isEdit ? t("review.editReview") : t("review.leaveReview")}</h2>
          <p className="text-xs text-muted-foreground mb-3 text-center">{t("review.rating")}</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full border border-transparent focus:outline-none transition-all",
                  rating >= star ? "text-yellow-500 bg-yellow-50 shadow-sm" : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-50"
                )}
                aria-label={`Rate ${star}`}
                title={star.toString()}
              >
                <Star
                  className={cn(
                    "w-6 h-6",
                    rating >= star ? "fill-yellow-400" : ""
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        {/* Right: Textarea, Media, Submit */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 gap-4">
          <div className="relative flex-1">
            <textarea
              className="w-full min-h-[90px] rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 p-4 text-base resize-none transition placeholder:text-gray-400 bg-gray-50 shadow-sm"
              placeholder={t("review.commentPlaceholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={maxLength}
              required
            />
            <span className="absolute bottom-2 right-4 text-xs text-gray-400 select-none">{`${comment.length}/${maxLength}`}</span>
          </div>
          {/* Media upload & preview */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label htmlFor="review-upload" className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition text-sm font-medium shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
                {t('review.uploadFile')}
              </label>
              <input
                id="review-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFiles.length > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary ml-1">{selectedFiles.length}</span>
              )}
              {isUploading && <span className="ml-2 text-xs text-primary animate-pulse">Đang tải...</span>}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {mediaUrls.images.map(url => (
                <div key={url} className="relative group">
                  <img src={url} alt="img" className="w-20 h-20 object-cover rounded" />
                  <button type="button" onClick={() => handleRemoveMedia('image', url)} className="absolute top-0 right-0 bg-white/80 rounded-full p-1 text-xs">✕</button>
                </div>
              ))}
              {mediaUrls.videos.map(url => (
                <div key={url} className="relative group">
                  <video src={url} controls className="w-20 h-20 rounded" />
                  <button type="button" onClick={() => handleRemoveMedia('video', url)} className="absolute top-0 right-0 bg-white/80 rounded-full p-1 text-xs">✕</button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {isEdit && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 rounded-full border border-gray-200 bg-white text-gray-600 font-medium hover:bg-gray-100 transition text-sm"
              >
                {t("common.cancel")}
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 rounded-full bg-primary/90 text-white font-semibold text-base hover:bg-primary transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 mr-1 -ml-1" />
              {isEdit ? t("review.update") : t("review.submit")}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
} 
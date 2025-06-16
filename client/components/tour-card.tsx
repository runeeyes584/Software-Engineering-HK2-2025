import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider-fixed"

interface TourCardProps {
  id: string;
  name: string;
  destination: string;
  price: number;
  averageRating: number;
  reviewCount: number;
  images: string[];
  duration: string;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onViewDetail: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export default function TourCard({
  id,
  name,
  destination,
  price,
  averageRating,
  reviewCount,
  images,
  duration,
  currentIndex,
  onPrev,
  onNext,
  onViewDetail,
  isSaved: isSavedProp = false,
  onToggleSave,
}: TourCardProps) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsSaved(isSavedProp);
  }, [isSavedProp]);

  const handleToggleSave = async () => {
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập để lưu tour!");
      return;
    }
    setLoading(true);
    const token = await getToken();
    try {
      if (isSaved) {
        // Bỏ lưu
        const res = await fetch(`http://localhost:5000/api/saved-tours/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (res.ok) {
          setIsSaved(false);
          toast.success(t('tour.unsaved'));
          if (onToggleSave) onToggleSave();
        } else {
          toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      } else {
        // Lưu tour
        const res = await fetch(`http://localhost:5000/api/saved-tours/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user: user.id, tour: id })
        });
        if (res.ok) {
          setIsSaved(true);
          toast.success(t('tour.saved'));
        } else {
          toast.error(t('tour.saveError') || "Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    } catch {
      toast.error(t('tour.saveError') || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-border rounded-2xl shadow-md transition-transform duration-200 bg-white group relative">
      {/* Nút trái tim lưu tour ở góc trên bên phải card */}
      <button
        type="button"
        onClick={handleToggleSave}
        className={`absolute top-3 right-3 z-30 w-9 h-9 flex items-center justify-center rounded-full border-2 transition-colors shadow-md
          ${isSaved ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-200 hover:bg-gray-100'}`}
        aria-label={isSaved ? 'Bỏ lưu tour' : 'Lưu tour'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isSaved ? '#ef4444' : 'none'}
          stroke={isSaved ? '#ef4444' : '#d1d5db'}
          strokeWidth="2.2"
          className="w-5 h-5 transition-colors"
        >
          <path
            d="M12 21s-5.5-4.6-7.7-7.1C2.2 12.1 2 9.2 4.1 7.3c1.7-1.5 4.3-1.1 5.7.7L12 9.2l2.2-2.2c1.4-1.8 4-2.2 5.7-.7 2.1 1.9 1.9 4.8-.2 6.6C17.5 16.4 12 21 12 21z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="relative h-56 group">
        <Image
          src={images[currentIndex]}
          alt={name || 'Tour image'}
          fill
          className="object-cover rounded-t-2xl transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-white/80 rounded-full px-3 py-1 flex items-center gap-1 shadow text-xs font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-primary font-semibold">{destination}</span>
        </div>
        {/* Nút chuyển ảnh trái/phải, chỉ hiện khi hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              type="button"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
              type="button"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-xl font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </CardTitle>
        {/* Duration dưới tiêu đề, trên rating */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
          <Clock className="h-4 w-4" />
          <span>{/\bngày\b/i.test(duration) ? duration : `${duration} ngày`}</span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="font-semibold text-yellow-600">{(Number(averageRating) || 0).toFixed(1)}</span>
          <span className="text-muted-foreground">({reviewCount})</span>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between px-5 pb-5">
        <span className="text-lg font-bold text-primary">${price.toLocaleString()}</span>
        <Button size="sm" className="rounded-full px-4" onClick={onViewDetail}>
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  );
} 
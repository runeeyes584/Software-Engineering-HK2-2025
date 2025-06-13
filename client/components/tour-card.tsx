import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";

interface TourCardProps {
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
}

export default function TourCard({
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
}: TourCardProps) {
  return (
    <Card className="overflow-hidden border border-border rounded-2xl shadow-md transition-transform duration-200 bg-white group">
      <div className="relative h-56 group">
        <Image
          src={images[currentIndex]}
          alt={name}
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
        {/* Dots indicator nếu muốn giữ lại */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_: any, idx: number) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-primary" : "bg-white/70"}`}
              />
            ))}
          </div>
        )}
      </div>
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-xl font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </CardTitle>
        {/* Duration dưới tiêu đề, trên rating */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
          <Clock className="h-4 w-4" />
          <span>{duration} ngày</span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="font-semibold text-yellow-600">{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground">({reviewCount})</span>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between px-5 pb-5">
        <span className="text-lg font-bold text-primary">{price.toLocaleString()} đ</span>
        <Button size="sm" className="rounded-full px-4" onClick={onViewDetail}>
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  );
} 
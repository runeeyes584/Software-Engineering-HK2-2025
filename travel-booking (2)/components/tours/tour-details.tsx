"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Tour {
  id: string;
  name: string;
  imageUrl: string | null;
  destination: string;
  duration: string;
  price: number;
  rating: number;
}

export default function TourDetails() {
  const params = useParams();
  const tourId = typeof params.id === "string" ? params.id : null;
  const router = useRouter();

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tourId) {
      setError("ID tour không hợp lệ hoặc chưa được cung cấp.");
      setLoading(false);
      return;
    }

    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://localhost:7129/api/tours/${tourId}`);
        if (!response.ok) {
          throw new Error("Không thể tải thông tin tour từ máy chủ.");
        }
        const data: Tour = await response.json();
        setTour(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Đã xảy ra lỗi không xác định.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  const checkLoginAndRedirect = (action: string) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    console.log("isLoggedIn:", isLoggedIn); // Debug giá trị

    if (isLoggedIn === "true") {
      console.log("Redirecting to:", action === "bookNow" ? "booking" : "whitelist");
      if (action === "bookNow") {
        router.push(`/booking?tourId=${tour?.id}`);
      } else if (action === "addToWhitelist") {
        alert("Tour đã được thêm vào danh sách yêu thích.");
      }
    } else {
      console.log("User not logged in, redirecting to /auth/login");
      router.push("/auth/login");
      return;
    }
  };

  if (loading) return <p>Đang tải thông tin tour...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!tour) return <p>Không tìm thấy tour với ID đã cho.</p>;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{tour.name}</h1>
      <img
        src={tour.imageUrl || "/placeholder.png"}
        alt={tour.name}
        className="w-full h-80 object-cover rounded-lg mb-4"
      />
      <div className="space-y-2">
        <p><strong>📍 Điểm đến:</strong> {tour.destination}</p>
        <p><strong>⏳ Thời gian:</strong> {tour.duration}</p>
        <p><strong>💰 Giá:</strong> ${tour.price}</p>
        <p><strong>⭐ Đánh giá:</strong> {tour.rating} / 5</p>
      </div>
      <div className="mt-6 space-y-2">
        <Button className="w-full" onClick={() => checkLoginAndRedirect("bookNow")}>
          Book Now
        </Button>
        <Button variant="outline" className="w-full" onClick={() => checkLoginAndRedirect("addToWhitelist")}>
          Add to Whitelist
        </Button>
      </div>
    </div>
  );
}
"use client";
import { useAuth } from "@clerk/nextjs";
import { CheckCircle, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

interface Booking {
  _id: string;
  totalPrice: number;
  status: string;
  bookingDate: string;
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function RevenuePage() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5000/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const completed = Array.isArray(data)
          ? data.filter((b: Booking) => b.status === 'completed')
          : [];
        setCompletedCount(completed.length);
        setTotalRevenue(completed.reduce((sum, b) => sum + (b.totalPrice || 0), 0));
      } catch {
        setTotalRevenue(0);
        setCompletedCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [getToken]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thống kê Doanh thu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 border border-green-100">
          <div className="bg-green-100 p-3 rounded-full">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <div className="text-lg text-gray-500 mb-1">Tổng doanh thu từ các booking hoàn thành</div>
            <div className="text-2xl font-bold text-green-700">{loading ? 'Đang tải...' : formatCurrency(totalRevenue)}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 border border-blue-100">
          <div className="bg-blue-100 p-3 rounded-full">
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <div className="text-lg text-gray-500 mb-1">Số booking đã hoàn thành</div>
            <div className="text-2xl font-bold text-blue-700">{loading ? 'Đang tải...' : completedCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 
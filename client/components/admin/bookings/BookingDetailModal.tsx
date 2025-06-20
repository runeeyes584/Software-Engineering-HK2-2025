import { CalendarIcon, Clock, BadgeCheck, DollarSign, User, User2, Baby, StickyNote, Users, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider-fixed";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface BookingDetailModalProps {
  booking: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t?: (key: string, options?: any) => string;
  onStatusChange?: (newStatus: string, bookingId: string) => void;
}

export default function BookingDetailModal({ booking, open, onOpenChange, t: tProp, onStatusChange }: BookingDetailModalProps) {
  // Ưu tiên t từ props, fallback sang useLanguage
  const { t: tLang } = useLanguage();
  const t = tProp || tLang;
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data.user?.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch { setIsAdmin(false); }
    };
    fetchRole();
  }, [getToken]);

  const handleUpdateStatus = async (status: string) => {
    if (!booking?._id) return;
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/bookings/${booking._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        if (onStatusChange) onStatusChange(status, booking._id);
        onOpenChange(false);
      } else {
        // eslint-disable-next-line no-alert
        alert('Cập nhật trạng thái thất bại!');
      }
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert('Có lỗi khi cập nhật trạng thái!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full rounded-xl p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-1">{booking?.tour?.name || t('bookingDetailModal.title')}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mb-2">
            {t('bookingDetailModal.bookingId')}: {booking?.bookingCode || booking?._id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-base">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <span className="font-medium">{t('bookingDetailModal.departure')}:</span>
            <span>{booking?.departureDate ? new Date(booking.departureDate).toLocaleDateString('vi-VN') : '--'}</span>
          </div>
          {booking?.returnDate && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <span className="font-medium">{t('bookingDetailModal.return')}:</span>
              <span>{new Date(booking.returnDate).toLocaleDateString('vi-VN')}</span>
            </div>
          )}
          {booking?.tour?.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">{t('bookingDetailModal.duration')}</span>
              <span>{booking.tour.duration} {t('tour.days')}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-primary" />
            <span className="font-medium">{t('bookingDetailModal.status')}</span>
            <span className={
              'ml-2 px-3 py-1 rounded-full text-xs font-bold ' +
              (booking?.status?.toLowerCase() === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : booking?.status?.toLowerCase() === 'confirmed'
                ? 'bg-green-100 text-green-800'
                : booking?.status?.toLowerCase() === 'completed'
                ? 'bg-purple-100 text-purple-800'
                : booking?.status?.toLowerCase() === 'cancelled'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800')
            }>
              {t('booking.status.' + booking?.status?.toLowerCase())}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="font-medium">{t('bookingDetailModal.total')}:</span>
            <span className="font-bold text-primary text-lg">${booking?.totalPrice?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <span className="font-medium">{t('bookingDetailModal.adults')}:</span>
            <span>{booking?.adults ?? 0}</span>
            <User2 className="w-5 h-5 text-primary ml-3" />
            <span className="font-medium">{t('bookingDetailModal.children')}:</span>
            <span>{booking?.children ?? 0}</span>
            <Baby className="w-5 h-5 text-primary ml-3" />
            <span className="font-medium">{t('bookingDetailModal.infants')}:</span>
            <span>{booking?.infants ?? 0}</span>
          </div>
          {booking?.note && (
            <div className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-primary" />
              <span className="font-medium">{t('bookingDetailModal.note')}:</span>
              <span>{booking.note}</span>
            </div>
          )}
          {booking?.transportType && (
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium">{t('bookingDetailModal.transportation')}:</span>
              <span>{t('transport.' + booking.transportType)}</span>
            </div>
          )}
          {booking?.ticketClass && (
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-primary" />
              <span className="font-medium">{t('bookingDetailModal.class')}:</span>
              <span>{t('class.' + booking.ticketClass)}</span>
            </div>
          )}
        </div>
        {isAdmin && (booking?.status === 'pending' || booking?.status === 'confirmed') && (
          <div className="flex gap-3 mt-6">
            {booking.status === 'pending' && (
              <Button
                variant="default"
                className="w-full h-11 font-semibold"
                disabled={loading}
                onClick={() => handleUpdateStatus('confirmed')}
              >
                {loading ? 'Đang xác nhận...' : 'Xác nhận'}
              </Button>
            )}
            {booking.status === 'confirmed' && (
              <Button
                variant="default"
                className="w-full h-11 font-semibold"
                disabled={loading}
                onClick={() => handleUpdateStatus('completed')}
              >
                {loading ? 'Đang hoàn thành...' : 'Hoàn thành'}
              </Button>
            )}
          </div>
        )}
        <DialogClose asChild>
          <Button variant="outline" className="mt-4 w-full rounded-lg h-11 text-base font-semibold">{t('bookingDetailModal.close')}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
} 
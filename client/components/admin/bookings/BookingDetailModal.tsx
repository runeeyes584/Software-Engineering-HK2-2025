import { useLanguage } from "@/components/language-provider-fixed";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import { Baby, BadgeCheck, CalendarIcon, Clock, DollarSign, StickyNote, User, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [confirmAction, setConfirmAction] = useState<null | (() => void)>(null);

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
        toast.success(status === 'confirmed' ? 'Xác nhận đặt chỗ thành công!' : 'Đánh dấu hoàn thành tour thành công!');
      } else {
        toast.error('Cập nhật trạng thái thất bại!');
      }
    } catch (e) {
      toast.error('Cập nhật trạng thái thất bại!');
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
          <div className="space-y-2 py-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{t('booking.customer')}:</span>
              <span>{booking.name || '-'}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{t('booking.phone')}:</span>
              <span>{booking.phone || '-'}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">{t('booking.email')}:</span>
              <span>{booking.email || '-'}</span>
            </div>
          </div>
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
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{t('booking.transportType')}:</span>
            <span>{booking.transportType || '-'}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{t('booking.ticketClass')}:</span>
            <span>{booking.ticketClass || '-'}</span>
          </div>
        </div>
        {isAdmin && (booking?.status === 'pending' || booking?.status === 'confirmed') && (
          <div className="flex gap-3 mt-6">
            {booking.status === 'pending' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    className="w-full h-11 font-semibold"
                    disabled={loading}
                    onClick={() => setConfirmAction(() => () => handleUpdateStatus('confirmed'))}
                  >
                    {loading ? 'Đang xác nhận...' : 'Xác nhận'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">Xác nhận đặt tour?</AlertDialogTitle>
                    <DialogDescription className="text-base text-muted-foreground">Bạn có chắc chắn muốn xác nhận đặt tour này không?</DialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { if (confirmAction) confirmAction(); setConfirmAction(null); }}>Xác nhận</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {booking.status === 'confirmed' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    className="w-full h-11 font-semibold"
                    disabled={loading}
                    onClick={() => setConfirmAction(() => () => handleUpdateStatus('completed'))}
                  >
                    {loading ? 'Đang hoàn thành...' : 'Hoàn thành'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold">Hoàn thành đặt tour?</AlertDialogTitle>
                    <DialogDescription className="text-base text-muted-foreground">Bạn có chắc chắn muốn đánh dấu đặt tour này là đã hoàn thành không?</DialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { if (confirmAction) confirmAction(); setConfirmAction(null); }}>Hoàn thành</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
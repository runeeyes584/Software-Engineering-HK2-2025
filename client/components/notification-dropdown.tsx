import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { BellRing, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface INotification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  onNotificationReceived?: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ open, onClose, onNotificationReceived, onUnreadCountChange }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, userId } = useAuth();

  useEffect(() => {
    async function fetchNotifications() {
      if (!open || !userId) return;
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [open, getToken, userId]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.isRead) {
      try {
        const token = await getToken();
        if (!token) return;
        await fetch(`http://localhost:5000/api/notifications/${notification._id}/read`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
        );
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
    // Điều hướng nếu là thông báo xác nhận booking
    if (notification.link) {
      window.location.href = notification.link;
    } else if (
      notification.title?.toLowerCase().includes('đặt tour đã được xác nhận') ||
      notification.message?.toLowerCase().includes('đơn đặt tour')
    ) {
      window.location.href = '/account?tab=bookings';
    }
    onClose();
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  if (!open) return null;

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 w-96 max-w-sm h-[400px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <span className="font-semibold text-lg">Thông báo</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Đang tải...</div>
        ) : notifications.length > 0 ? (
          <ul>
            {notifications.map((noti) => (
              <li
                key={noti._id}
                className={`border-b border-gray-100 ${!noti.isRead ? 'bg-blue-50' : ''} w-full`}
              >
                <Link
                  href={noti.link || '#'}
                  onClick={() => handleNotificationClick(noti)}
                  className="block p-4 hover:bg-gray-50 cursor-pointer w-full"
                >
                  <div className="flex items-start gap-3 w-full overflow-hidden">
                    <div className="mt-1 flex-shrink-0">
                      <BellRing className={`h-5 w-5 ${!noti.isRead ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden break-words whitespace-normal text-left">
                      <p className={`font-semibold text-sm ${!noti.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                        {noti.title}
                      </p>
                      <p className={`text-sm ${!noti.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                        {noti.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(noti.createdAt), { addSuffix: true, locale: vi })}
                      </p>
                    </div>
                    {!noti.isRead && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">Chưa có thông báo</div>
        )}
      </div>
      <div className="border-t px-4 py-2 bg-gray-50 text-center rounded-b-lg">
        <button className="text-blue-600 hover:underline font-medium w-full" onClick={handleMarkAllAsRead}>Đọc tất cả</button>
      </div>
    </div>
  );
};

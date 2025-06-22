"use client";

import { BellRing } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSocket } from './socket-provider';

export function NotificationListener() {
    const { socket } = useSocket();
    const router = useRouter();

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleNewNotification = (notification: any) => {
            console.log('New notification received:', notification);
            
            // Hiển thị toast với nội dung thông báo
            toast.info(notification.message, {
                icon: <BellRing className="h-5 w-5" />,
                description: 'Nhấn để xem chi tiết',
                duration: 10000, // 10 giây
                position: 'top-right',
                action: {
                    label: 'Xem',
                    onClick: () => {
                        if (notification.link) {
                            router.push(notification.link);
                        }
                    },
                },
            });

            // (Tùy chọn) Thêm logic để cập nhật số thông báo chưa đọc ở đây
        };

        // Lắng nghe sự kiện từ server
        socket.on('new_notification', handleNewNotification);

        // Cleanup: gỡ bỏ listener khi component unmount
        return () => {
            socket.off('new_notification', handleNewNotification);
        };
    }, [socket, router]);

    return null; // Component này không render ra bất kỳ UI nào
} 
"use client"

import { useAuth } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface NotificationContextType {
  unreadCount: number;
  fetchNotifications: () => Promise<any[]>;
  resetBadge: () => void;
  refetchUnread: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getToken, userId } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    const token = await getToken();
    if (!token || !userId) return [];
    const res = await fetch("http://localhost:5000/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return [];
  };

  // Fetch unread count
  const refetchUnread = async () => {
    const notis = await fetchNotifications();
    setUnreadCount(notis.filter((n: any) => !n.isRead).length);
  };

  // Reset badge (khi mở dropdown)
  const resetBadge = () => setUnreadCount(0);

  // Socket real-time
  useEffect(() => {
    if (!userId) return;
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join_room", userId);
    const handleNewNotification = () => {
      refetchUnread();
    };
    socketRef.current.on("new_notification", handleNewNotification);
    return () => {
      if (socketRef.current) {
        socketRef.current.off("new_notification", handleNewNotification);
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  // Fetch unread khi mount
  useEffect(() => {
    refetchUnread();
    // eslint-disable-next-line
  }, [userId]);

  return (
    <NotificationContext.Provider value={{ unreadCount, fetchNotifications, resetBadge, refetchUnread }}>
      {children}
    </NotificationContext.Provider>
  );
}; 
"use client";

import { useAuth } from '@clerk/nextjs';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { userId } = useAuth();

    useEffect(() => {
        if (!userId) {
            return;
        }

        // Tạo một instance socket mới, trỏ đến server backend của bạn
        const newSocket = io('http://localhost:5000');

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
            setIsConnected(true);
            // Gửi userId lên server để tham gia vào phòng riêng
            newSocket.emit('join_room', userId);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        setSocket(newSocket);

        // Cleanup function để ngắt kết nối khi component unmount hoặc userId thay đổi
        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}; 
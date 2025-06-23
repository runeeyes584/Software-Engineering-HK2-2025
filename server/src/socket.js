const { Server } = require("socket.io");

let io;

function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    // Quản lý người dùng đang online
    let onlineUsers = [];

    const addUser = (userId, socketId) => {
        !onlineUsers.some((user) => user.userId === userId) &&
            onlineUsers.push({ userId, socketId });
    };

    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };

    io.on("connection", (socket) => {
        console.log(`A user connected: ${socket.id}`);

        socket.on("join_room", (userId) => {
            if (userId) {
                socket.join(userId);
                addUser(userId, socket.id);
                console.log(`User ${userId} with socket ${socket.id} joined room ${userId}`);
            }
        });

        socket.on("disconnect", () => {
            console.log(`A user disconnected: ${socket.id}`);
            removeUser(socket.id);
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

module.exports = {
    initSocket,
    getIO,
}; 
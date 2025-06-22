require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require("socket.io");

// Import routes
const tourRoutes = require('./routes/tour.route.js');
const bookingRoutes = require('./routes/booking.route.js');
const paymentRoutes = require('./routes/payment.route.js');
const userRoutes = require('./routes/user.route.js');
const cloudinaryRoutes = require('./routes/cloudinary.route.js');
const saveTourRoutes = require('./routes/save-tour.route.js');
const reviewRoutes = require('./routes/review.route.js');
const chatbotRoutes = require('./routes/chatbot.routes.js');
const categoryRoutes = require('./routes/category.route.js');
const notificationRoutes = require('./routes/notification.route.js');

// Import auth middleware
const requireAuth = require('./middleware/clerk');

// Khởi tạo Express app
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
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

    // Lắng nghe sự kiện join_room từ client
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

// Kết nối đến Database
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Middleware quan trọng để parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/saved-tours', saveTourRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);

// Route mặc định
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Travel Booking API' });
});

// Route bảo vệ mẫu
app.get('/api/protected', requireAuth, (req, res) => {
    res.json({ message: 'Bạn đã xác thực thành công!', userId: req.auth.userId });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
    res.status(statusCode).json({ message });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export io để các modules khác có thể sử dụng
module.exports.io = io;
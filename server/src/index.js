require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


// Import routes
const tourRoutes = require('./routes/tour.route.js');
const bookingRoutes = require('./routes/booking.route.js');
const paymentRoutes = require('./routes/payment.route.js');
const userRoutes = require('./routes/user.route.js');
const cloudinaryRoutes = require('./routes/cloudinary.route.js');
const saveTourRoutes = require('./routes/save-tour.route.js');
const reviewRoutes = require('./routes/review.route.js');
const chatbotRoutes = require('./routes/chatbot.routes.js');

// Import auth middleware
const requireAuth = require('./middleware/clerk');

// Khởi tạo Express app
const app = express();

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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { Clerk } = require('@clerk/clerk-sdk-node');
const tourRoutes = require('./routes/tour.route.js');
const bookingRoutes = require('./routes/booking.route.js');
const paymentRoutes = require('./routes/payment.route.js');
const userRoutes = require('./routes/user.route.js');
const cloudinaryRoutes = require('./routes/cloudinary.route.js');
const saveTourRoutes = require('./routes/save-tour.route.js');
const reviewRoutes = require('./routes/review.route.js');

Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const authRoutes = require('./routes/auth');
const requireAuth = require('./middleware/clerk');

const app = express();

// Middleware
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'travelbooking',
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB:', err));

app.use('/api/users', userRoutes);

app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/saved-tours', saveTourRoutes);
app.use('/api/reviews', reviewRoutes);

// Route bảo vệ bằng Clerk
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ message: 'Bạn đã xác thực thành công với Clerk!', userId: req.auth.userId });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
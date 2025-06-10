const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { Clerk } = require('@clerk/clerk-sdk-node');

Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const authRoutes = require('./routes/auth');
const requireAuth = require('./middleware/clerk');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);

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
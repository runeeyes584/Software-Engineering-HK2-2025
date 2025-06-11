const express = require('express');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking
} = require('../controllers/booking.controller.js');
const requireAuth = require('../middleware/clerk.js');
const isAdmin = require('../middleware/isAdmin.js');

const router = express.Router();

// Lấy danh sách tất cả booking
router.get('/', requireAuth, getAllBookings);

// Lấy booking theo ID
router.get('/:id', requireAuth, getBookingById);

// Tạo booking mới
router.post('/', requireAuth, createBooking);

// Cập nhật booking theo ID
router.put('/:id', requireAuth, updateBooking);

module.exports = router;

const express = require('express');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking
} = require('../controllers/booking.controller.js');

const router = express.Router();

// Lấy danh sách tất cả booking
router.get('/', getAllBookings);

// Lấy booking theo ID
router.get('/:id', getBookingById);

// Tạo booking mới
router.post('/', createBooking);

// Cập nhật booking theo ID
router.put('/:id', updateBooking);

module.exports = router;

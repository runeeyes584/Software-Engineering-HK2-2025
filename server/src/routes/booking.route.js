const express = require('express');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  getCompletedBookingByUserAndTour
} = require('../controllers/booking.controller.js');
const requireAuth = require('../middleware/clerk.js');
const isAdmin = require('../middleware/isAdmin.js');
const findOrCreateUser = require('../middleware/findOrCreateUser');

const router = express.Router();

// Lấy danh sách tất cả booking
router.get('/', requireAuth, getAllBookings);

// Lấy booking theo ID
router.get('/:id', requireAuth, getBookingById);

// Tạo booking mới
router.post('/', requireAuth, findOrCreateUser, createBooking);

// Cập nhật booking theo ID
router.put('/:id', requireAuth, updateBooking);

// Lấy booking completed của user cho 1 tour
router.get('/completed/:tourId', requireAuth, getCompletedBookingByUserAndTour);

module.exports = router;

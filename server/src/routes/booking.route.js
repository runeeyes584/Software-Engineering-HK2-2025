const express = require('express');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  getCompletedBookingByUserAndTour,
  getBookingsByClerkId
} = require('../controllers/booking.controller.js');
const requireAuth = require('../middleware/clerk.js');
const isAdmin = require('../middleware/isAdmin.js');
const findOrCreateUser = require('../middleware/findOrCreateUser');

const router = express.Router();

router.use(express.json());

// Lấy danh sách tất cả booking
router.get('/', requireAuth, getAllBookings);

// Lấy booking theo ID
router.get('/:id', requireAuth, getBookingById);

// Tạo booking mới
router.post('/', requireAuth, findOrCreateUser, createBooking);

// Cập nhật booking theo ID
router.put('/:id', requireAuth, findOrCreateUser, updateBooking);

// Lấy booking completed của user cho 1 tour
router.get('/completed/:tourId', requireAuth, findOrCreateUser, getCompletedBookingByUserAndTour);

// Lấy booking theo Clerk ID của user (chỉ cho admin hoặc chính user đó)
router.get('/user/clerk/:clerkId', requireAuth, findOrCreateUser, getBookingsByClerkId);

module.exports = router;

const express = require('express');
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
} = require('../controllers/tour.controller.js');
const requireAuth = require('../middleware/clerk.js');
const isAdmin = require('../middleware/isAdmin.js');

const router = express.Router();

// Lấy danh sách tất cả tour
router.get('/', getAllTours);

// Lấy tour theo ID
router.get('/:id', getTourById);

// Tạo tour mới
router.post('/', requireAuth, isAdmin, createTour);

// Cập nhật tour theo ID
router.put('/:id', requireAuth, isAdmin, updateTour);

// Xóa tour theo ID
router.delete('/:id', requireAuth, isAdmin, deleteTour);

module.exports = router;

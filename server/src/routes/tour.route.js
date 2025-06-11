const express = require('express');
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
} = require('../controllers/tour.controller.js');

const router = express.Router();

// Lấy danh sách tất cả tour
router.get('/', getAllTours);

// Lấy tour theo ID
router.get('/:id', getTourById);

// Tạo tour mới
router.post('/', createTour);

// Cập nhật tour theo ID
router.put('/:id', updateTour);

// Xóa tour theo ID
router.delete('/:id', deleteTour);

module.exports = router;

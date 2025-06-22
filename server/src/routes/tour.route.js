const express = require('express');
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  updateTourStatus
} = require('../controllers/tour.controller.js');
const requireAuth = require('../middleware/clerk.js');
const isAdmin = require('../middleware/isAdmin.js');
const findOrCreateUser = require('../middleware/findOrCreateUser.js');

const router = express.Router();

router.use(express.json());

// Lấy danh sách tất cả tour
router.get('/', getAllTours);

// Lấy tour theo ID
router.get('/:id', getTourById);

// Tạo tour mới (Cần quyền Admin)
router.post('/', requireAuth, findOrCreateUser, isAdmin, createTour);

// Cập nhật trạng thái tour
router.put('/status/:id', updateTourStatus);

// Cập nhật tour
router.put('/:id', requireAuth, findOrCreateUser, isAdmin, updateTour);

// Xóa tour theo ID (Cần quyền Admin)
router.delete('/:id', requireAuth, findOrCreateUser, isAdmin, deleteTour);

module.exports = router;

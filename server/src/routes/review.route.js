const express = require('express');
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/review.controller');
const requireAuth = require('../middleware/clerk.js');

const router = express.Router();

// Lấy danh sách review
router.get('/', getReviews);         

// Tạo review mới
router.post('/', requireAuth, createReview);      

// Cập nhật review
router.put('/:id', requireAuth, updateReview);    

// Xoá review
router.delete('/:id', requireAuth, deleteReview); 

module.exports = router;

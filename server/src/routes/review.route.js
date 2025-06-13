const express = require('express');
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/review.controller');
const requireAuth = require('../middleware/clerk.js');
const findOrCreateUser = require('../middleware/findOrCreateUser');

const router = express.Router();

// Lấy danh sách review
router.get('/', getReviews);         

// Tạo review mới
router.post('/', requireAuth, findOrCreateUser, createReview);      

// Cập nhật review
router.put('/:id', requireAuth, updateReview);    

// Xoá review
router.delete('/:id', requireAuth, deleteReview); 

module.exports = router;

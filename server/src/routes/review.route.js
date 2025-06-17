const express = require('express');
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
  adminReplyToReview
} = require('../controllers/review.controller');
const requireAuth = require('../middleware/clerk.js');
const findOrCreateUser = require('../middleware/findOrCreateUser');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.use(express.json());

// Lấy danh sách review
router.get('/', getReviews);         

// Tạo review mới
router.post('/', requireAuth, findOrCreateUser, createReview);      

// Cập nhật review
router.put('/:id', requireAuth, updateReview);    

// Xoá review
router.delete('/:id', requireAuth, deleteReview); 

// Like review
router.post('/:id/like', requireAuth, likeReview);
// Unlike review
router.post('/:id/unlike', requireAuth, unlikeReview);

// Admin reply to review
router.post('/:id/admin-reply', requireAuth, findOrCreateUser, isAdmin, adminReplyToReview);

module.exports = router;

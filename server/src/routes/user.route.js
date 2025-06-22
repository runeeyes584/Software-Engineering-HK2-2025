const express = require('express');
const { handleClerkWebhook, getAllUsers, updateUserProfile, getUserProfile, updateUserAvatar } = require('../controllers/user.controller.js');
const requireAuth = require('../middleware/clerk.js');
const findOrCreateUser = require('../middleware/findOrCreateUser.js');

const router = express.Router();

// Webhook từ Clerk (xác thực + lưu user)
router.post('/', express.raw({ type: 'application/json' }), handleClerkWebhook);

// Lấy danh sách tất cả user
router.get('/', getAllUsers);

// Lấy thông tin profile của user hiện tại
router.get('/profile', requireAuth, findOrCreateUser, getUserProfile);

// Cập nhật thông tin profile của user (phone, address)
router.patch('/profile', express.json(), requireAuth, findOrCreateUser, updateUserProfile);

// Cập nhật avatar của user
router.put('/update-avatar', express.json(), requireAuth, findOrCreateUser, updateUserAvatar);

module.exports = router;

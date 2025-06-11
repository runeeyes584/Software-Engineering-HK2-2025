const express = require('express');
const { handleClerkWebhook, getAllUsers } = require('../controllers/user.controller.js');

const router = express.Router();

// Webhook từ Clerk (xác thực + lưu user)
router.post('/', express.raw({ type: 'application/json' }), handleClerkWebhook);

// Lấy danh sách tất cả user
router.get('/', getAllUsers);

module.exports = router;

const express = require('express');
const { createVNPayUrl, handleVNPayReturn } = require('../controllers/payment.controller.js');
const requireAuth = require('../middleware/clerk.js');

const router = express.Router();

router.use(express.json());

// Tạo QR thanh toán VNPay cho đơn đặt tour (booking)
router.post('/create-qr', requireAuth, createVNPayUrl);

// Xử lý callback VNPay trả về
router.get('/check-payment-vnpay', handleVNPayReturn);

module.exports = router;

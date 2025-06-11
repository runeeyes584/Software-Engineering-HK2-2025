const express = require('express');
const { createVNPayUrl, handleVNPayReturn } = require('../controllers/payment.controller.js');

const router = express.Router();

// Tạo QR thanh toán VNPay cho đơn đặt tour (booking)
router.post('/create-qr', createVNPayUrl);

// Xử lý callback VNPay trả về
router.get('/check-payment-vnpay', handleVNPayReturn);

module.exports = router;

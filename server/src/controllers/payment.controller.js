const { ProductCode, VNPay, VnpLocale, dateFormat, ignoreLogger } = require('vnpay');
const Booking = require('../models/Booking.js');
const Payment = require('../models/Payment.js');
const { createNotification } = require('./notification.controller.js');

const vnpay = new VNPay({
  tmnCode: 'JEOP71C7',
  secureSecret: 'F48MKHH4U2ZRMTE5AZ47XHEO1UKRXHE5',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: 'SHA512',
  loggerFn: ignoreLogger
});

// Tạo link thanh toán VNPay từ bookingId
const createVNPayUrl = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('user');
    if (!booking) return res.status(404).send("Không tìm thấy đơn đặt tour");
    if (!booking.totalPrice || isNaN(booking.totalPrice)) {
      return res.status(400).send("Tổng giá trị không hợp lệ");
    }

    const usdToVndRate = 250;
    const amount = Math.round(booking.totalPrice * usdToVndRate);
    const now = new Date();
    const expire = new Date(now.getTime() + 15 * 60 * 1000);

    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: amount * 100,
      vnp_IpAddr: req.ip || '127.0.0.1',
      vnp_TxnRef: bookingId.toString(),
      vnp_OrderInfo: `Thanh toán tour #${bookingId}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.VNP_RETURN_URL || 'http://localhost:5000/api/payments/check-payment-vnpay',
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(now),
      vnp_ExpireDate: dateFormat(expire)
    });

    return res.status(201).json(vnpayResponse);
  } catch (error) {
    return res.status(500).send("Không tạo được QR thanh toán");
  }
};

// Xử lý kết quả trả về từ VNPay
const handleVNPayReturn = async (req, res) => {
  try {
    const result = await vnpay.verifyReturnUrl(req.query);
    const bookingId = req.query.vnp_TxnRef;

    if (!bookingId) return res.status(400).send("Thiếu mã booking");
    const booking = await Booking.findById(bookingId).populate('user');
    if (!booking) return res.status(404).send("Không tìm thấy đơn đặt tour");

    let status;
    if (result.isSuccess && req.query.vnp_ResponseCode === "00") {
      status = "success";
    } else if (!result.isVerified || req.query.vnp_ResponseCode !== "00") {
      status = "failed";
    } else {
      status = "pending";
    }

    // Tạo payment record
    const payment = await Payment.create({
      user: booking.user._id,
      booking: booking._id,
      amount: Number(req.query.vnp_Amount) / 100,
      method: req.query.vnp_BankCode || "vnpay",
      status,
      transactionId: req.query.vnp_TransactionNo,
      paidAt: new Date()
    });

    // Cập nhật booking với payment reference
    await Booking.findByIdAndUpdate(bookingId, { payment: payment._id });

    // Nếu payment failed, cập nhật booking status thành cancelled
    if (status === 'failed') {
      await Booking.findByIdAndUpdate(bookingId, { status: 'cancelled' });
      
      // Gửi thông báo cho user về việc payment failed và booking bị cancelled
      try {
        if (booking.user && booking.user.clerkId) {
          const title = "Thanh toán thất bại";
          const message = "Thanh toán của bạn đã thất bại. Đơn đặt tour đã được hủy tự động.";
          const link = `/account?tab=bookings`;
          await createNotification(booking.user.clerkId, title, message, link);
        }
      } catch (notificationError) {
        console.error("Failed to send payment failure notification:", notificationError);
      }
    }

    // Nếu payment success, gửi thông báo cho user
    if (status === 'success') {
      try {
        if (booking.user && booking.user.clerkId) {
          const title = "Thanh toán thành công";
          const message = "Thanh toán của bạn đã thành công! Đơn đặt tour đang chờ xác nhận.";
          const link = `/account?tab=bookings`;
          await createNotification(booking.user.clerkId, title, message, link);
        }
      } catch (notificationError) {
        console.error("Failed to send payment success notification:", notificationError);
      }
    }

    if (status === 'success') {
      return res.redirect('http://localhost:3000/checkout/success');
    } else {
      return res.redirect('http://localhost:3000/checkout/failure');
    }
  } catch (error) {
    return res.status(500).send("Lỗi callback VNPay");
  }
};

module.exports = {
  createVNPayUrl,
  handleVNPayReturn
};

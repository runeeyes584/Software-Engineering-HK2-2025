const Booking = require('../models/Booking.js');
const Promotion = require('../models/Promotion.js');
const Review = require('../models/Review.js');
const Payment = require('../models/Payment.js');
const User = require('../models/User.js');
const Tour = require('../models/Tour.js');
const { createNotification } = require('./notification.controller.js');

// Lấy tất cả booking
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('user', 'firstname lastname username email')
      .populate('tour', 'name price departureOptions')
      .populate('promotion')
      .populate('review')
      .populate('payment');
    // Đảm bảo duration, departureDate, returnDate có trong tour hoặc booking
    const bookingsWithDetails = bookings.map(b => {
      let tour = b.tour && typeof b.tour.toObject === 'function' ? b.tour.toObject() : b.tour;
      // Duration
      if (tour && !tour.duration) {
        if (tour.departureOptions && tour.departureOptions.length > 0) {
          const { departureDate, returnDate } = tour.departureOptions[0];
          if (departureDate && returnDate) {
            const start = new Date(departureDate);
            const end = new Date(returnDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            tour.duration = diffDays;
          }
        }
      }
      // Departure/Return date ưu tiên lấy từ booking, fallback sang tour
      let departureDate = b.departureDate || (tour?.departureOptions?.[0]?.departureDate ?? null);
      let returnDate = b.returnDate || (tour?.departureOptions?.[0]?.returnDate ?? null);
      return {
        ...b.toObject(),
        tour,
        departureDate,
        returnDate,
      };
    });
    res.status(200).json(bookingsWithDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy booking theo ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'firstname lastname username email')
      .populate('tour', 'name price')
      .populate('promotion')
      .populate('review')
      .populate('payment');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo booking mới
const createBooking = async (req, res) => {
  try {
    // Nhận các trường cần thiết từ FE (không nhận user)
    const {
      tour, totalPrice, note,
      departureDate, returnDate, transportType, ticketClass, adults, children, infants,
      name, phone, email
    } = req.body;

    // Lấy user MongoDB từ middleware
    const user = req.dbUser._id;

    const newBooking = new Booking({
      tour,
      user,
      totalPrice,
      note,
      name,
      phone,
      email,
      departureDate,
      returnDate,
      transportType,
      ticketClass,
      adults,
      children,
      infants,
    });
    const savedBooking = await newBooking.save();

    // --- BẮT ĐẦU TÍCH HỢP THÔNG BÁO ---
    try {
      const admins = await User.find({ role: 'admin' });
      const bookingUser = req.dbUser;
      const bookedTour = await Tour.findById(tour);

      if (admins.length > 0 && bookingUser && bookedTour) {
        const message = `${bookingUser.username || 'Một khách hàng'} vừa đặt tour "${bookedTour.name}".`;
        const link = `/admin/bookings`; // Link tới trang quản lý booking

        for (const admin of admins) {
          // Gửi thông báo tới từng admin
          await createNotification(admin._id.toString(), message, link);
        }
      }
    } catch (notificationError) {
      console.error("Failed to send booking notification to admins:", notificationError);
      // Không block response chính nếu gửi noti lỗi
    }
    // --- KẾT THÚC TÍCH HỢP THÔNG BÁO ---

    // Trả về link thanh toán giả lập
    res.status(201).json({ booking: savedBooking, paymentUrl: `/payment/${savedBooking._id}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật booking theo ID
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Lấy status từ body

    const bookingToUpdate = await Booking.findById(id);

    if (!bookingToUpdate) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // --- LOGIC MỚI: CẬP NHẬT AVAILABLE SLOTS ---
    const isMovingToReserved = (status === 'confirmed' || status === 'completed');
    const wasAlreadyReserved = (bookingToUpdate.status === 'confirmed' || bookingToUpdate.status === 'completed');

    // Chỉ trừ slot khi chuyển từ trạng thái chưa đặt chỗ (pending, cancelled) 
    // sang đã đặt chỗ (confirmed, completed) để tránh trừ lặp.
    if (status && isMovingToReserved && !wasAlreadyReserved) {
      const tour = await Tour.findById(bookingToUpdate.tour);
      if (tour) {
        if (tour.availableSlots > 0) {
          tour.availableSlots -= 1;
          await tour.save();
        } else {
          // Nếu không còn slot, không cho confirm/complete
          return res.status(400).json({ message: 'Không còn chỗ trống cho tour này.' });
        }
      }
    }
    // --- KẾT THÚC LOGIC MỚI ---

    // Lấy thông tin cần thiết TRƯỚC KHI cập nhật
    const userIdForNotification = bookingToUpdate.user;
    const tourIdForNotification = bookingToUpdate.tour;

    // Cập nhật booking như bình thường
    const updateFields = { ...req.body };
    // Chỉ cho phép cập nhật transportType và ticketClass nếu có trong body
    if (typeof req.body.transportType !== 'undefined') updateFields.transportType = req.body.transportType;
    if (typeof req.body.ticketClass !== 'undefined') updateFields.ticketClass = req.body.ticketClass;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    ).populate('user', 'username email').populate('tour', 'name price');

    // Sau khi cập nhật thành công, gửi thông báo
    if (status === 'confirmed' && updatedBooking) {
      try {
        // Lấy lại thông tin tour để có tên
        const tour = await Tour.findById(tourIdForNotification);
        // Lấy user để lấy clerkId
        const user = await User.findById(userIdForNotification);
        if (tour && user) {
          const title = "Đặt tour đã được xác nhận";
          const message = `Đơn đặt tour "${tour.name}" của bạn đã được xác nhận.`;
          const link = `/account`; // Link tới trang quản lý booking của người dùng
          await createNotification(user.clerkId, title, message, link);
        }
      } catch (notificationError) {
        console.error("Failed to send confirmation notification:", notificationError);
      }
    }
    // --- KẾT THÚC TÍCH HỢP THÔNG BÁO ---

    res.status(200).json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Lấy booking completed của user cho 1 tour
const getCompletedBookingByUserAndTour = async (req, res) => {
  try {
    const userId = req.dbUser?._id || req.user?._id || req.userId || req.user?.id;
    const tourId = req.params.tourId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const booking = await Booking.findOne({
      user: userId,
      tour: tourId,
      status: { $in: ['completed', 'complete'] },
    });
    if (!booking) return res.status(404).json({ message: 'No completed booking found' });
    res.status(200).json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả booking theo clerkId (chỉ cho admin hoặc chính user đó)
const getBookingsByClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params;

    // Phân quyền: chỉ admin hoặc chính user đó mới có quyền truy cập
    const isCurrentUserAdmin = req.dbUser?.role === 'admin';
    const isRequestingSelf = req.dbUser?.clerkId === clerkId;

    if (!isCurrentUserAdmin && !isRequestingSelf) {
      return res.status(403).json({ message: 'Forbidden: You can only access your own bookings.' });
    }

    // Tìm user trong DB bằng clerkId để lấy _id
    const targetUser = await User.findOne({ clerkId: clerkId });
    if (!targetUser) {
      // Nếu user không tồn tại trong DB, không thể có booking nào
      return res.status(200).json([]);
    }

    // Lấy tất cả booking của user đó bằng _id
    const bookings = await Booking.find({ user: targetUser._id })
      .sort({ createdAt: -1 })
      .populate('user', 'username email')
      .populate('tour', 'name price departureOptions')
      .populate('promotion')
      .populate('review')
      .populate('payment');

    // Đảm bảo duration, departureDate, returnDate có trong tour hoặc booking (giống getAllBookings)
    const bookingsWithDetails = bookings.map(b => {
      let tour = b.tour && typeof b.tour.toObject === 'function' ? b.tour.toObject() : b.tour;
      // Duration
      if (tour && !tour.duration) {
        if (tour.departureOptions && tour.departureOptions.length > 0) {
          const { departureDate, returnDate } = tour.departureOptions[0];
          if (departureDate && returnDate) {
            const start = new Date(departureDate);
            const end = new Date(returnDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            tour.duration = diffDays;
          }
        }
      }
      // Departure/Return date ưu tiên lấy từ booking, fallback sang tour
      let departureDate = b.departureDate || (tour?.departureOptions?.[0]?.departureDate ?? null);
      let returnDate = b.returnDate || (tour?.departureOptions?.[0]?.returnDate ?? null);
      
      return {
        ...b.toObject(),
        tour,
        departureDate,
        returnDate,
      };
    });
    res.status(200).json(bookingsWithDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  getCompletedBookingByUserAndTour,
  getBookingsByClerkId,
};

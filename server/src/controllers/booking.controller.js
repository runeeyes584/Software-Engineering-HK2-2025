const Booking = require('../models/Booking.js');
const Promotion = require('../models/Promotion.js');
const Review = require('../models/Review.js');
const Payment = require('../models/Payment.js');

// Lấy tất cả booking
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'username email')
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
      .populate('user', 'username email')
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
      tour, guests, totalPrice, note,
      departureDate, returnDate, transportType, ticketClass, adults, children, infants
    } = req.body;

    // Lấy user MongoDB từ middleware
    const user = req.dbUser._id;

    const newBooking = new Booking({
      tour,
      user,
      guests,
      totalPrice,
      note,
      departureDate,
      returnDate,
      transportType,
      ticketClass,
      adults,
      children,
      infants,
    });
    const savedBooking = await newBooking.save();
    // Trả về link thanh toán giả lập
    res.status(201).json({ booking: savedBooking, paymentUrl: `/payment/${savedBooking._id}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật booking theo ID
const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

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

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  getCompletedBookingByUserAndTour,
};

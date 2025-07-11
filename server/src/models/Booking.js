const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  adults: { type: Number, required: true },
  children: { type: Number, required: true },
  infants: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' },
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  bookingDate: { type: Date, default: Date.now },
  note: { type: String },
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  transportType: { type: String },
  ticketClass: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema); 
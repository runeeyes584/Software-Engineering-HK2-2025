const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }], // URL ảnh Cloudinary
  videos: [{ type: String }], // URL video Cloudinary
  price: { type: Number, required: true },
  type: { type: String, required: true }, // Loại tour
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxGuests: { type: Number, required: true },
  availableSlots: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin tạo
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema); 
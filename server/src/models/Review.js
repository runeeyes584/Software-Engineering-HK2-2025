const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  adminReply: { type: String },
  likes: [{ type: String }],
  images: [{ type: String }],
  videos: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema); 
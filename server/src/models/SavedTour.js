const mongoose = require('mongoose');

const savedTourSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  savedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SavedTour', savedTourSchema); 
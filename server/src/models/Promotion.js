const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String },
  discountPercent: { type: Number, min: 0, max: 100 },
  discountAmount: { type: Number },
  maxUsage: { type: Number },
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date },
  validTo: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema); 
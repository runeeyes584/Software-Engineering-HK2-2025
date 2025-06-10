const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    target: { type: String }, // Đối tượng bị tác động (vd: tourId, userId...)
    detail: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AdminLog', adminLogSchema); 
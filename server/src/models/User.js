const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    unique: true,
    required: true
  },
  avatar: {
    type: String
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstname: {
    type: String,
    trim: true
  },
  lastname: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    province: { type: String, trim: true, default: '' },
    district: { type: String, trim: true, default: '' },
    ward: { type: String, trim: true, default: '' },
    detailedAddress: { type: String, trim: true, default: '' },
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', ''],
    default: ''
  },
  dateOfBirth: {
    day: { type: String, trim: true, default: '' },
    month: { type: String, trim: true, default: '' },
    year: { type: String, trim: true, default: '' },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 
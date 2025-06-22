const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // URL ảnh từ Cloudinary
      },
    ],
    videos: [
      {
        type: String, // URL video từ Cloudinary
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureOptions: [
      {
        departureDate: { type: Date, required: true },
        returnDate: { type: Date, required: true },
    },
    ],
    maxGuests: {
      type: Number,
      required: true,
    },
    availableSlots: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    }],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

tourSchema.virtual('duration').get(function () {
  if (!this.departureOptions || this.departureOptions.length === 0) return 0
  const { departureDate, returnDate } = this.departureOptions[0]
  if (!departureDate || !returnDate) return 0
  const start = new Date(departureDate)
  const end = new Date(returnDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
})

module.exports = mongoose.model('Tour', tourSchema)

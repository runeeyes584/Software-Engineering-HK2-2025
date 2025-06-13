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
    type: {
      type: String,
      required: true, 
    },
    destination: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

tourSchema.virtual('duration').get(function () {
  if (!this.startDate || !this.endDate) return 0
  const start = new Date(this.startDate)
  const end = new Date(this.endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
})

module.exports = mongoose.model('Tour', tourSchema)

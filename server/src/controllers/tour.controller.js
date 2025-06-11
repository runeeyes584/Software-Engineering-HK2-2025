const Tour = require('../models/Tour.js');
const Review = require('../models/Review.js');

// Lấy danh sách tất cả tour
const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    // Lấy rating trung bình cho từng tour
    const toursWithRating = await Promise.all(
      tours.map(async (tour) => {
        const reviews = await Review.find({ tour: tour._id });
        let averageRating = 0;
        if (reviews.length > 0) {
          averageRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
        }
        return {
          ...tour.toObject(),
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: reviews.length,
        };
      })
    );
    res.status(200).json(toursWithRating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tour theo ID
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.status(200).json(tour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo tour mới
const createTour = async (req, res) => {
  try {
    const {
      name, description, price, type, destination,
      startDate, endDate, maxGuests, availableSlots,
      createdBy, images, videos
    } = req.body;

    const newTour = new Tour({
      name,
      description,
      price,
      type,
      destination,
      startDate,
      endDate,
      maxGuests,
      availableSlots,
      createdBy,
      images: images || [],
      videos: videos || []
    });

    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật tour theo ID
const updateTour = async (req, res) => {
  try {
    const {
      name, description, price, type, destination,
      startDate, endDate, maxGuests, availableSlots,
      isActive, images, videos
    } = req.body;

    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        type,
        destination,
        startDate,
        endDate,
        maxGuests,
        availableSlots,
        isActive,
        images: images || [],
        videos: videos || []
      },
      { new: true }
    );

    if (!updatedTour) return res.status(404).json({ message: 'Tour not found' });
    res.status(200).json(updatedTour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa tour theo ID
const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) return res.status(404).json({ message: 'Tour not found' });
    res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
};

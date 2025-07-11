const Tour = require('../models/Tour.js');
const Review = require('../models/Review.js');
const Booking = require('../models/Booking');

// Lấy danh sách tất cả tour
const getAllTours = async (req, res) => {
  try {
    // Lấy tất cả tour
    const tours = await Tour.find().populate('category', 'name');

    // Lấy số lượng booking và review cho từng tour
    const reviewCount = await Review.countDocuments({ tour: { $in: tours.map(tour => tour._id) } });
    const bookingCount = await Booking.countDocuments({ tour: { $in: tours.map(tour => tour._id) } });

    // Duyệt từng tour và đếm booking/review
    const toursWithCounts = await Promise.all(
      tours.map(async (tour) => {
        const bookingCount = await Booking.countDocuments({ tour: tour._id });
        const reviewCount = await Review.countDocuments({ tour: tour._id });
        // Tính rating trung bình
        const reviews = await Review.find({ tour: tour._id });
        let rating = 0;
        if (reviews.length > 0) {
          rating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
        }
        return {
          ...tour.toObject(),
          bookingCount,
          reviewCount,
          rating: Math.round(rating * 10) / 10,
        };
      })
    );

    res.status(200).json(toursWithCounts);

    /*
    // Lấy rating trung bình cho từng tour - Sẽ được kích hoạt lại sau
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
    */
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tour theo ID
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('category', 'name');

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
      name, description, price, destination,
      maxGuests, availableSlots, images, videos,
      departureOptions, category, status
    } = req.body;
    
    // Lấy ID người dùng từ middleware đã xác thực
    const createdBy = req.dbUser?._id;
    if (!createdBy) {
      return res.status(401).json({ message: 'Không thể xác định người tạo tour. Vui lòng đăng nhập lại.' });
    }

    const newTour = new Tour({
      name,
      description,
      price,
      destination,
      maxGuests,
      availableSlots,
      createdBy, // Gán ID người dùng đã xác thực
      images: images || [],
      videos: videos || [],
      departureOptions: departureOptions || [],
      category,
      status: status || 'active',
    });

    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (err) {
    console.error("Lỗi khi tạo tour mới:", err);
    res.status(500).json({ message: 'Lỗi server khi tạo tour: ' + err.message });
  }
};

// Cập nhật trạng thái tour
const updateTourStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
        }

        const updatedTour = await Tour.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedTour) {
            return res.status(404).json({ message: 'Không tìm thấy tour.' });
        }

        res.status(200).json(updatedTour);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server: ' + error.message });
    }
};

// Sửa lại hàm updateTour để không xử lý status nữa
const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        // Lấy tất cả dữ liệu từ body mà không chỉ định từng trường
        // Điều này linh hoạt hơn khi form thay đổi
        const updateData = req.body;

        // Xóa trường _id và các trường không thể thay đổi khác nếu có
        delete updateData._id;
        
        // Không cho phép cập nhật status qua endpoint này để đảm bảo logic
        // Nếu muốn, có thể dùng một endpoint riêng như updateTourStatus
        delete updateData.status; 
        
        const updatedTour = await Tour.findByIdAndUpdate(
            id,
            updateData, // Truyền cả object dữ liệu cập nhật
            { new: true } // Trả về document đã được cập nhật
        );

        if (!updatedTour) {
            return res.status(404).json({ message: 'Không tìm thấy tour.' });
        }
        res.status(200).json(updatedTour);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi: ' + error.message });
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
  updateTourStatus,
  deleteTour
};

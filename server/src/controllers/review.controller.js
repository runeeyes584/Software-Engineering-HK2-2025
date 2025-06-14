const Booking = require('../models/Booking');
const Review = require('../models/Review');

// Lấy danh sách tất cả review (có thể lọc theo tour hoặc user)
const getReviews = async (req, res) => {
  try {
    const query = {};
    if (req.query.tour) query.tour = req.query.tour;
    if (req.query.user) query.user = req.query.user;

    const reviews = await Review.find(query)
      .populate('user', 'clerkId username firstname lastname avatar _id')
      .populate('tour', 'name');

    res.json(reviews);
  } catch (err) {
    console.error('Lỗi getReviews:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách review' });
  }
};

// Tạo review mới cho một tour
const createReview = async (req, res) => {
  try {
    const userId = req.dbUser?._id || req.user?._id || req.userId || req.user?.id;
    const { tourId, bookingId, rating, comment, images = [], videos = [] } = req.body;
    if (!userId || !tourId || !bookingId || !rating) {
      return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
    }

    // Kiểm tra booking hợp lệ
    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
      tour: tourId,
      status: 'completed',
    });
    if (!booking) return res.status(400).json({ message: 'Invalid booking' });

    // Kiểm tra đã review chưa (nếu muốn)
    const existed = await Review.findOne({ user: userId, tour: tourId });
    if (existed) return res.status(400).json({ message: 'Already reviewed' });

    // Tạo review
    const review = await Review.create({ user: userId, tour: tourId, rating, comment, images, videos });

    // Gắn review vào booking (nếu muốn)
    booking.review = review._id;
    await booking.save();

    res.status(201).json(review);
  } catch (err) {
    console.error('Lỗi createReview:', err);
    res.status(500).json({ message: 'Lỗi khi tạo review' });
  }
};

// Cập nhật nội dung review theo ID
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, adminReply, images = [], videos = [] } = req.body;

    const updated = await Review.findByIdAndUpdate(
      id,
      { rating, comment, adminReply, images, videos },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Review không tồn tại' });
    res.json(updated);
  } catch (err) {
    console.error('Lỗi updateReview:', err);
    res.status(500).json({ message: 'Lỗi khi cập nhật review' });
  }
};

// Xoá review theo ID
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Review không tồn tại' });

    res.json({ message: 'Xoá review thành công' });
  } catch (err) {
    console.error('Lỗi deleteReview:', err);
    res.status(500).json({ message: 'Lỗi khi xoá review' });
  }
};

// Like review
const likeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userClerkId = req.auth?.userId;
    if (!userClerkId) return res.status(401).json({ message: 'Chưa đăng nhập' });
    
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review không tồn tại' });
    
    if (!review.likes) review.likes = [];
    if (!review.likes.includes(userClerkId)) {
      review.likes.push(userClerkId);
      await review.save();
    }
    
    // Trả về review đầy đủ để FE cập nhật UI
    const updatedReview = await Review.findById(id)
      .populate('user', 'clerkId username firstname lastname avatar _id')
      .populate('tour', 'name');
    
    res.json(updatedReview);
  } catch (err) {
    console.error('Lỗi likeReview:', err);
    res.status(500).json({ message: 'Lỗi khi like review' });
  }
};

// Unlike review
const unlikeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userClerkId = req.auth?.userId;
    if (!userClerkId) return res.status(401).json({ message: 'Chưa đăng nhập' });
    
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review không tồn tại' });
    
    if (!review.likes) review.likes = [];
    review.likes = review.likes.filter(cid => cid !== userClerkId);
    await review.save();
    
    // Trả về review đầy đủ để FE cập nhật UI
    const updatedReview = await Review.findById(id)
      .populate('user', 'clerkId username firstname lastname avatar _id')
      .populate('tour', 'name');
    
    res.json(updatedReview);
  } catch (err) {
    console.error('Lỗi unlikeReview:', err);
    res.status(500).json({ message: 'Lỗi khi unlike review' });
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview
};

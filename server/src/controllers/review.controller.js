const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Tour = require('../models/Tour');

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
    await updateTourRating(tourId);

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
    if (updated) await updateTourRating(updated.tour);
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
    if (deleted) await updateTourRating(deleted.tour);
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

// Admin reply to review
const adminReplyToReview = async (req, res) => {
  try {
    const { id } = req.params; // review ID
    const { adminReply } = req.body;
    const userId = req.dbUser?._id; // ID người dùng từ DB, được thêm bởi findOrCreateUser middleware
    const userRole = req.dbUser?.role; // Vai trò người dùng từ DB

    if (!userId) {
      return res.status(401).json({ message: 'Người dùng chưa được xác thực.' });
    }

    // Chỉ admin mới có quyền phản hồi
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền phản hồi đánh giá này.' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá.' });
    }

    // Cập nhật trường adminReply
    review.adminReply = adminReply;
    await review.save();

    // Trả về review đầy đủ với phản hồi của admin để frontend cập nhật UI
    const updatedReview = await Review.findById(id)
      .populate('user', 'clerkId username firstname lastname avatar _id')
      .populate('tour', 'name');

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Lỗi adminReplyToReview:', error);
    res.status(500).json({ message: 'Lỗi server khi phản hồi đánh giá.' });
  }
};

// Hàm cập nhật averageRating và reviewCount cho tour
async function updateTourRating(tourId) {
  const reviews = await Review.find({ tour: tourId });
  let averageRating = 0;
  if (reviews.length > 0) {
    averageRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
  }
  await Tour.findByIdAndUpdate(tourId, {
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
  });
}

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
  adminReplyToReview
};

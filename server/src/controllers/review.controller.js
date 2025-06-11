const Review = require('../models/Review');

// Lấy danh sách tất cả review (có thể lọc theo tour hoặc user)
const getReviews = async (req, res) => {
  try {
    const query = {};
    if (req.query.tour) query.tour = req.query.tour;
    if (req.query.user) query.user = req.query.user;

    const reviews = await Review.find(query)
      .populate('user', 'username')
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
    const { user, tour, rating, comment } = req.body;
    if (!user || !tour || !rating) {
      return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
    }

    const review = await Review.create({ user, tour, rating, comment });
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
    const { rating, comment, adminReply } = req.body;

    const updated = await Review.findByIdAndUpdate(
      id,
      { rating, comment, adminReply },
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

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview
};

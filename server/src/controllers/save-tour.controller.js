const SavedTour = require('../models/SavedTour');

// Lấy danh sách tour đã lưu của 1 user
const getSavedToursByUser = async (req, res) => {
    try {
      let { userId } = req.params;
      // Nếu userId là dạng 'user_' (Clerk), thì tìm user MongoDB
      if (userId.startsWith('user_')) {
        const User = require('../models/User');
        const user = await User.findOne({ clerkId: userId });
        if (!user) return res.json([]);
        userId = user._id;
      }
      const savedTours = await SavedTour.find({ user: userId })
        .populate('tour'); // optional: load thông tin tour
      res.json(savedTours);
    } catch (error) {
      console.error('Lỗi getSavedToursByUser:', error);
      res.status(500).json({ message: 'Lỗi khi lấy danh sách tour đã lưu' });
    }
  };

//Lưu tour
const saveTour = async (req, res) => {
  try {
    const userId = req.dbUser?._id || req.user?._id || req.userId || req.user?.id;
    const { tour } = req.body;
    if (!userId || !tour) {
      return res.status(400).json({ message: 'Thiếu userId hoặc tour' });
    }
    // Kiểm tra trùng lặp
    const existing = await SavedTour.findOne({ user: userId, tour });
    if (existing) {
      return res.status(409).json({ message: 'Tour đã được lưu trước đó' });
    }
    const saved = await SavedTour.create({ user: userId, tour });
    res.status(201).json(saved);
  } catch (error) {
    console.error('Lỗi saveTour:', error);
    res.status(500).json({ message: 'Lỗi khi lưu tour' });
  }
};

//Xoá tour đã lưu theo id tour (KHÔNG phải id của SavedTour)
const deleteSavedTour = async (req, res) => {
  try {
    const userId = req.dbUser?._id || req.user?._id || req.userId || req.user?.id;
    const tourId = req.params.id;
    if (!userId || !tourId) {
      return res.status(400).json({ message: 'Thiếu userId hoặc tourId' });
    }
    const deleted = await SavedTour.findOneAndDelete({ user: userId, tour: tourId });
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy saved tour' });
    }
    res.json({ message: 'Xoá tour đã lưu thành công' });
  } catch (error) {
    console.error('Lỗi deleteSavedTour:', error);
    res.status(500).json({ message: 'Lỗi khi xoá tour' });
  }
};

module.exports = {
  getSavedToursByUser,
  saveTour,
  deleteSavedTour
};

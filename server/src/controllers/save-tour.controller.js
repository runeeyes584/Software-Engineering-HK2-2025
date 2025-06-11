const SavedTour = require('../models/SavedTour');

// Lấy danh sách tour đã lưu của 1 user
const getSavedToursByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
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
    const { user, tour } = req.body;

    if (!user || !tour) {
      return res.status(400).json({ message: 'Thiếu user hoặc tour' });
    }

    // Kiểm tra trùng lặp
    const existing = await SavedTour.findOne({ user, tour });
    if (existing) {
      return res.status(409).json({ message: 'Tour đã được lưu trước đó' });
    }

    const saved = await SavedTour.create({ user, tour });
    res.status(201).json(saved);
  } catch (error) {
    console.error('Lỗi saveTour:', error);
    res.status(500).json({ message: 'Lỗi khi lưu tour' });
  }
};

//Xoá tour đã lưu theo id
const deleteSavedTour = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SavedTour.findByIdAndDelete(id);

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

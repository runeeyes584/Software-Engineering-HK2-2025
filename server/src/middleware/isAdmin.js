const User = require('../models/User.js');

const isAdmin = async (req, res, next) => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ message: 'Chưa xác thực người dùng' });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Lỗi middleware isAdmin:", err);
    res.status(500).json({ message: 'Lỗi máy chủ khi xác thực quyền admin' });
  }
};

module.exports = isAdmin;

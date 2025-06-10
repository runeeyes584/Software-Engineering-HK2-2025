const User = require('../models/User');
const { users } = require('@clerk/clerk-sdk-node');

// Middleware: mapping user Clerk với user trong MongoDB
module.exports = async function findOrCreateUser(req, res, next) {
  try {
    const clerkId = req.auth.userId;
    if (!clerkId) return res.status(401).json({ message: 'Không tìm thấy userId từ Clerk!' });

    // Tìm user trong MongoDB
    let user = await User.findOne({ clerkId });
    if (!user) {
      // Lấy thông tin user từ Clerk
      const clerkUser = await users.getUser(clerkId);
      // Tạo user mới trong MongoDB
      user = await User.create({
        clerkId,
        username: clerkUser.username || clerkUser.emailAddresses[0].emailAddress,
        email: clerkUser.emailAddresses[0].emailAddress,
        role: 'user',
        password: '' // Không cần password vì dùng Clerk
      });
    }
    req.dbUser = user;
    next();
  } catch (err) {
    next(err);
  }
} 
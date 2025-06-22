const { Webhook } = require('svix');
const User = require('../models/User.js');

// Webhook xác thực và lưu thông tin user từ Clerk
const handleClerkWebhook = async (req, res) => {
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send("Error: Missing Svix headers");
  }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!WEBHOOK_SECRET) {
    return res.status(500).send("Server configuration error");
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    const payload = req.body.toString();
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });

    console.log("📨 Nhận webhook từ Clerk, loại:", evt.type);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }

  try {
    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.deleted") {
      return res.status(200).json({ success: true, message: "User deleted event ignored" });
    }

    const {
      username,
      first_name,
      last_name,
      image_url,
      email_addresses
    } = evt.data;

    const email = email_addresses?.[0]?.email_address?.toLowerCase();

    if (!email) {
      return res.status(200).json({
        success: true,
        message: "No email provided, webhook ignored"
      });
    }

    const finalUsername = username || email.split('@')[0] || `user_${Date.now()}`;

    const userData = {
      clerkId: id,
      email,
      username: finalUsername,
      firstname: first_name || null,
      lastname: last_name || null,
      avatar: image_url || null,
    };

    // Nếu webhook hoặc request có phone/address thì lưu luôn
    if (evt.data.phone) userData.phone = evt.data.phone;

    Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key]);

    await User.findOneAndUpdate(
      { clerkId: id },
      userData,
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "User saved successfully to database",
    });
  } catch (err) {
    return res.status(500).send("Error processing webhook");
  }
};

// Lấy danh sách tất cả user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật thông tin profile của user (phone, address)
const updateUserProfile = async (req, res) => {
  try {
    // Lấy userId từ middleware (ví dụ: req.dbUser từ findOrCreateUser)
    const userId = req.dbUser?._id; 
    if (!userId) {
      return res.status(401).json({ message: 'Người dùng chưa được xác thực.' });
    }

    const { phone, province, district, ward, detailedAddress, gender, dateOfBirth } = req.body;
    
    // Tạo object chứa các trường cần cập nhật
    const updateFields = {};
    if (phone !== undefined) updateFields.phone = phone;
    if (gender !== undefined) updateFields.gender = gender;
    
    // Cập nhật dateOfBirth nếu có
    if (dateOfBirth && typeof dateOfBirth === 'object') {
      const dobFields = {};
      if (dateOfBirth.day !== undefined) dobFields.day = dateOfBirth.day;
      if (dateOfBirth.month !== undefined) dobFields.month = dateOfBirth.month;
      if (dateOfBirth.year !== undefined) dobFields.year = dateOfBirth.year;

      if (Object.keys(dobFields).length > 0) {
        updateFields.dateOfBirth = dobFields;
      }
    }

    // Cập nhật các trường con của address
    const addressFields = {};
    if (province !== undefined) addressFields.province = province;
    if (district !== undefined) addressFields.district = district;
    if (ward !== undefined) addressFields.ward = ward;
    if (detailedAddress !== undefined) addressFields.detailedAddress = detailedAddress;

    if (Object.keys(addressFields).length > 0) {
      updateFields.address = addressFields;
    }

    // Nếu không có trường nào để cập nhật
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'Không có thông tin nào để cập nhật.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    // Trả về thông tin user đã cập nhật (có thể lọc bỏ password)
    res.status(200).json({ message: 'Cập nhật profile thành công!', user: updatedUser.toObject({ getters: true, virtuals: false }) });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật profile.' });
  }
};

// Lấy thông tin profile của user hiện tại
const getUserProfile = async (req, res) => {
  try {
    const userId = req.dbUser?._id; 
    if (!userId) {
      return res.status(401).json({ message: 'Người dùng chưa được xác thực.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    // Trả về thông tin user (có thể lọc bỏ password)
    res.status(200).json({ user: user.toObject({ getters: true, virtuals: false }) });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy profile.' });
  }
};

// Cập nhật avatar của user
const updateUserAvatar = async (req, res) => {
  try {
    const userId = req.dbUser?._id; 
    if (!userId) {
      return res.status(401).json({ message: 'Người dùng chưa được xác thực.' });
    }

    const { avatar } = req.body;
    
    if (!avatar) {
      return res.status(400).json({ message: 'Avatar URL không được để trống.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json({ 
      message: 'Cập nhật avatar thành công!', 
      user: updatedUser.toObject({ getters: true, virtuals: false }) 
    });

  } catch (error) {
    console.error('Lỗi khi cập nhật avatar:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật avatar.' });
  }
};

module.exports = {
  handleClerkWebhook,
  getAllUsers,
  updateUserProfile,
  getUserProfile,
  updateUserAvatar
};

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
    const payload = req.body;
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }

  try {
    const { id } = evt.data;
    const eventType = evt.type;
    const {
      username,
      first_name,
      last_name,
      image_url,
      email_addresses
    } = evt.data;

    if (eventType === "user.created" || eventType === "user.updated") {
      const userData = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address?.toLowerCase(),
        username: username || null,
        firstname: first_name || null,
        lastname: last_name || null,
        avatar: image_url || null,
      };

      Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key]);

      await User.findOneAndUpdate({ clerkId: id }, userData, { upsert: true, new: true });

      return res.status(200).json({
        success: true,
        message: "Webhook processed and DB updated successfully",
      });
    }

    if (eventType === "user.deleted") {
      await User.findOneAndDelete({ clerkId: id });
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }

    return res.status(200).json({ success: true, message: "Webhook received (no action taken)" });
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

module.exports = {
  handleClerkWebhook,
  getAllUsers
};

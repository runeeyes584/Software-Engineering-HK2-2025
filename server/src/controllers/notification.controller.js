const Notification = require('../models/Notification');
const { getIO } = require('../socket'); // Import getIO function

/**
 * @description Create a new notification and emit a socket event
 * @param {string} clerkId - The Clerk user ID (string)
 * @param {string} title - The title of the notification
 * @param {string} message - The content of the notification
 * @param {string} [link] - An optional link for the notification to redirect to
 */
const createNotification = async (clerkId, title, message, link) => {
    try {
        if (!clerkId || !title || !message) {
            return; // Don't create empty notifications
        }

        // Tìm user theo clerkId để lấy _id cho notification
        const User = require('../models/User');
        const user = await User.findOne({ clerkId });
        if (!user) return;

        const newNotification = new Notification({
            user: user._id,
            title,
            message,
            link: link || ''
        });

        await newNotification.save();

        // Populate user info if needed, though for the notification itself it might not be necessary
        const notificationToSend = await Notification.findById(newNotification._id);

        // Emit a real-time event to the specific user's room (dùng clerkId)
        const io = getIO();
        io.to(clerkId).emit('new_notification', notificationToSend);

    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

// Controller to get all notifications for the logged-in user
const getNotifications = async (req, res) => {
    try {
        console.log('[getNotifications] Request received');
        if (!req.dbUser) {
            console.error('[getNotifications] req.dbUser is undefined!');
            return res.status(401).json({ message: 'User not authenticated (no dbUser)' });
        }
        const userId = req.dbUser._id;
        console.log('[getNotifications] userId:', userId);
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50);
        console.log('[getNotifications] notifications count:', notifications.length);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('[getNotifications] Error:', error);
        res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
    }
};

// Controller to mark a notification as read
const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.dbUser._id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, user: userId }, // Ensure user can only mark their own notifications
            { isRead: true },
            { new: true } // Return the updated document
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found or you are not authorized' });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
    }
};

// Controller to mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.dbUser._id;
        const result = await Notification.updateMany(
            { user: userId, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ message: 'All notifications marked as read', updated: result.nModified || result.modifiedCount });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark all notifications as read', error: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead
}; 
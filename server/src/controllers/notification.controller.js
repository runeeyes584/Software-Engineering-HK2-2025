const Notification = require('../models/Notification');
const { io } = require('../index'); // Import io instance

/**
 * @description Create a new notification and emit a socket event
 * @param {string} userId - The ID of the user who will receive the notification
 * @param {string} message - The content of the notification
 * @param {string} [link] - An optional link for the notification to redirect to
 */
const createNotification = async (userId, message, link) => {
    try {
        if (!userId || !message) {
            return; // Don't create empty notifications
        }

        const newNotification = new Notification({
            user: userId,
            message,
            link: link || ''
        });

        await newNotification.save();

        // Populate user info if needed, though for the notification itself it might not be necessary
        const notificationToSend = await Notification.findById(newNotification._id);

        // Emit a real-time event to the specific user's room
        io.to(userId).emit('new_notification', notificationToSend);
        
        console.log(`Notification sent to user ${userId}: ${message}`);

    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

// Controller to get all notifications for the logged-in user
const getNotifications = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(50); // Limit to last 50 notifications

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
    }
};

// Controller to mark a notification as read
const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.auth.userId;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, user: userId }, // Ensure user can only mark their own notifications
            { read: true },
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

module.exports = {
    createNotification,
    getNotifications,
    markAsRead
}; 
const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notification.controller');
const findOrCreateUser = require('../middleware/findOrCreateUser');
const requireAuth = require('../middleware/clerk');

// Middleware to ensure user is authenticated for all notification routes
router.use(requireAuth);
router.use(findOrCreateUser);

// GET /api/notifications - Get all notifications for the current user
router.get('/', getNotifications);

// PUT /api/notifications/:id/read - Mark a specific notification as read
router.put('/:id/read', markAsRead);

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', markAllAsRead);

module.exports = router; 
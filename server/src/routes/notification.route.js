const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notification.controller');
const findOrCreateUser = require('../middleware/findOrCreateUser');

// Middleware to ensure user is authenticated for all notification routes
router.use(findOrCreateUser);

// GET /api/notifications - Get all notifications for the current user
router.get('/', getNotifications);

// PUT /api/notifications/:id/read - Mark a specific notification as read
router.put('/:id/read', markAsRead);

module.exports = router; 
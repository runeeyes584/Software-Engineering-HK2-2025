const express = require('express');
const { saveTour, deleteSavedTour, getSavedToursByUser } = require('../controllers/save-tour.controller.js');
const requireAuth = require('../middleware/clerk.js');
const findOrCreateUser = require('../middleware/findOrCreateUser.js');

const router = express.Router();

// Lấy danh sách tour đã lưu của 1 user
router.get('/user/:userId', getSavedToursByUser);

// Lưu tour
router.post('/', requireAuth, findOrCreateUser, saveTour);           

// Xoá tour theo _id
router.delete('/:id', requireAuth, findOrCreateUser, deleteSavedTour);  

module.exports = router;

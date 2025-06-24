const express = require('express');
const { getSearchSuggestions, searchTours } = require('../controllers/search.controller.js');

const router = express.Router();

// Route lấy gợi ý tìm kiếm
router.get('/suggestions', getSearchSuggestions);

// Route tìm kiếm tour với các bộ lọc
router.get('/', searchTours);

module.exports = router;

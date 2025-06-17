const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller.js');

router.post('/', chatbotController.handleChatRequest);

module.exports = router;
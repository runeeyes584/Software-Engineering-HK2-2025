const AIService = require('../service/ai.service.js');

async function handleChatRequest(req, res) {
    const { question, history } = req.body;
    if (!question) {
        return res.status(400).json({ answer: "Câu hỏi không được để trống." });
    }

    try {
        const answer = await AIService.getAIResponse(question, history);
        res.json({ answer });
    } catch (error) {
        console.error('Lỗi khi xử lý chatbot:', error);
        res.status(500).json({ answer: "Xin lỗi, hệ thống đang gặp sự cố." });
    }
}

module.exports = { handleChatRequest };
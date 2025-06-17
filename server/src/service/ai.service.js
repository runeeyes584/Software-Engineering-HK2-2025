// src/services/ai.service.js
const COMPANY_INFO = {
    name: "TravelBooking",
    phone: "1900 1234", // Số điện thoại thật của bạn
    email: "contact@travelbooking.com", // Email thật
    address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh"
};

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- CẤU HÌNH ---
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// --- LOGIC PHÂN LOẠI Ý ĐỊNH ---
const specialIntents = {
    private_tour_request: {
        keywords: ["tour riêng", "tour gia đình", "chỉ mình tôi", "một mình"],
        response: "Tôi sẽ liên hệ tới hỗ trợ viên để tư vấn trực tiếp cho bạn về tour riêng nhé. Bạn vui lòng chờ trong giây lát ạ."
    },
    greeting: {
        keywords: ["xin chào", "chào bạn", "hello", "hi"],
        response: "Xin chào! Tôi có thể giúp gì cho bạn về các tour du lịch của chúng tôi?"
    },
    introduce_company: {
        keywords: ["bạn là ai", "về công ty", "giới thiệu về", "công ty là gì", "lịch sử công ty"],
        response: "Chào bạn, chúng tôi là TravelBooking, một công ty công nghệ du lịch với sứ mệnh mang đến những trải nghiệm đặt tour tiện lợi và đáng nhớ. Chúng tôi kết nối bạn với hàng trăm tour du lịch chất lượng cao trên khắp Việt Nam. Bạn cần tìm hiểu thêm về điều gì cụ thể ạ?"
    },
    leave_contact_info: {
        keywords: ["gọi lại cho tôi", "để lại sđt", "để lại số điện thoại", "tư vấn cho tôi", "liên hệ với tôi", "gọi cho tôi"],
        handler: "collectContactInfo" // Đánh dấu đây là một tác vụ cần xử lý đặc biệt
    }
};

function getIntent(question) {
    const lowerCaseQuestion = question.toLowerCase();
    for (const intentName in specialIntents) {
        const intent = specialIntents[intentName];
        if (intent.keywords.some(keyword => lowerCaseQuestion.includes(keyword))) {
            return intent;
        }
    }
    return null;
}

// --- LOGIC RAG OFFLINE ---
let tourEmbeddings = [];
try {
    const filePath = path.join(__dirname, '../../embeddings.json'); // Đảm bảo đường dẫn đúng từ file service
    tourEmbeddings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log("Tải dữ liệu embedding thành công.");
} catch (err) {
    console.error('Lỗi: Không thể đọc file embeddings.json. Hãy chắc chắn bạn đã tạo file này.');
}

function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0.0, normA = 0.0, normB = 0.0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// --- HÀM XUẤT RA ---
async function getAIResponse(question, history = []) {
    const matchedIntent = getIntent(question);
    if (matchedIntent && matchedIntent.handler == "collectContactInfo") {
        const chatHistoryText = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
        const prompt = `
        Bạn là một trợ lý ảo đang trong quá trình thu thập thông tin liên lạc của khách hàng để bộ phận hỗ trợ gọi lại.
        Nhiệm vụ của bạn là dẫn dắt cuộc trò chuyện một cách tự nhiên để lấy được Tên và Số điện thoại của khách.

        Lịch sử trò chuyện từ đầu đến giờ:
        ---
        ${chatHistoryText}
        ---

        Dựa vào tin nhắn cuối cùng của người dùng và lịch sử chat, hãy thực hiện một trong các hành động sau:
        1. Nếu người dùng chưa cung cấp đủ Tên và Số điện thoại, hãy lịch sự hỏi thông tin còn thiếu. Chỉ hỏi một thông tin mỗi lần.
        2. Nếu người dùng đã cung cấp đủ cả Tên và Số điện thoại, hãy cảm ơn và xác nhận lại thông tin đó một cách rõ ràng (ví dụ: "Cảm ơn anh/chị [Tên]. Chúng tôi sẽ liên hệ lại qua số [Số điện thoại]..."). Sau đó kết thúc tác vụ.
        3. Nếu người dùng hỏi sang chuyện khác, hãy tạm dừng tác vụ này và trả lời câu hỏi của họ.

        Hãy tạo ra câu trả lời tiếp theo.
    `;
        const result = await geminiModel.generateContent(prompt);
        return result.response.text();
    }

    if (matchedIntent && matchedIntent.response) {
        return matchedIntent.response;
    }

    if (tourEmbeddings.length === 0) {
        return "Xin lỗi, dữ liệu của tôi chưa sẵn sàng. Vui lòng thử lại sau.";
    }

    // Chạy RAG
    const questionResult = await embeddingModel.embedContent(question);
    const questionVector = questionResult.embedding.values;

    const similarities = tourEmbeddings.map(tour => ({
        ...tour,
        similarity: cosineSimilarity(questionVector, tour.vector)
    })).sort((a, b) => b.similarity - a.similarity);

    const topResults = similarities.slice(0, 3);
    const context = topResults.map(r => `Tên tour: ${r.name}\nMô tả: ${r.description}`).join('\n\n');

    const prompt = `Dựa vào thông tin السياحة (du lịch) sau đây:\n\n${context}\n\nHãy trả lời câu hỏi của người dùng một cách thân thiện và tự nhiên bằng tiếng Việt. Câu hỏi là: "${question}"`;

    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
}

module.exports = { getAIResponse };
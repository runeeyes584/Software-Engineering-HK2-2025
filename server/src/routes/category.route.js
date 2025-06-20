const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/category.controller');
const requireAuth = require('../middleware/clerk');
const isAdmin = require('../middleware/isAdmin');


// Lấy danh sách category
router.get('/', getAllCategories);
// Lấy category theo id
router.get('/:id', getCategoryById);
// Tạo category (admin)
router.post('/', requireAuth, isAdmin, createCategory);
// Sửa category (admin)
router.put('/:id', requireAuth, isAdmin, updateCategory);
// Xóa category (admin)
router.delete('/:id', requireAuth, isAdmin, deleteCategory);

module.exports = router; 
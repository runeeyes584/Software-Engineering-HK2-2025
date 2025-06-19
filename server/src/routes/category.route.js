const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const requireAuth = require('../middleware/clerk');
const isAdmin = require('../middleware/isAdmin');

// Lấy danh sách category
router.get('/', categoryController.getAllCategories);
// Lấy category theo id
router.get('/:id', categoryController.getCategoryById);
// Tạo category (admin)
router.post('/', requireAuth, isAdmin, categoryController.createCategory);
// Sửa category (admin)
router.put('/:id', requireAuth, isAdmin, categoryController.updateCategory);
// Xóa category (admin)
router.delete('/:id', requireAuth, isAdmin, categoryController.deleteCategory);

module.exports = router; 
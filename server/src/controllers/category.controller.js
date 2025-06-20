const Category = require('../models/Category');

// Lấy danh sách category
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const categoriesWithCount = categories.map(cat => ({
      ...cat.toObject(),
      tourCount: 0,
      status: 'inactive',
    }));
    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Lấy category theo id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' });
  }
};

// Tạo category (admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const category = new Category({ name, icon, description });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Sửa category (admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, icon, description },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' });
  }
};

// Xóa category (admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
}; 
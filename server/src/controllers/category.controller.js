const Category = require('../models/Category');

// Lấy danh sách category
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'tours', // The name of the collection to join with
          localField: '_id',
          foreignField: 'category',
          as: 'tours'
        }
      },
      {
        $addFields: {
          tourCount: { $size: '$tours' },
          status: {
            $cond: {
              if: { $gt: [{ $size: '$tours' }, 0] },
              then: 'active',
              else: 'inactive'
            }
          }
        }
      },
      {
        $project: { // Exclude the 'tours' array from the final output
          tours: 0,
          '__v': 0
        }
      }
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', details: error.message });
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
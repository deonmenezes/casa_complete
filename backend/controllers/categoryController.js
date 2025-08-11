const Category = require('../models/category');

// @desc    Get all categories
// @route   GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// @desc    Get Main Categories (parentCategory == null)
// @route   GET /api/categories/main
exports.getMainCategories = async (req, res) => {
  try {
    const mainCategories = await Category.find({ parentCategory: null });
    res.json(mainCategories);
  } catch (error) {
    console.error('Error fetching main categories:', error);
    res.status(500).json({ message: 'Error fetching main categories', error: error.message });
  }
};

// @desc    Get Subcategories of a Parent Category
// @route   GET /api/categories/:parentId/subcategories
exports.getSubcategories = async (req, res) => {
  try {
    const { parentId } = req.params;
    const subcategories = await Category.find({ parentCategory: parentId });
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
  }
};

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Route: GET /api/categories → Get all categories
router.get('/', categoryController.getAllCategories);

// Route: GET /api/categories/main → Get Main (Parent) Categories
router.get('/main', categoryController.getMainCategories);

// Route: GET /api/categories/:parentId/subcategories → Get Subcategories of a Category
router.get('/:parentId/subcategories', categoryController.getSubcategories);

module.exports = router;

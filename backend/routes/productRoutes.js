// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  getProductByCategory,
  getAllProductsByBrand,
  getAllProductsByPrice,
  getProductsByGender,
  getProductsByTag,
  search,
  createProduct,
  deleteProduct,
  updateProduct
} = require('../controllers/productController');

// CREATE product
router.post('/create', createProduct);

// GET all products by brand ID
router.get('/brand/:id', getAllProductsByBrand);

// GET all products (with pagination and exclusion)
router.get('/', getAllProducts);

// GET product by ID
router.get('/id/:id', getProductById);

// GET products by category (tag-based)
router.get('/category', getProductByCategory);

// GET products by price range
router.get('/price', getAllProductsByPrice);

// GET products by gender
router.get('/gender', getProductsByGender);

// GET products by tag
router.get('/tag', getProductsByTag);

// SEARCH products
router.post('/search', search);

// UPDATE product by ID
router.put('/update/:id', updateProduct);

// DELETE product by ID
router.delete('/id/:id', deleteProduct);

module.exports = router;

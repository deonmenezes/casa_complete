// backend/routes/brandRoutes.js
const express = require('express');
const router = express.Router();
const { getBrandById, getBrandByName, getAllBrands, createBrand, deleteBrand, updateBrand, loginBrand, getBrandSales} = require('../controllers/brandController');

// POST create a new brand
router.post('/create', createBrand); 

router.get('/sales/:id', getBrandSales)

// GET all brands
router.get('/', getAllBrands);

// GET brand by name
router.get('/name/:name', getBrandByName);

// Update brand by ID
router.put('/:id', updateBrand);     

// Delete brand by ID
router.delete('/:id', deleteBrand);  

// GET brand by ID
router.get('/:id', getBrandById);

router.post('/login', loginBrand);

module.exports = router;

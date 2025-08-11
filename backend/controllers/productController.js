const Product = require('../models/product');
const Category = require('../models/category');
const Brand = require('../models/brand');
const mongoose = require('mongoose');

// GET all products with pagination support and exclusion
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const excludeParam = req.query.exclude;
    let excludeIds = [];

    if (excludeParam) {
      excludeIds = excludeParam.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
      console.log(`🚫 Excluding ${excludeIds.length} products:`, excludeIds.slice(0, 3), excludeIds.length > 3 ? '...' : '');
    }

    const query = {
      is_active: true,
      ...(excludeIds.length > 0 && { _id: { $nin: excludeIds } })
    };

    let productsQuery = Product.find(query).populate('brand category').sort({ created_at: -1 });

    if (excludeIds.length === 0) {
      productsQuery = productsQuery.skip(skip).limit(limit);
    } else {
      productsQuery = productsQuery.limit(limit); // Skip removed for swipe-mode
    }

    const products = await productsQuery;

    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
};


// GET product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id).populate('brand category');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET products by category (using category field)
const getProductByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    // Find products by category ID or category name
    let query;
    if (mongoose.Types.ObjectId.isValid(category)) {
      // If category is a valid ObjectId, search by category ID
      query = { category: category };
    } else {
      // If category is a string, find the category by name first
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(404).json({ error: 'Category not found' });
      }
      query = { category: categoryDoc._id };
    }

    const products = await Product.find(query)
      .populate('brand', 'name logo_url')
      .populate('category', 'name');

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all products by brand ID
const getAllProductsByBrand = async (req, res) => {
  
  try {
    const brandId = req.params.id;
    
    if (!brandId || !mongoose.Types.ObjectId.isValid(brandId)) {
      return res.status(400).json({ error: 'Valid brand ID is required in query (?id=...)' });
    }

    const products = await Product.find({ brand: brandId }).populate('brand category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET products by price range
const getAllProductsByPrice = async (req, res) => {
  const { min, max } = req.query;
  try {
    const products = await Product.find({
      price: {
        $gte: min ? parseFloat(min) : 0,
        $lte: max ? parseFloat(max) : Infinity
      }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET products by gender
const getProductsByGender = async (req, res) => {
  try {
    const { gender } = req.query;
    const products = await Product.find({ gender });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET products by tag
const getProductsByTag = async (req, res) => {
  try {
    const { tag } = req.query;
    const products = await Product.find({ tags: tag });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEARCH products by name
const search = async (req, res) => {
  const { query } = req.body;
  try {
    const result = await Product.find({
      name: { $regex: query, $options: 'i' }
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};

// CREATE product
const createProduct = async (req, res) => {
  try {
    let {
      name,
      description,
      images,
      price,
      currency,
      sizes,
      fits,
      tags,
      stock,
      geo_tags,
      gender,
      brand,
      category
    } = req.body;

    const foundBrand = await Brand.findOne({ name: brand });
    if (!foundBrand) {
      return res.status(400).json({ error: `Brand "${brand}" not found` });
    }

    const foundCategory = await Category.findOne({ name: category });
    if (!foundCategory) {
      return res.status(400).json({ error: `Category "${category}" not found` });
    }

    const newProduct = new Product({
      name,
      description,
      images,
      price,
      currency,
      sizes,
      fits,
      tags,
      stock,
      geo_tags,
      gender,
      brand: foundBrand,
      category: foundCategory
    });

    const saved = await newProduct.save();
    res.status(201).json({data: saved});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE product by ID
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE product by ID
const updateProduct = async (req, res) => {
  try {

    const brand = await Brand.findOne({name: req.body.brand})
    const category = await Category.findOne({name: req.body.category})

    if (!brand || !category) {
      return res.status(400).json({ message: 'Invalid brand or category name' });
    }

    const product = {...req.body, brand: brand._id, category: [category._id]}
    
    const updated = await Product.findByIdAndUpdate(req.params.id, product, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};

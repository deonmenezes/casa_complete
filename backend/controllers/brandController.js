// backend/controllers/brandController.js

const Brand = require('../models/brand');

// GET brand by ID
const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET brand by name (case-insensitive search)
const getBrandByName = async (req, res) => {
  try {
    const { name } = req.body;
    const brand = await Brand.findOne({ name });

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// GET all brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find(); // fetch all documents from Brand collection
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST create a new brand
const createBrand = async (req, res) => {
  try {
    const {
      name,
      logo_url,
      description,
      website,
      social_links,
      crm_user_ids,
      inventory_sync_status,
      is_active
    } = req.body;

    const brand = new Brand({
      name,
      logo_url,
      description,
      website,
      social_links,
      crm_user_ids,
      inventory_sync_status,
      is_active
    });

    const savedBrand = await brand.save();
    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create brand', error: error.message });
  }
};

// DELETE brand by ID
const deleteBrand = async (req, res) => {
  try {
    const deleted = await Brand.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Brand not found' });
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE brand by ID
const updateBrand = async (req, res) => {
  try {
    const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Brand not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  getBrandById,
  getBrandByName,
  getAllBrands,
  createBrand,
  deleteBrand,
  updateBrand
};

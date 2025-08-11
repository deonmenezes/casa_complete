// backend/controllers/brandController.js

const bcrypt = require('bcryptjs');
const Brand = require('../models/brand');
const Order = require('../models/order')
const mongoose = require('mongoose');

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
      email,
      password,
      crm_user_ids,
      inventory_sync_status,
      is_active,
      store_addresses,
      emergency_contact,
      bank_details,
      return_policy,
      shipping_policy,
      store_policy
    } = req.body;

    // Optional: Hash password if you’re allowing password creation here
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const brand = new Brand({
      name,
      logo_url,
      description,
      website,
      social_links,
      email,
      password: hashedPassword,
      crm_user_ids,
      inventory_sync_status,
      is_active,
      store_addresses,
      emergency_contact,
      bank_details,
      return_policy,
      shipping_policy,
      store_policy
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

// REGISTER BRAND
const registerBrand = async (req, res) => {
  try {
    const { name, logo_url, description, website, social_links, email, password } = req.body;

    const existing = await Brand.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newBrand = new Brand({
      name,
      logo_url,
      description,
      website,
      social_links,
      email,
      password: hashedPassword
    });

    await newBrand.save();

    res.status(201).json({ message: 'Brand registered successfully', brand: newBrand });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.name) {
      return res.status(400).json({ error: 'Brand name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

const loginBrand = async (req, res) => {
  try {
    const { email, password } = req.body;

    const brand = await Brand.findOne({ email });
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    const isMatch = await bcrypt.compare(password, brand.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    res.status(200).json({ success: true, brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBrandSales = async (req, res) => {
  const brandId = req.params.id;

  try {
    const sales = await Order.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $match: {
          "productDetails.brand": new mongoose.Types.ObjectId(brandId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          product_name: "$productDetails.name",
          quantity: "$products.quantity",
          size: "$products.size",
          order_date: "$createdAt",
          delivery_status: "$deliveryStatus",
          payment_status: "$paymentStatus",
          order_id: "$_id",
          user: {
            email: "$userDetails.email",
            phone: "$userDetails.phone",
            display_name: "$userDetails.display_name"
          }
        }
      },
      { $sort: { order_date: -1 } }
    ]);

    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    console.error("Error fetching brand sales:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


module.exports = {
  getBrandById,
  getBrandByName,
  getAllBrands,
  getBrandSales,
  createBrand,
  deleteBrand,
  updateBrand,
  registerBrand,
  loginBrand
};

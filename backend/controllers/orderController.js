const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const mongoose = require('mongoose');

// CREATE new order
const createOrder = async (req, res) => {
  try {
    const {
      user,
      wishlistProducts,
      address,
      estimatedDelivery,
      paymentStatus
    } = req.body;

    if (!user || !wishlistProducts || wishlistProducts.length === 0 || !address) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const newOrder = new Order({
      user,
      wishlistProducts,
      address,
      estimatedDelivery,
      paymentStatus
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', detail: err.message });
  }
};

// GET all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'display_name email phone')
      .populate('wishlistProducts.product', 'name price images');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'display_name email phone')
      .populate('wishlistProducts.product', 'name price images');

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE order status (delivery or payment)
const updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE order
const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};

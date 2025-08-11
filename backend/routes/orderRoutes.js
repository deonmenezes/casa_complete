const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');

// Create a new order
router.post('/create', createOrder);

// Get all orders
router.get('/', getAllOrders);

// Get a specific order by ID
router.get('/id/:id', getOrderById);

// Get orders by user ID
router.get('/user/:userId', getOrdersByUserId);

// Update an order (e.g., deliveryStatus or paymentStatus)
router.put('/update/:id', updateOrder);

// Delete an order
router.delete('/delete/:id', deleteOrder);

module.exports = router;

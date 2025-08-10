const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} = require('../controllers/orderController');

// Create a new order
router.post('/create', createOrder);

// Get all orders
router.get('/', getAllOrders);

// Get a specific order by ID
router.get('/:id', getOrderById);

// Update an order (e.g., deliveryStatus or paymentStatus)
router.put('/update/:id', updateOrder);

// Delete an order
router.delete('/delete/:id', deleteOrder);

module.exports = router;

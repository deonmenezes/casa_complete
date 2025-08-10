const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

/**
 * CART ROUTES
 * RESTful API for shopping cart functionality
 */

// === MAIN CART ROUTES ===

// Get cart by phone number
// GET /api/cart?phone=+919876543210
router.get('/', getCart);

// Add product to cart
// POST /api/cart/items
// Body: { phone: "+919876543210", productId: "64b5f301...", quantity: 2, size: "L" }
router.post('/items', addToCart);

// Update cart item quantity
// PUT /api/cart/items
// Body: { phone: "+919876543210", productId: "64b5f301...", size: "L", quantity: 3 }
router.put('/items', updateCartItem);

// Remove item from cart
// DELETE /api/cart/items
// Body: { phone: "+919876543210", productId: "64b5f301...", size: "L" }
router.delete('/items', removeFromCart);

// Clear entire cart
// DELETE /api/cart/clear
// Body: { phone: "+919876543210" }
router.delete('/clear', clearCart);

module.exports = router;

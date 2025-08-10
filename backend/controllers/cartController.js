const Cart = require('../models/cart');
const Product = require('../models/product');

// Helper function to clean up duplicate items in cart
const cleanupDuplicateItems = async (cart) => {
  const uniqueItems = [];
  const seenItems = new Map();

  cart.items.forEach(item => {
    const key = `${item.product._id || item.product}-${item.size}`;

    if (seenItems.has(key)) {
      // Merge quantities for duplicate items
      const existingItem = seenItems.get(key);
      existingItem.quantity += item.quantity;
      console.log(`🧹 Merging duplicate item: ${key}, total quantity: ${existingItem.quantity}`);
    } else {
      seenItems.set(key, {
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        priceAtAdd: item.priceAtAdd
      });
      uniqueItems.push(item);
    }
  });

  // If we found duplicates, rebuild the items array
  if (seenItems.size < cart.items.length) {
    console.log(`🧹 Found duplicates: ${cart.items.length} -> ${seenItems.size} unique items`);
    cart.items = [];

    seenItems.forEach((itemData, key) => {
      cart.items.push({
        product: itemData.product,
        quantity: itemData.quantity,
        size: itemData.size,
        priceAtAdd: itemData.priceAtAdd
      });
    });

    await cart.save();
    console.log(`✅ Cart cleaned up and saved`);
  }

  return cart;
};

/**
 * GET CART
 * Retrieve user's cart by phone number
 * GET /api/cart?phone=+919876543210
 */
const getCart = async (req, res) => {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }
    
    console.log(`📦 Fetching cart for phone: ${phone}`);

    let cart = await Cart.findByPhone(phone);

    if (!cart) {
      // Return empty cart structure
      return res.json({
        success: true,
        data: {
          cart: {
            items: [],
            totalItems: 0,
            totalAmount: 0,
            phone
          }
        },
        message: 'Cart is empty'
      });
    }

    // Clean up any duplicate items
    cart = await cleanupDuplicateItems(cart);

    console.log(`✅ Cart found with ${cart.items.length} items`);
    
    res.json({
      success: true,
      data: {
        cart: {
          _id: cart._id,
          phone: cart.phone,
          items: cart.items,
          totalItems: cart.totalItems,
          totalAmount: parseFloat(cart.totalAmount.toString()),
          updatedAt: cart.updatedAt
        }
      },
      message: 'Cart retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error fetching cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart',
      details: error.message
    });
  }
};

/**
 * ADD TO CART
 * Add product to user's cart
 * POST /api/cart/items
 * Body: { phone, productId, quantity, size }
 */
const addToCart = async (req, res) => {
  try {
    const { phone, productId, quantity = 1, size = 'M' } = req.body;
    
    if (!phone || !productId) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and product ID are required'
      });
    }
    
    console.log(`🛒 Adding product ${productId} to cart for phone: ${phone}`);
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Get or create cart
    const cart = await Cart.createOrGetCart(phone);
    
    // Add item to cart
    await cart.addItem(productId, parseInt(quantity), size, product.price);
    
    // Fetch updated cart with populated data
    const updatedCart = await Cart.findByPhone(phone);
    
    console.log(`✅ Product added to cart. Total items: ${updatedCart.totalItems}`);
    
    res.json({
      success: true,
      data: {
        cart: {
          _id: updatedCart._id,
          phone: updatedCart.phone,
          items: updatedCart.items,
          totalItems: updatedCart.totalItems,
          totalAmount: parseFloat(updatedCart.totalAmount.toString()),
          updatedAt: updatedCart.updatedAt
        }
      },
      message: 'Product added to cart successfully'
    });
    
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add product to cart',
      details: error.message
    });
  }
};

/**
 * UPDATE CART ITEM
 * Update quantity of item in cart
 * PUT /api/cart/items
 * Body: { phone, productId, size, quantity }
 */
const updateCartItem = async (req, res) => {
  try {
    const { phone, productId, size, quantity } = req.body;

    if (!phone || !productId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Phone, product ID, size, and quantity are required'
      });
    }

    console.log(`📝 Updating cart item ${productId} (${size}) to quantity ${quantity} for phone: ${phone}`);

    const cart = await Cart.findByPhone(phone);
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    await cart.updateQuantity(productId, size, parseInt(quantity));
    
    // Fetch updated cart
    const updatedCart = await Cart.findByPhone(phone);
    
    console.log(`✅ Cart item updated. Total items: ${updatedCart.totalItems}`);
    
    res.json({
      success: true,
      data: {
        cart: {
          _id: updatedCart._id,
          phone: updatedCart.phone,
          items: updatedCart.items,
          totalItems: updatedCart.totalItems,
          totalAmount: parseFloat(updatedCart.totalAmount.toString()),
          updatedAt: updatedCart.updatedAt
        }
      },
      message: 'Cart item updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error updating cart item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart item',
      details: error.message
    });
  }
};

/**
 * REMOVE FROM CART
 * Remove item from cart
 * DELETE /api/cart/items
 * Body: { phone, productId, size }
 */
const removeFromCart = async (req, res) => {
  try {
    const { phone, productId, size } = req.body;
    
    if (!phone || !productId) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and product ID are required'
      });
    }
    
    console.log(`🗑️ Removing product ${productId} (${size || 'all sizes'}) from cart for phone: ${phone}`);
    
    const cart = await Cart.findByPhone(phone);
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    await cart.removeItem(productId, size);
    
    // Fetch updated cart
    const updatedCart = await Cart.findByPhone(phone);
    
    console.log(`✅ Product removed from cart. Total items: ${updatedCart.totalItems}`);
    
    res.json({
      success: true,
      data: {
        cart: {
          _id: updatedCart._id,
          phone: updatedCart.phone,
          items: updatedCart.items,
          totalItems: updatedCart.totalItems,
          totalAmount: parseFloat(updatedCart.totalAmount.toString()),
          updatedAt: updatedCart.updatedAt
        }
      },
      message: 'Product removed from cart successfully'
    });
    
  } catch (error) {
    console.error('❌ Error removing from cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove product from cart',
      details: error.message
    });
  }
};

/**
 * CLEAR CART
 * Clear all items from cart
 * DELETE /api/cart/clear
 * Body: { phone }
 */
const clearCart = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }
    
    console.log(`🧹 Clearing cart for phone: ${phone}`);
    
    const cart = await Cart.findByPhone(phone);
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    await cart.clearCart();
    
    console.log(`✅ Cart cleared for phone: ${phone}`);
    
    res.json({
      success: true,
      data: {
        cart: {
          _id: cart._id,
          phone: cart.phone,
          items: [],
          totalItems: 0,
          totalAmount: 0,
          updatedAt: new Date()
        }
      },
      message: 'Cart cleared successfully'
    });
    
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart',
      details: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';

// Cart item interface
export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
    price: {
      $numberDecimal: string;
    };
    currency: string;
    brand: string | {
      _id: string;
      name: string;
      logo_url?: string;
    };
    description?: string;
    tags: string[];
  };
  quantity: number;
  size: string;
  addedAt: string;
  priceAtAdd: {
    $numberDecimal: string;
  };
}

// Cart data interface
export interface CartData {
  _id?: string;
  phone: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  updatedAt?: string;
}

// Cart context interface
interface CartContextType {
  cart: CartData;
  loading: boolean;
  error: string | null;
  
  // Cart operations
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number, size?: string) => Promise<void>;
  updateQuantity: (productId: string, size: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string, size?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Helper functions
  getItemCount: () => number;
  getCartTotal: () => number;
  isInCart: (productId: string, size?: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Default empty cart
const defaultCart: CartData = {
  phone: '',
  items: [],
  totalItems: 0,
  totalAmount: 0
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userData } = useUser();
  const [cart, setCart] = useState<CartData>(defaultCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API base URL
  const API_BASE = 'http://localhost:5002/api/cart';

  // Get phone number (with fallback)
  const getPhoneNumber = () => userData.phoneNumber || '+919876543210';

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const phoneNumber = getPhoneNumber();
      console.log('🛒 Fetching cart for phone:', phoneNumber);
      
      const response = await fetch(`${API_BASE}?phone=${encodeURIComponent(phoneNumber)}`);
      const result = await response.json();
      
      console.log('🛒 Cart API response:', result);
      
      if (result.success) {
        setCart(result.data.cart);
        console.log('✅ Cart loaded:', result.data.cart.totalItems, 'items');
      } else {
        setError(result.error || 'Failed to fetch cart');
        console.error('❌ Failed to fetch cart:', result.error);
      }
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      setError('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId: string, quantity: number = 1, size: string = 'M') => {
    try {
      setLoading(true);
      setError(null);
      
      const phoneNumber = getPhoneNumber();
      console.log(`🛒 Adding product ${productId} to cart (${quantity}x, size: ${size})`);
      
      const response = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          productId,
          quantity,
          size
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCart(result.data.cart);
        console.log('✅ Product added to cart. Total items:', result.data.cart.totalItems);
      } else {
        setError(result.error || 'Failed to add to cart');
        console.error('❌ Failed to add to cart:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      setError('Failed to add to cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, size: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const phoneNumber = getPhoneNumber();
      console.log(`🛒 Updating cart item ${productId} (${size}) to quantity ${quantity}`);
      
      const response = await fetch(`${API_BASE}/items`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          productId,
          size,
          quantity
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCart(result.data.cart);
        console.log('✅ Cart item updated. Total items:', result.data.cart.totalItems);
      } else {
        setError(result.error || 'Failed to update cart');
        console.error('❌ Failed to update cart:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error updating cart:', error);
      setError('Failed to update cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string, size?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const phoneNumber = getPhoneNumber();
      console.log(`🛒 Removing product ${productId} (${size || 'all sizes'}) from cart`);
      
      const response = await fetch(`${API_BASE}/items`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          productId,
          size
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCart(result.data.cart);
        console.log('✅ Product removed from cart. Total items:', result.data.cart.totalItems);
      } else {
        setError(result.error || 'Failed to remove from cart');
        console.error('❌ Failed to remove from cart:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error removing from cart:', error);
      setError('Failed to remove from cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const phoneNumber = getPhoneNumber();
      console.log('🛒 Clearing cart');
      
      const response = await fetch(`${API_BASE}/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCart(result.data.cart);
        console.log('✅ Cart cleared');
      } else {
        setError(result.error || 'Failed to clear cart');
        console.error('❌ Failed to clear cart:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      setError('Failed to clear cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getItemCount = () => cart.totalItems;
  
  const getCartTotal = () => cart.totalAmount;
  
  const isInCart = (productId: string, size?: string) => {
    if (size) {
      return cart.items.some(item => 
        item.product._id === productId && item.size === size
      );
    }
    return cart.items.some(item => item.product._id === productId);
  };

  // Load cart when user changes
  useEffect(() => {
    if (userData.phoneNumber) {
      fetchCart();
    }
  }, [userData.phoneNumber]);

  const value: CartContextType = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemCount,
    getCartTotal,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

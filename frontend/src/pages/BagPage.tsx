import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const BagPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading, error, updateQuantity, removeFromCart, fetchCart } = useCart();

  // Load cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Helper function to safely get brand name
  const getBrandName = (brand: string | { _id: string; name: string; logo_url?: string }): string => {
    if (typeof brand === 'string') {
      return brand;
    }
    if (typeof brand === 'object' && brand && 'name' in brand) {
      return brand.name;
    }
    return 'Unknown Brand';
  };

  const handleStartShopping = () => {
    navigate('/');
  };

  const handleQuantityChange = async (productId: string, size: string, change: number) => {
    try {
      const currentItem = cart.items.find(item =>
        item.product._id === productId && item.size === size
      );

      if (currentItem) {
        const newQuantity = Math.max(1, currentItem.quantity + change);
        await updateQuantity(productId, size, newQuantity);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (productId: string, size: string) => {
    try {
      await removeFromCart(productId, size);
      // Refresh cart to ensure UI is updated
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        cartItems: cart.items,
        total: cart.totalAmount,
        directBuy: false
      }
    });
  };

  const isEmpty = cart.items.length === 0;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft size={24} className="text-white hover:text-blue-400 transition-colors" />
            </button>
            <h1 className="text-xl font-bold">Your Bag</h1>
          </div>

        </div>
      </div>

      {/* Content */}
      {loading ? (
        /* Loading State */
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Loading your bag...</p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-white text-lg mb-4">Failed to load bag</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => fetchCart()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : isEmpty ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="relative mb-8">
          {/* Animated rays */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-8 bg-blue-400 rounded-full opacity-60"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-40px)`,
                  animation: `pulse 2s infinite ${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          
          {/* Shopping bag icon */}
          <div className="relative z-10 w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
            </svg>
            {/* Sad face */}
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
              <div className="text-xs text-gray-400">☹</div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2 text-center">Your bag's feeling left out.</h2>
        <p className="text-gray-400 text-center mb-8 max-w-sm">
          Fill it with pieces that matches your vibe.
        </p>

          <button
            onClick={handleStartShopping}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Start shopping
          </button>
        </div>
      ) : (
        /* Cart Items */
        <div className="flex-1 px-4 py-6">
          <div className="space-y-4 mb-6">
            {cart.items.map((item, index) => (
              <div key={`${item.product._id}-${item.size}-${index}`} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={item.product.images && item.product.images.length > 0
                      ? item.product.images[0]
                      : 'https://via.placeholder.com/80x80?text=No+Image'}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{item.product.name}</h3>
                    <p className="text-sm text-gray-400">{getBrandName(item.product.brand)}</p>
                    <p className="text-sm text-gray-400">Size: {item.size}</p>
                    <p className="text-lg font-bold text-white mt-1">
                      ₹{parseFloat(item.priceAtAdd.$numberDecimal).toLocaleString('en-IN')}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.product.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      onClick={() => handleRemoveItem(item.product._id, item.size)}
                      className="p-1 text-red-400 hover:text-red-300"
                      title="Remove from cart"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.size, -1)}
                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.size, 1)}
                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkout Button - Fixed at bottom */}
      {!isEmpty && !loading && (
        <div className="px-4 py-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-white">Total: ₹{cart.totalAmount.toLocaleString('en-IN')}</span>
            <span className="text-sm text-gray-400">{cart.totalItems} item{cart.totalItems > 1 ? 's' : ''}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1) rotate(var(--rotation)) translateY(-40px); }
          50% { opacity: 0.8; transform: scale(1.1) rotate(var(--rotation)) translateY(-40px); }
        }
      `}</style>
    </div>
  );
};

export default BagPage;
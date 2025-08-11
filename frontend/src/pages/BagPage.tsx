import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const HEADER_H = 64;   // px
const FOOTER_H = 104;  // px (match your bottom tab height + padding)

const BagPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, loading, error, updateQuantity, removeFromCart, fetchCart } = useCart();

  // ✅ make sure we fetch only once per mount
  const didFetchRef = useRef(false);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current || inFlightRef.current) return;
    didFetchRef.current = true;
    inFlightRef.current = true;

    (async () => {
      try {
        await fetchCart();
      } finally {
        inFlightRef.current = false;
      }
    })();
  }, [fetchCart]);

  const getBrandName = (brand: any) =>
    typeof brand === 'string' ? brand : brand?.name ?? 'Unknown Brand';

  const handleQuantityChange = async (productId: string, size: string, change: number) => {
    const it = cart.items.find(i => i.product._id === productId && i.size === size);
    if (!it) return;
    await updateQuantity(productId, size, Math.max(0, it.quantity + change));
  };

  const handleRemoveItem = async (productId: string, size: string) => {
    await removeFromCart(productId, size);
    // optional: do NOT refetch here if your context already returns the updated cart
    // await fetchCart();
  };

  const handleCheckout = () => {
    navigate('/checkout', {
      state: { cartItems: cart.items, total: cart.totalAmount, directBuy: false }
    });
  };

  const isEmpty = cart.items.length === 0;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Fixed Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800 max-w-[413px] mx-auto px-4 flex items-center"
        style={{ height: HEADER_H }}
      >
        <button onClick={() => navigate(-1)} className="p-1 mr-3">
          <ArrowLeft size={24} className="text-white hover:text-blue-400 transition-colors" />
        </button>
        <h1 className="text-xl font-bold">Your Bag</h1>
      </header>

      {/* Scrollable content */}
      <main
        className="px-4 overflow-y-auto"
        style={{
          paddingTop: HEADER_H + 8,
          paddingBottom: isEmpty ? 16 : FOOTER_H + 16,
          minHeight: `calc(100vh - ${HEADER_H + (isEmpty ? 0 : FOOTER_H)}px)`
        }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
            <p className="text-lg">Loading your bag...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <p className="text-lg mb-2">Failed to load bag</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => {
                if (inFlightRef.current) return;
                inFlightRef.current = true;
                fetchCart().finally(() => (inFlightRef.current = false));
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 text-center">Your bag's feeling left out.</h2>
            <p className="text-gray-400 text-center mb-8 max-w-sm">Fill it with pieces that match your vibe.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full"
            >
              Start shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {cart.items.map((item, index) => (
              <div key={`${item.product._id}-${item.size}-${index}`} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={item.product.images?.[0] || 'https://via.placeholder.com/80x80?text=No+Image'}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-400">{getBrandName(item.product.brand)}</p>
                    <p className="text-sm text-gray-400">Size: {item.size}</p>
                    <p className="text-lg font-bold mt-1">
                      ₹{parseFloat(item.priceAtAdd.$numberDecimal).toLocaleString('en-IN')}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.product.tags.slice(0, 2).map((tag: string, i: number) => (
                        <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded">
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
                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.size, 1)}
                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Fixed Footer (checkout) */}
      {!isEmpty && !loading && (
        <footer
          className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 border-t border-gray-700 px-4 py-4 max-w-[413px] mx-auto pb-[10.5rem]"
          style={{ height: FOOTER_H }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold">Total: ₹{cart.totalAmount.toLocaleString('en-IN')}</span>
            <span className="text-sm text-gray-300">
              {cart.totalItems} item{cart.totalItems > 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full "
          >
            Proceed to Checkout
          </button>
        </footer>
      )}
    </div>
  );
};

export default BagPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';

interface Product {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  price: {
    $numberDecimal: string;
  };
  currency: string;
  brand: {
    _id: string;
    name: string;
    logo_url?: string;
  };
  tags: string[];
}

interface CuratedList {
  _id: string;
  userId: string;
  products: Product[];
  name: string;
  createdAt: string;
}

const CuratedListPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const { addToCart } = useCart();
  const [curatedList, setCuratedList] = useState<CuratedList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  if (userData.isLoggedIn && userData._id) {
    fetchCuratedList(userData._id);
  } else {
    setLoading(false);
  }
}, [userData]);


 const fetchCuratedList = async (userId: string) => {
  try {
    console.log("🔍 Fetching curated list for userId:", userId);

    const response = await fetch(`http://casa-backend-uf0h.onrender.com/api/curatedlist/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      setCuratedList(null);
      setLoading(false);
      return;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch curated list');
    }

    const data = await response.json();
    setCuratedList(data);
  } catch (err) {
    console.error('Error fetching curated list:', err);
    setError(err instanceof Error ? err.message : 'Failed to load curated list');
  } finally {
    setLoading(false);
  }
};

// const handleCuratedToggle = async (productId: string) => {
//   console.log('💖 Heart clicked! Product ID:', productId);
//   console.log('👤 User logged in:', userData.isLoggedIn);
//   console.log('📋 Current curated items:', Array.from(curatedItems));

//   if (!userData.isLoggedIn) {
//     console.log('❌ User not logged in, redirecting to profile');
//     navigate('/profile');
//     return;
//   }

//   try {
//     const userId = userData._id;
//     const isCurrentlyInList = curatedItems.has(productId);

//     // Immediate UI update
//     if (!isCurrentlyInList) {
//       setCuratedItems(prev => new Set(prev).add(productId));
//     }

//     if (isCurrentlyInList) {
//       const response = await fetch('http://casa-backend-uf0h.onrender.com/api/curatedlist/remove', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, productId }),
//       });

//       if (response.ok) {
//         window.dispatchEvent(new CustomEvent('curatedListUpdated'));
//         console.log('✅ Removed from curated list');
//         setCuratedItems(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(productId);
//           return newSet;
//         });
//       } else {
//         console.error('❌ Failed to remove');
//         setCuratedItems(prev => new Set(prev).add(productId));
//       }
//     } else {
//       const response = await fetch('http://casa-backend-uf0h.onrender.com/api/curatedlist/add', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, productId }),
//       });

//       if (response.ok) {
//         window.dispatchEvent(new CustomEvent('curatedListUpdated'));
//         console.log('✅ Added to curated list');
//       } else {
//         console.error('❌ Failed to add');
//         setCuratedItems(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(productId);
//           return newSet;
//         });
//       }
//     }
//   } catch (error) {
//     console.error('❌ Error in curated toggle:', error);
//   }
// };

  const removeFromCuratedList = async (productId: string) => {
    try {
      const userId = userData._id
      const response = await fetch('http://casa-backend-uf0h.onrender.com/api/curatedlist/remove', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer dummy-token', // Dummy token for backend
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove product from curated list');
      }

      // Update local state
      setCuratedList(prev => {
        if (!prev) return null;
        return {
          ...prev,
          products: prev.products.filter(product => product._id !== productId)
        };
      });
    } catch (err) {
      console.error('Error removing product:', err);
      alert('Failed to remove product from curated list');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1, 'M'); // Default size M, quantity 1
      alert('Product added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!userData.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-2xl font-bold mb-2">Sign in to view your curated list</h2>
          <p className="text-gray-400 mb-6">Save your favorite products and access them anytime</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="sticky top-0 bg-gray-900 z-10 p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <button onClick={handleBack}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">My Curated List</h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading your curated list...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="sticky top-0 bg-gray-900 z-10 p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <button onClick={handleBack}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">My Curated List</h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-400">
            <p>Error: {error}</p>
            <button
onClick={() => fetchCuratedList(userData._id)}

              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="sticky top-0 bg-gray-900 z-10 p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={handleBack}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">My Curated List</h1>
        </div>
      </div>

      <div className="p-4">
        {!curatedList || curatedList.products.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-xl font-bold mb-2">Your curated list is empty</h2>
            <p className="text-gray-400 mb-6">Start adding products you love by tapping the heart icon</p>
            <button
              onClick={() => navigate('/swipe')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Discover Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {curatedList.products.map((product) => (
              <motion.div
                key={product._id}
                className="bg-gray-800 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <div className="relative">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/200'}
                    alt={product.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                  <button
                    onClick={() => removeFromCuratedList(product._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-400 mb-2">{product.brand.name}</p>
                  <p className="font-bold mb-3">
                    {product.currency}{product.price.$numberDecimal}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CuratedListPage;

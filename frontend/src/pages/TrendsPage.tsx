import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, User, ArrowLeft } from 'lucide-react';

const TrendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState<'M' | 'W'>('M');
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

  const trendingProducts = [
    {
      id: 'bonkers-corner-1',
      brand: 'Bonkers Corner',
      name: 'Bunny Time Hoodie',
      price: '₹1,899',
      originalPrice: '₹2,499',
      discount: '24% off',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'TRY \'N BUY'
    },
    {
      id: 'bonkers-corner-2',
      brand: 'Bonkers Corner',
      name: 'Players only Hoodie',
      price: '₹1,999',
      originalPrice: '₹2,109',
      discount: '9% off',
      image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'TRY \'N BUY'
    },
    {
      id: 'oversized-energy-1',
      brand: 'Oversized Energy',
      name: 'Bold Feels Chill Tee',
      price: '₹1,299',
      originalPrice: '₹1,799',
      discount: '28% off',
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'NEW ARRIVAL'
    },
    {
      id: 'aesthetic-bodies-1',
      brand: 'Aesthetic Bodies',
      name: 'Minimalist Tee',
      price: '₹899',
      originalPrice: '₹1,299',
      discount: '31% off',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'TRENDING'
    }
  ];

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleLikeToggle = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
    // Just toggle the like state (no navigation needed)
  };

  const handleGenderChange = (gender: 'M' | 'W') => {
    setSelectedGender(gender);
  };

  const handleShopNow = () => {
    navigate('/collection?style=beach&category=summer');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen pb-20">
      {/* Top Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/')} className="p-1">
              <ArrowLeft size={24} className="text-white hover:text-blue-400 transition-colors" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/search')} className="p-1">
              <Search size={20} className="text-white hover:text-blue-400 transition-colors" />
            </button>

            <button onClick={() => navigate('/profile')} className="p-1">
              <User size={20} className="text-white hover:text-blue-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* User Selection */}
      <div className="flex items-center justify-center space-x-4 px-4 py-4">
        <button
          onClick={() => handleGenderChange('M')}
          className="flex items-center space-x-2"
        >
          <img
            src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100"
            alt="Man"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedGender === 'M' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
          }`}>M</span>
        </button>
        <button
          onClick={() => handleGenderChange('W')}
          className="flex items-center space-x-2"
        >
          <span className={`px-3 py-1 text-sm font-medium transition-colors ${
            selectedGender === 'W' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
          }`}>W</span>
          <img
            src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100"
            alt="Woman"
            className="w-8 h-8 rounded-full object-cover"
          />
        </button>
      </div>

      {/* Header */}
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold mb-2">Trends for {selectedGender === 'M' ? 'Men' : 'Women'}</h1>
        <p className="text-gray-400 text-sm mb-2">Stay ahead of the style curve with curated trends.</p>
        <p className="text-gray-400 text-sm">Your guide to what's hot now!</p>
      </div>

      {/* Featured Trend */}
      <div className="px-4 mb-6">
        <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl overflow-hidden h-48">
          <div className="absolute top-4 left-4 z-10">
            <h3 className="text-2xl font-bold text-white">BEACH</h3>
            <h3 className="text-2xl font-bold text-white">CODE?</h3>
          </div>
          <div className="absolute top-4 right-4 z-10">
            <p className="text-xs text-white bg-black bg-opacity-30 px-2 py-1 rounded">COASTLINE</p>
            <p className="text-xs text-white bg-black bg-opacity-30 px-2 py-1 rounded mt-1">ENERGY</p>
          </div>
          <div className="absolute bottom-4 left-4 z-10">
            <p className="text-xs text-white bg-black bg-opacity-30 px-2 py-1 rounded">JULY</p>
            <p className="text-xs text-white bg-black bg-opacity-30 px-2 py-1 rounded">2025</p>
          </div>
          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={handleShopNow}
              className="bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              SHOP NOW →
            </button>
          </div>
          <img
            src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Beach style model"
            className="absolute right-0 top-0 h-full w-auto object-cover"
          />
        </div>
      </div>

      {/* Trending Products */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-80 text-white px-2 py-1 rounded text-xs font-bold">
                  {product.badge}
                </div>

              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm text-white mb-1">{product.brand}</h3>
                <p className="text-gray-400 text-xs mb-2">{product.name}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold text-sm">{product.price}</span>
                  <span className="text-gray-500 line-through text-xs">{product.originalPrice}</span>
                  <span className="text-green-400 text-xs font-medium">{product.discount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;
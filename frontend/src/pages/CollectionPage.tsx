import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Heart, User, ArrowLeft } from 'lucide-react';

const CollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('MAN');
  const [activeCategory, setActiveCategory] = useState('Brands');

  // Initialize state from URL params
  useEffect(() => {
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');

    if (gender) {
      setActiveTab(gender.toUpperCase());
    }
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const categories = [
    { id: 'Brands', label: 'Brands' },
    { id: 'TopWear', label: 'Top Wear' },
    { id: 'BottomWear', label: 'Bottom Wear' },
    { id: 'CoOrds', label: 'Co-Ords' },
    { id: 'Athleisure', label: 'Athleisure' },
  ];

  const brands = [
    { id: 'a47', name: 'A47', logo: 'A47', bg: 'bg-white text-black' },
    { id: 'aesthetic-bodies', name: 'Aesthetic Bodies', logo: '△', bg: 'bg-white text-black' },
    { id: 'bad-teddy', name: 'Bad Teddy', logo: 'Bad Teddy', bg: 'bg-white text-black' },
    { id: 'beegles', name: 'Beegles', logo: 'EE', bg: 'bg-black text-white' },
    { id: 'bene-kleed', name: 'Bene Kleed', logo: 'Bene kleed', bg: 'bg-white text-black' },
    { id: 'bodyssey', name: 'Bodyssey', logo: 'B', bg: 'bg-white text-black' },
    { id: 'bonkers-corner', name: 'Bonkers Corner', logo: 'BONKERS CORNER', bg: 'bg-black text-white' },
    { id: 'hummer', name: 'Hummer', logo: 'hummer', bg: 'bg-yellow-400 text-black' },
  ];

  const handleBrandClick = (brandId: string) => {
    navigate(`/products?brand=${brandId}`);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    navigate(`/collection?category=${categoryId}&gender=${activeTab.toLowerCase()}`);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/collection?category=${activeCategory}&gender=${tab.toLowerCase()}`);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen pb-20">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/')} className="p-1">
              <ArrowLeft size={24} className="text-white hover:text-blue-400 transition-colors" />
            </button>
            <h1 className="text-2xl font-bold">Collection</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/search')} className="p-1">
              <Search size={20} className="text-white hover:text-blue-400 transition-colors" />
            </button>
            <button onClick={() => navigate('/wishlist')} className="p-1">
              <Heart size={20} className="text-white hover:text-red-400 transition-colors" />
            </button>
            <button onClick={() => navigate('/profile')} className="p-1">
              <User size={20} className="text-white hover:text-blue-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {['MAN', 'WOMAN', 'ALL BRANDS'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-20 bg-gray-800 min-h-screen">
          <div className="py-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`w-full p-3 text-xs font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.id === 'Brands' && (
                  <div className="bg-blue-600 text-white p-2 rounded mb-1 text-center">
                    BRANDS
                  </div>
                )}
                {category.id === 'TopWear' && (
                  <img
                    src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Top Wear"
                    className="w-full h-12 object-cover rounded mb-1"
                  />
                )}
                {category.id === 'BottomWear' && (
                  <img
                    src="https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Bottom Wear"
                    className="w-full h-12 object-cover rounded mb-1"
                  />
                )}
                {category.id === 'CoOrds' && (
                  <img
                    src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Co-Ords"
                    className="w-full h-12 object-cover rounded mb-1"
                  />
                )}
                {category.id === 'Athleisure' && (
                  <img
                    src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Athleisure"
                    className="w-full h-12 object-cover rounded mb-1"
                  />
                )}
                <span className="block text-xs">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <h2 className="text-xl font-bold mb-4">Brands</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {brands.map((brand) => (
              <button
                key={brand.id}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-center p-4 hover:scale-105 transition-transform ${brand.bg}`}
                onClick={() => handleBrandClick(brand.id)}
              >
                <div className="text-lg font-bold mb-2 leading-tight">{brand.logo}</div>
                <div className="text-xs font-medium">{brand.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Heart, User, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface Brand {
  _id: string;
  name: string;
  logo_url?: string;
  gender?: string; // 'MAN', 'WOMAN', or 'ALL'
  is_active: boolean;
}

const CollectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('ALL BRANDS');
  const [activeCategory, setActiveCategory] = useState('Brands');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    if (gender) setActiveTab(gender.toUpperCase());
    if (category) setActiveCategory(category);
  }, [searchParams]);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        const res = await axios.get('http://casa-backend-uf0h.onrender.com/api/brands');
        const data = res.data;
        setBrands(data.filter((b: Brand) => b.is_active));
      } catch (err) {
        setBrands([]);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter(brand => {
    if (activeTab === 'ALL BRANDS') return true;
    if (brand.gender === 'ALL') return true;
    return brand.gender === activeTab;
  });

  const categories = [
    { id: 'Brands', label: 'Brands' },
    { id: 'TopWear', label: 'Top Wear' },
    { id: 'BottomWear', label: 'Bottom Wear' },
    { id: 'CoOrds', label: 'Co-Ords' },
    { id: 'Athleisure', label: 'Athleisure' },
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
    <div className="bg-gray-900 text-white min-h-screen pt-5">
      <div className="px-5 border-b border-gray-800">
        <div className="flex items-center justify-between mb-5">
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
            <button onClick={() => navigate('/curatedList')} className="p-1">
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
            {loadingBrands ? (
              <div className="col-span-2 text-center text-gray-400">Loading brands...</div>
            ) : filteredBrands.length === 0 ? (
              <div className="col-span-2 text-center text-gray-400">No brands found.</div>
            ) : (
              filteredBrands.map((brand) => (
                <button
                  key={brand._id}
                  className="aspect-square rounded-2xl flex flex-col items-center justify-center text-center p-4 hover:scale-105 transition-transform bg-gray-800"
                  onClick={() => navigate(`/products?brand=${brand._id}`)}
                >
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="w-16 h-16 object-contain mb-2 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-700 flex items-center justify-center rounded-full mb-2">
                      <span className="text-xs text-gray-300">No Logo</span>
                    </div>
                  )}
                  <div className="text-xs font-medium">{brand.name}</div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
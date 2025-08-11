import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import axios from 'axios'
import {handleSearch} from '../utils/getProducts'

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery, navigate);
  };

  const handlePopularSearch = (search: string) => {
    //popular search recommendations
    setSearchQuery(search);
    handleSearch(search, navigate);
  };

  const handleRecentlyViewedClick = () => {
    navigate('/product/a47-teja-tee');
  };

  const popularSearches = [
    'Relaxed Joggers',
    'Street Shorts',
    'Urban Tees'
  ];

  const recentlyViewed = {
    brand: 'A47',
    name: 'Andaz Apna Apna: Teja€...',
    price: '₹1,599',
    image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'TRY n BUY'
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for 'Baggy jeans'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Your past searches */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Your past searches</h2>
          <button
            onClick={() => navigate('/curatedList')}
            className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
          >
            <Search size={16} className="text-gray-500" />
            <span>Curated List</span>
          </button>
        </div>

        {/* Popular searches */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Popular searches</h2>
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handlePopularSearch(search)}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors"
              >
                <Search size={14} className="text-gray-500" />
                <span className="text-sm">{search}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recently Viewed</h2>
          <button
            onClick={handleRecentlyViewedClick}
            className="w-full bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-750 transition-colors"
          >
            <div className="relative">
              <img
                src={recentlyViewed.image}
                alt={recentlyViewed.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-gray-900 bg-opacity-80 text-white px-2 py-1 rounded text-xs font-bold">
                {recentlyViewed.badge}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Added to curated list');
                }}
                className="absolute top-2 right-2 p-1 bg-gray-900 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div className="p-4 text-left">
              <h3 className="font-bold text-sm text-white mb-1">{recentlyViewed.brand}</h3>
              <p className="text-gray-400 text-xs mb-2">{recentlyViewed.name}</p>
              <span className="text-white font-bold text-sm">{recentlyViewed.price}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
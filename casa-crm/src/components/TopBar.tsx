import React from 'react';
import { Search, User, LogOut } from 'lucide-react';
import { useBrand } from '../contexts/BrandContext';

const TopBar = () => {
  const { brand, logoutBrand } = useBrand();

  return (
    <div className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-400 text-sm font-medium">
            Live updates enabled
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* <button className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors">
            <Search className="w-5 h-5 text-white" />
          </button> */}
          
          <div className="relative group">
            <button className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors">
              {brand?.name ? (
                <img 
                  src={brand.logo_url} 
                  alt={brand.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </button>
            
            {/* User Dropdown */}
            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  {brand?.name ? (
                    <img 
                      src={brand.logo_url} 
                      alt={brand.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-800">{brand?.name}</h3>
                    <p className="text-sm text-slate-600">{brand?.email}</p>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-4">
                  <button
                    onClick={logoutBrand}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
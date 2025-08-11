import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, TrendingUp, UserPlus, BarChart3, ShoppingCart } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    // { path: '/', icon: Home, label: 'Home' },
    { path: '/', icon: Package, label: 'Products' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders'},
    // { path: '/sales', icon: BarChart3, label: 'Sales' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-blue-400 bg-slate-800' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
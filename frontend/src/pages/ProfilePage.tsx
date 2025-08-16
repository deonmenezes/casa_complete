import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  HelpCircle,
  Heart,
  Users,
  Palette,
  User,
  MapPin,
  Gift,
  FileText,
  Shield,
  ChevronRight,
  LogOut
} from 'lucide-react';
import LoginPopup from '../components/LoginPopup';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';


const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  // ENHANCED USER CONTEXT: Now uses logout function and displays collected user details
  const { userData, logout } = useUser();
  const isLoggedIn = userData.isLoggedIn;

  // NAVIGATION FIX: Always go to home page instead of browser back
  const handleBack = () => {
    navigate('/'); // Always navigate to home page
  };

  // MENU ITEM TYPE: Define the structure for menu items with optional logout flag
  type MenuItem = {
    icon: any;
    label: string;
    hasChevron: boolean;
    isLogout?: boolean; // Optional property for logout styling
  };

  const baseMenuItems: MenuItem[] = [
    { icon: Package, label: 'My Orders', hasChevron: false },
    { icon: HelpCircle, label: 'Help & Query', hasChevron: false },

    { icon: Users, label: 'Refer & Earn', hasChevron: false },
    { icon: Palette, label: 'Appearance', hasChevron: true },
    { icon: User, label: 'Manage Account', hasChevron: true },
    { icon: MapPin, label: 'Addresses', hasChevron: true },
    { icon: Gift, label: 'My Offers', hasChevron: true },
    { icon: FileText, label: 'Terms & Conditions', hasChevron: true },
    { icon: Shield, label: 'Privacy Policy', hasChevron: true },
  ];

  // CONDITIONAL MENU: Add logout option only when user is logged in
  const menuItems: MenuItem[] = isLoggedIn
    ? [...baseMenuItems, { icon: LogOut, label: 'Log Out', hasChevron: true, isLogout: true }]
    : baseMenuItems;

  /**
   * IMPROVED LOGOUT: Uses centralized logout function from UserContext
   * This ensures proper cleanup of both state and localStorage
   */
  const handleLogout = () => {
    logout(); // Clears both React state and localStorage
    console.log('User logged out successfully');
  };

  const handleMenuClick = (label: string) => {
    if (label === 'Log Out') {
      handleLogout();
    } else if (!isLoggedIn && ['My Orders', 'Manage Account', 'Addresses', 'My Offers'].includes(label)) {
      // AUTHENTICATION REQUIRED: Show login popup for protected features
      setIsLoginPopupOpen(true);
    } else {
      // NAVIGATION: Navigate to appropriate pages
      switch (label) {
        case 'My Orders':
          navigate('/my-orders');
          break;

        case 'Manage Account':
          navigate('/manage-account'); // NEW: Navigate to manage account page
          break;
        case 'Help & Query':
          navigate('/chat', { state: { autoMessage: true } }); // ✅ NEW: triggers auto-reply
          break;
        case 'Refer & Earn':
          navigate('/'); // Placeholder - redirect to home
          break;
        default:
          console.log(`Menu item clicked: ${label}`);
      }
    }
  };

  const handleSignUp = () => {
    setIsLoginPopupOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginPopupOpen(false);
  };

  const handleLoginContinue = (phoneNumber: string) => {
    console.log('Login with phone number:', phoneNumber);
    // The LoginPopup component now handles user state updates
    setIsLoginPopupOpen(false);
    // Here you would typically make an API call to send OTP
  };

  // Fetch order count when user is logged in
  useEffect(() => {
    const fetchOrderCount = async () => {
      if (isLoggedIn && userData._id) {
        try {
          const response = await axios.get(`http://casa-backend-uf0h.onrender.com/api/orders/user/${userData._id}`);
          if (response.data.success) {
            setOrderCount(response.data.orders.length);
          }
        } catch (error) {
          console.error('Error fetching order count:', error);
        }
      }
    };

    fetchOrderCount();
  }, [isLoggedIn, userData._id]);

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
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-4 py-6">
        <div 
          className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl p-6 relative overflow-hidden"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 rounded-2xl"></div>
          
          <div className="relative z-10">
            {isLoggedIn ? (
              <>
                {/* ENHANCED USER DISPLAY: Shows collected name from onboarding */}
                <h2 className="text-2xl font-bold mb-1">
                  {userData.name || `User ${userData.email?.split('@')[0] || 'User'}` || 'User'}
                </h2>
                {/* EMAIL DISPLAY: Show email as primary identifier */}
                <p className="text-gray-300 text-sm mb-1">
                  {userData.email || 'No email address'}
                </p>
                {/* PHONE NUMBER DISPLAY: Show phone if available */}
                {userData.phoneNumber && (
                  <p className="text-gray-300 text-sm mb-1">
                    {userData.phoneNumber}
                  </p>
                )}
                <p className="text-gray-300 text-sm mb-4">Lvl 00</p>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Level Progress</span>
                    <span className="text-sm text-gray-300">₹10,000</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">₹0</span>
                    <span className="text-xs text-gray-400">Lvl 01</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Total spent</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User size={32} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">Welcome to Your Profile</h2>
                <p className="text-gray-300 text-sm mb-6">Sign up or log in to access your account</p>
                <button
                  onClick={handleSignUp}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
                >
                  Sign Up / Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Package size={20} className="text-gray-400 mr-2" />
              <span className="text-xs text-blue-400 font-medium">Order Count</span>
            </div>
            <p className="text-2xl font-bold">{orderCount}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-xs text-blue-400 font-medium mr-2">Knot cash</span>
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
            </div>
            <p className="text-2xl font-bold">₹0</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.label}
              className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex items-center space-x-3 transition-colors"
              onClick={() => handleMenuClick(item.label)}
            >
              <item.icon size={20} className="text-gray-400" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {menuItems.slice(4).map((item) => (
            <button
              key={item.label}
              className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl p-4 flex items-center justify-between transition-colors"
              onClick={() => handleMenuClick(item.label)}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} className="text-gray-400" />
                <span className={`text-sm font-medium ${
                  item.isLogout ? 'text-red-400' : 'text-white'
                }`}>
                  {item.label}
                </span>
              </div>
              {item.hasChevron && (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Login Popup */}
      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={handleLoginClose}
        onContinue={handleLoginContinue}
      />
    </div>
  );
};

export default ProfilePage;
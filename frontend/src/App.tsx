import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';

import NavShell from './components/NavShell';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import TrendsPage from './pages/TrendsPage';
import BagPage from './pages/BagPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import ManageAccountPage from './pages/ManageAccountPage'; // NEW: Manage Account page
import SearchPage from './pages/SearchPage';

import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import SwipeProductsPage from './pages/SwipeProductsPage';
import AllBrandsPage from './pages/AllBrandsPage';
import BrandPage from './pages/BrandPage';
import OnboardingPage from './pages/OnboardingPage';
import ProductList from './pages/ProductList'


function App() {
  return (
    <div className="mobile-container">
      <UserProvider>
        <CartProvider>
          <Router>
          <div className="min-h-screen bg-gray-900 text-white mobile-scroll">
            <Routes>
              <Route path="/" element={<NavShell />}>
                <Route index element={<HomePage />} />
                <Route path="collection" element={<CollectionPage />} />
                <Route path="trends" element={<TrendsPage />} />
                <Route path="bag" element={<BagPage />} />
                <Route path="swipe" element={<SwipeProductsPage />} />
              </Route>
              <Route path="/brands" element={<AllBrandsPage />} />
              <Route path="/brands/:brandId" element={<BrandPage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/manage-account" element={<ManageAccountPage />} /> {/* NEW: Manage Account route */}
              <Route path="/search" element={<SearchPage />} />

              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Routes>
          </div>
            </Router>
          </CartProvider>
      </UserProvider>
    </div>
  );
}

export default App;
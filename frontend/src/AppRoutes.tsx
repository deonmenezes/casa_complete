import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import NavShell from './components/NavShell';
import RequireAdmin from './components/RequireAdmin';
import AdminLayout from './components/AdminLayout';

import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import TrendsPage from './pages/TrendsPage';
import BagPage from './pages/BagPage';
import WishlistPage from './pages/WishlistPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import ManageAccountPage from './pages/ManageAccountPage';
import SearchPage from './pages/SearchPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import SwipeProductsPage from './pages/SwipeProductsPage';
import AllBrandsPage from './pages/AllBrandsPage';
import BrandPage from './pages/BrandPage';
import OnboardingPage from './pages/OnboardingPage';
import ProductList from './pages/ProductList';
import ProductsPage from './pages/ProductsPage';
import Home from './pages/crm/Home';

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
    
  useEffect(() => {
    if (!isAdminRoute) {
      import('./index.css'); 
    }
  }, [isAdminRoute]);

  return (
    <div className={isAdminRoute ? '' : 'max-w-[414px] mx-auto bg-gray-900 text-white min-h-screen'}>
      <Routes>
        {/* Client Side Routes */}
        <Route path="/" element={<NavShell />}>
          <Route index element={<HomePage />} />
          <Route path="collection" element={<CollectionPage />} />
          <Route path="trends" element={<TrendsPage />} />
          <Route path="bag" element={<BagPage />} />
          <Route path="swipe" element={<SwipeProductsPage />} />
          <Route path="/brands" element={<AllBrandsPage />} />
          <Route path="/brands/:brandId" element={<BrandPage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:categoryId" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Route>

        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/manage-account" element={<ManageAccountPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default AppRoutes;

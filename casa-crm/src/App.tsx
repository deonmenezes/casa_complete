import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BrandProvider } from './contexts/BrandContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import BrandSignup from './pages/BrandSignup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import RegisterBrand from './pages/RegisterBrand';
import Sales from './pages/Sales';
import AddProduct from './pages/AddProduct';
import CreateBrandForm from './pages/CreateBrand'
import Order from './pages/Order'

function App() {
  return (
    <BrandProvider>
      <Router>
        <div className="min-h-screen bg-slate-800">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<BrandSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              {/* <Route index element={<Dashboard />} /> */}
              <Route index element={<Products />} />
              <Route path="orders" element={<Order />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="register-brand" element={<RegisterBrand />} />
              {/* <Route path="sales" element={<Sales />} /> */}
              <Route path="create-brand" element={<CreateBrandForm />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </BrandProvider>
  );
}

export default App;
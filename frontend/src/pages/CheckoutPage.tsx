import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

// Type definitions
interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image?: string;
  images?: string[];
  selectedSize?: string;
  quantity?: number;
}

interface Address {
  id: number;
  name: string;
  address: string;
  phone: string;
}

interface PaymentMethod {
  id: number;
  type: string;
  name: string;
  icon: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const { cart } = useCart();
  const { product, bagItems, total, directBuy } = location.state || {};

  const fallbackBagItems = cart?.items || [];

  // Safely calculate fallback total from cart.items
  const fallbackTotal = fallbackBagItems.reduce((sum, item) => {
    const price = parseFloat(item.product.price.$numberDecimal);
    return sum + price * (item.quantity || 1);
  }, 0);

  // Convert CartItem[] into Product[]
  const mappedCartItems: Product[] = fallbackBagItems.map((item) => ({
    id: item.product._id,
    name: item.product.name,
    brand: typeof item.product.brand === 'string' ? item.product.brand : item.product.brand.name,
    price: `₹${parseFloat(item.product.price.$numberDecimal).toFixed(2)}`,
    images: item.product.images,
    selectedSize: item.size,
    quantity: item.quantity,
  }));

  const orderItems: Product[] =
    directBuy && product
      ? [product]
      : bagItems
      ? bagItems
      : mappedCartItems;

  const orderTotal: number =
    total ||
    (product
      ? parseInt(product.price.replace('₹', '').replace(',', ''))
      : fallbackTotal);

  const addresses: Address[] = [
    {
      id: 1,
      name: 'Home',
      address: 'Shreepal Complex, Suren Road, Andheri East, Mumbai - 400093',
      phone: '+91 98765 43210'
    },
    {
      id: 2,
      name: 'Office',
      address: 'Tech Park, Powai, Mumbai - 400076',
      phone: '+91 98765 43210'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: 1, type: 'UPI', name: 'PhonePe / Google Pay / Paytm', icon: '📱' },
    { id: 2, type: 'Card', name: 'Credit / Debit Card', icon: '💳' },
    { id: 3, type: 'COD', name: 'Cash on Delivery', icon: '💵' }
  ];

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/order-success', {
        state: {
          orderId: 'ORD' + Date.now(),
          items: orderItems,
          total: orderTotal,
          address: addresses[selectedAddress]
        }
      });
    }, 2000);
  };

  return (
    <div className="relative max-w-md mx-auto min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <div className="pb-24">
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft size={24} className="text-white hover:text-blue-400 transition-colors" />
            </button>
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <MapPin size={20} className="text-blue-400" />
              <span>Delivery Address</span>
            </h2>
            <div className="space-y-3">
              {addresses.map((address, index) => (
                <button
                  key={address.id}
                  onClick={() => setSelectedAddress(index)}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    selectedAddress === index
                      ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-white">{address.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{address.address}</p>
                      <p className="text-sm text-gray-400">{address.phone}</p>
                    </div>
                    {selectedAddress === index && (
                      <CheckCircle size={20} className="text-blue-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src={item.image || (item.images && item.images[0]) || 'https://placehold.co/100x100/1f2937/ffffff?text=Item'}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/100x100/1f2937/ffffff?text=Error';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.brand}</h3>
                    <p className="text-xs text-gray-400">{item.name}</p>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.price}</p>
                    {item.quantity && item.quantity > 1 && (
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{orderTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <CreditCard size={20} className="text-green-400" />
              <span>Payment Method</span>
            </h2>
            <div className="space-y-3">
              {paymentMethods.map((method, index) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(index)}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    selectedPayment === index
                      ? 'border-green-500 bg-green-500 bg-opacity-10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <h3 className="font-medium text-white">{method.type}</h3>
                        <p className="text-sm text-gray-400">{method.name}</p>
                      </div>
                    </div>
                    {selectedPayment === index && (
                      <CheckCircle size={20} className="text-green-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Truck size={16} className="text-blue-400" />
              <span className="text-sm font-medium">Delivery Information</span>
            </div>
            <p className="text-xs text-gray-400">
              Expected delivery in 2-3 business days. Free delivery on orders above ₹1,500.
            </p>
          </div>
        </div>
      </div>

      {/* Place Order */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : `Place Order - ₹${orderTotal}`}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
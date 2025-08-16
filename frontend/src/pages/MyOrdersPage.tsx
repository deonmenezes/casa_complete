import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

interface OrderProduct {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  name: string;
  quantity: number;
  price: number;
  size: string;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    display_name: string;
    email: string;
    phone: string;
  };
  products: OrderProduct[];
  deliveryStatus: string;
  paymentStatus: string;
  totalAmount: number;
  address: string;
  estimatedDelivery: string;
  createdAt: string;
  paymentId?: string;
}

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userData._id) {
        setError('User not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://casa-backend-uf0h.onrender.com/api/orders/user/${userData._id}`);
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userData._id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'Out for Delivery':
      case 'Shipped':
        return <Truck size={20} className="text-blue-500" />;
      case 'Processing':
      case 'Accepted':
        return <Clock size={20} className="text-yellow-500" />;
      case 'Cancelled':
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return <Package size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-500';
      case 'Out for Delivery':
      case 'Shipped':
        return 'text-blue-500';
      case 'Processing':
      case 'Accepted':
        return 'text-yellow-500';
      case 'Cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleBack = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen">
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">My Orders</h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white min-h-screen">
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">My Orders</h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <button onClick={handleBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">My Orders</h1>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 py-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-800 rounded-xl p-4">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-semibold">{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Order Date</p>
                    <p className="text-sm">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-3 mb-4">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2 bg-gray-700 rounded-lg p-3">
                      <img
                        src={product.product.images?.[0] || 'https://via.placeholder.com/60'}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg mb-2"
                      />
                      <div className="w-full text-center">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-400">
                          Size: {product.size} | Qty: {product.quantity}
                        </p>
                        <p className="text-sm text-gray-400">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Amount:</span>
                    <span className="font-semibold">₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Status:</span>
                    <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Delivery Status:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.deliveryStatus)}
                      <span className={`font-medium ${getStatusColor(order.deliveryStatus)}`}>
                        {order.deliveryStatus}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated Delivery:</span>
                    <span className="text-sm">{formatDate(order.estimatedDelivery)}</span>
                  </div>
                  {order.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment ID:</span>
                      <span className="text-sm text-gray-300">{order.paymentId}</span>
                    </div>
                  )}
                </div>

                {/* Delivery Address */}
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <p className="text-sm text-gray-400 mb-2">Delivery Address:</p>
                  <p className="text-sm">{order.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage; 
import React, { useEffect, useState } from "react";
import { useBrand } from "../contexts/BrandContext";
import axios from "axios";

interface User {
  email: string;
  phone: string;
  display_name: string;
}

interface Order {
  user: User;
  product_name: string;
  quantity: number;
  size: string;
  order_date: string;
  delivery_status: string;
  payment_status: string;
  order_id: string; // assuming API sends an order ID for updates
}

const deliveryOptions = [
  "Pending",
  "Accepted",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const Order: React.FC = () => {
  const { brand } = useBrand();
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      if (!brand) return;

      try {
        const res = await axios.get(
          `http://https://casa-backend-uf0h.onrender.com/api/brands/sales/${brand._id}`
        );
        setSales(res.data.data);
      } catch (err) {
        console.error("Failed to fetch sales:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [brand, sales]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDeliveryChange = async (index: number, newStatus: string, order_id: string) => {
    console.log(index, newStatus, order_id)
    const updatedSales = [...sales];
    updatedSales[index].delivery_status = newStatus;
    setSales(updatedSales);

    // Optional: Persist change to backend
    try {
      const res = await axios.put(
        `http://https://casa-backend-uf0h.onrender.com/api/orders/update/${order_id}`,
        { deliveryStatus: newStatus }
      );
      if(res.data.success){
        alert(res.data.updated.deliveryStatus)
      }
    } catch (err) {
      console.error("Failed to update delivery status:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl text-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl text-center">
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs sticky top-0">
            <tr>
              <th className="px-4 py-3 border-b">Customer</th>
              <th className="px-4 py-3 border-b">Email</th>
              <th className="px-4 py-3 border-b">Phone</th>
              <th className="px-4 py-3 border-b">Product</th>
              <th className="px-4 py-3 border-b text-center">Qty</th>
              <th className="px-4 py-3 border-b text-center">Size</th>
              <th className="px-4 py-3 border-b">Order Date</th>
              <th className="px-4 py-3 border-b">Delivery</th>
              <th className="px-4 py-3 border-b">Payment</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((order, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-3 border-b font-medium text-gray-800">
                  {order.user.display_name}
                </td>
                <td className="px-4 py-3 border-b text-gray-600">
                  {order.user.email}
                </td>
                <td className="px-4 py-3 border-b text-gray-600">
                  {order.user.phone}
                </td>
                <td className="px-4 py-3 border-b text-gray-800">
                  {order.product_name}
                </td>
                <td className="px-4 py-3 border-b text-center">
                  {order.quantity}
                </td>
                <td className="px-4 py-3 border-b text-center">
                  {order.size}
                </td>
                <td className="px-4 py-3 border-b text-gray-500">
                  {formatDate(order.order_date)}
                </td>
                <td className="px-4 py-3 border-b">
                  <select
                    value={order.delivery_status}
                    onChange={(e) =>
                      handleDeliveryChange(index, e.target.value, order.order_id)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-400"
                  >
                    {deliveryOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td
                  className={`px-4 py-3 border-b font-semibold ${
                    order.payment_status === "UPI"
                      ? "text-blue-600"
                      : "text-purple-600"
                  }`}
                >
                  {order.payment_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Minus,
  Plus,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { CartData, useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import AnimatedList from "../components/AnimatedList"; // ← no .tsx in import

// Radix Alert Dialog (single shared component file)
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/alert-dialog";

<<<<<<< HEAD
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
=======
const API_BASE = import.meta.env.VITE_API_URL || "http://https://casa-backend-uf0h.onrender.com/api";
>>>>>>> ade6ad192c2a962557a2f4760de75691b79847ca

/* ---------------- Types ---------------- */
interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image?: string;
  images?: string[];
  selectedSize: string;
  quantity: number;
}

interface Address {
  _id: string;
  billing_customer_name: string;
  billing_phone: string;
  billing_email: string;
  billing_address: string;
  billing_address_2: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  isDefault?: boolean;
  createdAt?: string;
}

interface PaymentMethod {
  id: number;
  type: string;
  name: string;
  icon: string;
}

/* ---------------- Helpers ---------------- */
const normalizeShipments = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.shipment)) return data.shipment;
  if (Array.isArray(data?.shipments)) return data.shipments;
  if (Array.isArray(data?.user?.shipment)) return data.user.shipment;
  if (Array.isArray(data?.user?.shipments)) return data.user.shipments;
  if (Array.isArray(data?.shipmentAddresses)) return data.shipmentAddresses;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, updateQuantity } = useCart();
  const { userData } = useUser();
  const { product, bagItems, total, directBuy } = (location.state || {}) as any;

  /* ---------------- Cart → Products ---------------- */
  const fallbackBagItems = cart?.items || [];
  const fallbackTotal = fallbackBagItems.reduce((sum, item) => {
    const price = parseFloat(item.product.price.$numberDecimal);
    return sum + price * (item.quantity || 1);
  }, 0);

  const mappedCartItems: Product[] = fallbackBagItems.map((item) => ({
    id: item.product._id,
    name: item.product.name,
    brand:
      typeof item.product.brand === "string"
        ? item.product.brand
        : item.product.brand.name,
    price: `₹${parseFloat(item.product.price.$numberDecimal).toFixed(2)}`,
    images: item.product.images,
    selectedSize: item.size,
    quantity: item.quantity,
  }));

  const orderItems: Product[] =
    directBuy && product ? [product] : bagItems ? bagItems : mappedCartItems;

  const orderTotal: number = useMemo(
    () =>
      total ||
      (product
        ? parseInt(product.price.replace("₹", "").replace(",", ""))
        : fallbackTotal),
    [total, product, fallbackTotal]
  );

  /* ---------------- Address state ---------------- */
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number>(0);
  const [addrLoading, setAddrLoading] = useState(true);
  const [addrError, setAddrError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null); // ← dialog control

  /* ---------------- Payment state ---------------- */
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    { id: 1, type: "Razorpay", name: "Pay with Razorpay", icon: "💳" },
  ];

  /* ---------------- Resolve userId ---------------- */
  const resolveUserId = async (): Promise<string | null> => {
    if (userData?._id) return String(userData._id);

    const keys = ["userData", "user", "currentUser", "auth"];
    for (const k of keys) {
      const raw = localStorage.getItem(k) || sessionStorage.getItem(k);
      if (!raw) continue;
      try {
        const obj = JSON.parse(raw);
        const id =
          obj?._id ||
          obj?.id ||
          obj?.user?._id ||
          obj?.user?.id ||
          obj?.profile?._id ||
          obj?.data?._id;
        if (id) return String(id);
      } catch {}
    }

    const direct = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (direct) return String(direct);

    const phone =
      userData?.phoneNumber ||
      localStorage.getItem("phone") ||
      sessionStorage.getItem("phone");
    if (phone) {
      try {
        const res = await axios.get(`${API_BASE}/users`, {
          params: { phone },
          withCredentials: false,
        });
        if (Array.isArray(res.data) && res.data.length > 0) {
          return String(res.data[0]._id);
        }
      } catch {}
    }
    return null;
  };

  /* ---------------- Fetch addresses ---------------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setAddrLoading(true);
        setAddrError(null);

        const userId = await resolveUserId();
        if (!userId) throw new Error("User not found. Please log in again.");

        const res = await axios.get(`${API_BASE}/users/${userId}/shipment`, {
          withCredentials: false,
        });
        const list = normalizeShipments(res.data);

        const mapped: Address[] = list.map((s: any) => ({
          _id: s._id,
          billing_customer_name: s.billing_customer_name,
          billing_phone: s.billing_phone,
          billing_email: s.billing_email,
          billing_address: s.billing_address,
          billing_address_2: s.billing_address_2 || "",
          billing_city: s.billing_city,
          billing_pincode: s.billing_pincode,
          billing_state: s.billing_state,
          billing_country: s.billing_country || "India",
          isDefault: !!s.isDefault,
          createdAt: s.createdAt
        }));

        if (!mounted) return;
        setAddresses(mapped);

        const defIndex = mapped.findIndex((a) => a.isDefault);
        setSelectedAddress(defIndex >= 0 ? defIndex : mapped.length ? 0 : -1);
      } catch (err: any) {
        if (!mounted) return;
        setAddrError(
          err?.response?.data?.message || err?.message || "Could not fetch addresses."
        );
        setAddresses([]);
        setSelectedAddress(-1);
      } finally {
        if (mounted) setAddrLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userData?._id]);

  // keep selected index valid when list changes
  useEffect(() => {
    if (!addresses.length) {
      setSelectedAddress(-1);
      return;
    }
    setSelectedAddress((prev) => {
      if (prev < 0) return 0;
      return Math.min(prev, addresses.length - 1);
    });
  }, [addresses.length]);

  /* ---------------- Delete address (actual call) ---------------- */
  const deleteAddress = async (addressId: string) => {
    const userId = await resolveUserId();
    if (!userId) {
      alert("Please log in again.");
      return;
    }
    try {
      setDeletingId(addressId);
      await axios.delete(`${API_BASE}/users/${userId}/shipment/${addressId}`, {
        withCredentials: false,
      });
      setAddresses((prev) => prev.filter((a) => a._id !== addressId));
    } catch (err: any) {
      console.error("Delete address failed:", err);
      alert(err?.response?.data?.message || "Failed to delete address.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------------- Quantity handlers ---------------- */
  const handleQuantity = async (productId: string, size: string, change: number) => {
    try {
      const currentItem = orderItems.find(
        (item) => item.id === productId && item.selectedSize === size
      );
      if (currentItem) {
        const newQuantity = Math.max(0, (currentItem.quantity || 0) + change);
        await updateQuantity(productId, size, newQuantity);
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  /* ---------------- Order creation ---------------- */
  const createOrder = async (
    cartData: CartData,
    deliveryAddress: string,
    paymentStatus: string,
    paymentId?: string
  ) => {
    try {
<<<<<<< HEAD
      console.log('📦 Creating order with data:', {
        user: userData?._id,
        products: cartData.items,
        address: deliveryAddress,
        paymentStatus,
        paymentId
      });

      const orderData = {
        user: userData?._id,
        products: cartData.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: parseFloat(item.product.price.$numberDecimal) || 1
        })),
        address: deliveryAddress,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        paymentStatus,
        deliveryStatus: "pending",
        totalAmount: cartData.items.reduce((sum, item) => sum + (parseFloat(item.product.price.$numberDecimal) || 1) * item.quantity, 0),
        paymentId,
        // Add any other required fields
        orderDate: new Date(),
        status: "confirmed"
      };

      console.log('📤 Sending order data:', orderData);

      const response = await axios.post(
        `${API_BASE}/orders/create`,
        orderData,
        { withCredentials: false }
      );
      
      console.log('✅ Order created successfully:', response.data);
=======
      const response = await axios.post(
        `${API_BASE}/orders/create`,
        {
          user: userData?._id,
          products: cartData.items,
          address: deliveryAddress,
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          paymentStatus,
          deliveryStatus: "pending",
          totalAmount: orderTotal,
          paymentId,
        },
        { withCredentials: false }
      );
>>>>>>> ade6ad192c2a962557a2f4760de75691b79847ca
      return response.data;
    } catch (error: any) {
      console.error("Error creating order:", error.response?.data || error.message);
      return { success: false };
    }
  };

  const deleteCart = async () => {
    try {
      const response = await axios.delete(`${API_BASE}/cart/delete`, {
<<<<<<< HEAD
        data: { email: userData?.email },
=======
        data: { phone: userData?.phoneNumber },
>>>>>>> ade6ad192c2a962557a2f4760de75691b79847ca
        withCredentials: false,
      });
      console.log("Cart deleted:", response.data);
    } catch (error: any) {
      console.error("Error deleting cart:", error.response?.data || error.message);
    }
  };

  /* ---------------- Payment ---------------- */
  const handleRazorpayPayment = async () => {
    try {
      if (!addresses.length || selectedAddress < 0) {
        alert("Please add a delivery address first.");
        return;
      }
      const selected = addresses[selectedAddress];

      const paymentOrderResponse = await axios.post(
        `${API_BASE}/payments/create-order`,
<<<<<<< HEAD
        { amount: cart.totalAmount * 100, currency: "INR", receipt: "order_" + Date.now() },
=======
        { amount: orderTotal, currency: "INR", receipt: "order_" + Date.now() },
>>>>>>> ade6ad192c2a962557a2f4760de75691b79847ca
        { withCredentials: false }
      );

      if (!paymentOrderResponse.data.success) {
        throw new Error("Failed to create payment order");
      }

      const { order } = paymentOrderResponse.data;

      const options = {
        key: "rzp_live_NSJ391QbwVovIS",
        amount: order.amount,
        currency: order.currency,
        name: "CASA",
        description: "Payment for your order",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await axios.post(
              `${API_BASE}/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: false }
            );

            if (verifyResponse.data.success) {
              const orderResponse = await createOrder(
                cart,
                selected.billing_address,
                "Paid",
                response.razorpay_payment_id
              );
              if (orderResponse.success) {
                await deleteCart();
                setIsProcessing(false);
                createShiprocketOrder()
                navigate("/order-success", {
                  state: {
                    orderId: "ORD" + Date.now(),
                    items: orderItems,
<<<<<<< HEAD
                    total: cart.totalAmount,
=======
                    total: orderTotal,
>>>>>>> ade6ad192c2a962557a2f4760de75691b79847ca
                    address: selected,
                    paymentId: response.razorpay_payment_id,
                  },
                });
              }
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setIsProcessing(false);
            alert("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
          contact: userData?.phoneNumber || "",
        },
        theme: { color: "#10B981" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay payment error:", error);
      setIsProcessing(false);
      alert("Failed to initialize payment. Please try again.");
    }
  };

  async function createShiprocketOrder() {
    if (!addresses.length || selectedAddress < 0) {
      alert("Please add a delivery address first.");
      return;
    }
    const addr = addresses[selectedAddress];
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjc0ODgwODAsInNvdXJjZSI6InNyLWF1dGgtaW50IiwiZXhwIjoxNzU1NzU3Mjc2LCJqdGkiOiJYSEdXOHVHRDF1Sk9jOWw5IiwiaWF0IjoxNzU0ODkzMjc2LCJpc3MiOiJodHRwczovL3NyLWF1dGguc2hpcHJvY2tldC5pbi9hdXRob3JpemUvdXNlciIsIm5iZiI6MTc1NDg5MzI3NiwiY2lkIjo3MjUzMzg5LCJ0YyI6MzYwLCJ2ZXJib3NlIjpmYWxzZSwidmVuZG9yX2lkIjowLCJ2ZW5kb3JfY29kZSI6IiJ9.2zi8rX322uTX9qFri_JzNoKnTnc8tdKxHuBauEfK5Xc";
    const today = new Date().toISOString().split("T")[0];

    const orderData = {
      order_id: Math.floor(1000000 + Math.random() * 9000000).toString(),
      order_date: today,
      pickup_location: "work",
      company_name: "Casa",
      billing_customer_name: addr.billing_customer_name[0],
      billing_last_name: addr.billing_customer_name[1],
      billing_address: addr.billing_address,
      billing_address_2: addr.billing_address_2,
      billing_isd_code: "+91",
      billing_city: addr.billing_city,
      billing_pincode: addr.billing_pincode,
      billing_state: addr.billing_state,
      billing_country: addr.billing_country,
      billing_email: addr.billing_email,
      billing_phone: addr.billing_phone,
      shipping_is_billing: "1",
      order_items: orderItems.map((item) => ({
        name: item.name,
        sku: item.id,
        units: item.quantity.toString(),
        selling_price: item.price.replace("₹", ""),
        discount: "0",
        tax: "0",
        hsn: "0000"
      })),
      payment_method: "prepaid",
      sub_total: orderTotal.toString(),
      length: "10",
      breadth: "10",
      height: "10",
      weight: "1"
    };
console.log(orderData)
    try {
      const res = await axios.post(
        "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Order Created:", res.data);
    } catch (error) {
      console.error("❌ Shiprocket Error:", error);
    }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      await handleRazorpayPayment();
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      alert("Payment failed. Please try again.");
    }
  };

  /* ---------------- UI ---------------- */
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

            {addrError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                <AlertTriangle size={16} />
                <span>Addresses failed to load: {addrError}</span>
              </div>
            )}

            {addrLoading ? (
              <div className="space-y-3">
                <div className="h-20 rounded-lg bg-gray-800 animate-pulse" />
                <div className="h-20 rounded-lg bg-gray-800 animate-pulse" />
              </div>
            ) : addresses.length ? (
              <>
                <AnimatedList<Address>
                  items={addresses}
                  selectedIndex={selectedAddress}
                  onSelectedIndexChange={(idx) => setSelectedAddress(idx)}
                  selectOnHover={false}
                  className="w-full"
                  renderItem={(addr, idx, selected) => (
                    <div className="flex items-start justify-between gap-3">
                      <div className="pr-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block h-4 w-4 rounded-full border ${
                              selected ? "border-blue-400 bg-blue-400" : "border-gray-500"
                            }`}
                          />
                          <h3 className="font-medium text-white">
                            {addr.billing_customer_name}{" "}
                            {addr.isDefault ? (
                              <span className="ml-1 text-xs text-blue-300">(Default)</span>
                            ) : null}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-300 leading-snug">{addr.billing_address}</p>
                        {addr.billing_phone && <p className="text-sm text-gray-400 mt-1">{addr.billing_phone}</p>}
                        {selected && (
                          <div className="mt-2 inline-flex items-center gap-1 text-xs text-blue-300">
                            <CheckCircle size={14} /> Selected
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!deletingId) setConfirmId(addr._id); // open dialog
                        }}
                        className={`shrink-0 rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10 ${
                          deletingId === addr._id ? "opacity-60 cursor-wait" : ""
                        }`}
                        title="Delete address"
                        disabled={deletingId === addr._id}
                      >
                        <span className="inline-flex items-center gap-1">
                          <Trash2 size={14} /> Delete
                        </span>
                      </button>
                    </div>
                  )}
                />

                <button
                  onClick={() => navigate("/location")}
                  className="mt-3 w-full rounded-lg border border-dashed border-gray-700 px-4 py-3 text-gray-300 hover:border-gray-500"
                >
                  + Add new address
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/location")}
                  className="w-full rounded-lg border border-dashed border-gray-700 px-4 py-3 text-gray-300 hover:border-gray-500"
                >
                  + Add your first address
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="bg-gray-800 rounded-lg p-4 space-y-3">
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src={
                      item.image ||
                      (item.images && item.images[0]) ||
                      "https://placehold.co/100x100/1f2937/ffffff?text=Item"
                    }
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://placehold.co/100x100/1f2937/ffffff?text=Error";
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

                  <button
                    onClick={() => handleQuantity(item.id, item.selectedSize, -1)}
                    className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-white">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantity(item.id, item.selectedSize, 1)}
                    className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600"
                  >
                    <Plus size={14} />
                  </button>
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
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-700 bg-gray-800 hover:border-gray-600"
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
          disabled={isProcessing || addrLoading || addresses.length === 0 || selectedAddress < 0}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : `Pay with Razorpay - ₹${orderTotal}`}
        </button>
      </div>

      {/* Global Confirm Dialog for Delete */}
      <AlertDialog open={!!confirmId} onOpenChange={(open) => !open && setConfirmId(null)}>
        <AlertDialogContent>  
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this address?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone and will remove the address from your saved shipments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!confirmId) return;
                await deleteAddress(confirmId);
                setConfirmId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CheckoutPage;

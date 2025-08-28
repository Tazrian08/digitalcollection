import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const SHIPPING_COST = 60;
const WHATSAPP_NUMBER = '01234567892';

const Checkout: React.FC = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    shippingAddress: user?.address || '',
    phone: user?.phone || '',
    paymentMethod: 'offline'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setCartItems([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${apiBaseUrl}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setCartItems(data.items || []);
      } catch {
        setCartItems([]);
      }
      setLoading(false);
    };
    fetchCart();
  }, [token]);

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.shippingAddress || !form.phone || !form.paymentMethod) {
      setError('Please fill all fields.');
      return;
    }
    try {
      const orderPayload = {
        shippingAddress: form.shippingAddress,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: getCartTotal() + SHIPPING_COST
      };
      const res = await fetch(`${apiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');
      setOrderId(data.orderId);
      setSuccess('Order placed successfully!');
      setShowPopup(true);
    } catch (err: any) {
      setError(err.message || 'Order failed');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="mb-4">Please add products to your cart before checking out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center py-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-sky-200 p-10 w-full max-w-3xl">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-8 text-center">
          Checkout
        </h2>
        {/* Invoice Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="bg-sky-50 rounded-xl p-4 mb-4">
            {cartItems.map(item => (
              <div key={item.product._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span className="font-medium">{item.product.name} <span className="text-gray-500">x{item.quantity}</span></span>
                <span className="font-bold">{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            {/* <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Shipping</span>
              <span className="font-bold">{SHIPPING_COST.toLocaleString()}</span>
            </div> */}
            <div className="flex justify-between items-center py-2 border-t mt-2 font-bold text-lg">
              <span>Total</span>
              <span>{(getCartTotal()).toLocaleString()}</span>
            </div>
          </div>
        </div>
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
  <div>
    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">
      Shipping Address
    </label>
    <input
      id="shippingAddress"
      name="shippingAddress"
      placeholder="e.g., House 12, Road 7, Dhanmondi, Dhaka"
      value={form.shippingAddress}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div>
    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
      Phone Number
    </label>
    <input
      id="phone"
      name="phone"
      type="text"
      placeholder="e.g., +8801XXXXXXXXX"
      value={form.phone}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div>
    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
      Payment Method
    </label>
    <select
      id="paymentMethod"
      name="paymentMethod"
      value={form.paymentMethod}
      onChange={handleChange}
      required
      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="offline">Offline</option>
      <option value="online">Online</option>
    </select>
  </div>

  {error && <div className="text-red-500">{error}</div>}
  {success && <div className="text-green-500">{success}</div>}

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-2xl font-bold text-lg shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300"
  >
    Place Order
  </button>
</form>
      </div>
      {/* Popup */}
{showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

    {/* Card */}
    <div className="relative w-full max-w-lg">
      <div className="bg-white overflow-hidden rounded-3xl shadow-2xl border border-sky-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-center">
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-white/15 flex items-center justify-center">
            {/* Check icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-wide">
            Order placed successfully
          </h3>
          <p className="mt-1 text-sky-100">
            Thanks for shopping with us! Please follow the instructions below to complete your payment.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
            <p className="text-sm text-sky-800 mb-1 font-medium">Your Order ID</p>
            <div className="flex items-center gap-2">
              <code className="font-mono text-lg font-bold text-sky-900 bg-white rounded-xl px-3 py-2 border border-sky-200">
                {orderId}
              </code>
              
            </div>
            <p className="mt-2 text-xs text-sky-700">
              Please <span className="font-semibold">save this Order ID</span>. You’ll need it for payment confirmation and future support.
              You can always find it later under the <span className="font-semibold">Orders</span> tab on your <span className="font-semibold">Account</span> page.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Next steps</h4>
            <ol className="list-decimal ml-5 space-y-1 text-gray-700">
              <li>Send us your payment details on WhatsApp.</li>
              <li>Include your <span className="font-medium">Order ID</span> in the message.</li>
              <li>We’ll verify and update your order status.</li>
            </ol>
          </div>

          <div className="text-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-bold text-base transition shadow"
            >
              Chat on WhatsApp
              <span className="opacity-90">({WHATSAPP_NUMBER})</span>
            </a>
            <p className="mt-2 text-xs text-gray-500">
              Tip: paste your Order ID in the chat so we can assist you faster.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <button
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-sky-600 hover:to-blue-700 transition"
            onClick={() => {
              setShowPopup(false);
              navigate('/account');
            }}
          >
            Go to My Account
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};



export default Checkout;
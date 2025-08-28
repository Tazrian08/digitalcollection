import React, { useState, useEffect } from 'react';
import { User, Package, Heart, Settings, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import ContactInbox from '../components/ContactInbox';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Account: React.FC = () => {
  const { user, token, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Orders tab logic
  const [orders, setOrders] = useState<any[]>([]);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (user.isAdmin) {
      setOrders([]);
      setSelectedOrder(null);
    } else {
      // Fetch user's orders
      const fetchOrders = async () => {
        const res = await fetch(`${apiBaseUrl}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(data || []);
      };
      fetchOrders();
    }
  }, [user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        const msg =
          data?.message ||
          (typeof data === 'string' ? data : '') ||
          'Failed to update profile';
        if (
          msg === 'Email already exists' ||
          msg === 'Phone number already exists'
        ) {
          setMessage(msg);
        } else {
          setMessage(msg || 'Failed to update profile');
        }
      } else {
        await fetchUser();
        setMessage('Profile updated successfully!');
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (typeof err === 'string' ? err : '') ||
        'Error updating profile';
      setMessage(msg);
    }
    setLoading(false);
  };

  // Non-admin: filter orders by search
  const filteredOrders = user?.isAdmin
    ? []
    : orders.filter(order =>
        searchOrderId === '' || order.orderId.toLowerCase().includes(searchOrderId.toLowerCase())
      );

  // Admin: search by orderId
  const handleAdminSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedOrder(null);
    if (!searchOrderId) return;
    const res = await fetch(`${apiBaseUrl}/api/orders/by-orderid/${searchOrderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setSelectedOrder(data);
    else setSelectedOrder({ error: data.message });
  };

  // Admin: update status
  const handleStatusUpdate = async () => {
    const res = await fetch(`${apiBaseUrl}/api/orders/status/${selectedOrder.orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (res.ok) {
      setSelectedOrder(data.order);
      setStatusMsg('Status updated!');
    } else {
      setStatusMsg(data.message || 'Error updating status');
    }
  };


  // Order display component
  const OrderDisplay = ({ order }: { order: any }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold mb-2">Order {order.orderId}</h3>
      <div className="mb-2">
        <span className="font-semibold">User:</span> {order.user?.name || ''} <br />
        <span className="font-semibold">Email:</span> {order.user?.email || ''} <br />
        <span className="font-semibold">Phone:</span> {order.user?.phone || ''}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Shipping Address:</span> {order.shippingAddress}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Status:</span> {order.status}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Shipping Phone:</span> {order.phone || ''}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Items:</span>
        <ul className="list-disc ml-6">
          {order.items.map((item: any) => (
            <li key={item.product._id}>
              {item.product.name} x{item.quantity} - {item.price}
            </li>
          ))}
        </ul>
      </div>
      {user?.isAdmin && (
        <div className="mt-4">
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border px-3 py-2 rounded mr-2"
          >
            <option value="Processing">Processing</option>
            <option value="Paid">Paid</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            onClick={handleStatusUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          {statusMsg && <div className="text-green-600 mt-2">{statusMsg}</div>}
        </div>
      )}
    </div>
  );

  // Tabs logic
  const tabs = user?.isAdmin
    ? [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'orders', name: 'Orders', icon: Package },
        { id: 'contactInbox', name: 'Contact Inbox', icon: Heart }, // <-- new tab
        { id: 'registerAdmin', name: 'Register Admin', icon: ShieldCheck },
        { id: 'addProduct', name: 'Add Product', icon: Package },
        { id: 'addAd', name: 'Add to Slider', icon: Package },
        { id: 'manageAds', name: 'Manage Ads', icon: Package },
        
      ]
    : [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'orders', name: 'Orders', icon: Package },
      ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {message && <div className="text-green-600">{message}</div>}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
            <form
              onSubmit={user?.isAdmin ? handleAdminSearch : e => e.preventDefault()}
              className="mb-6 flex items-center gap-4"
            >
              <input
                type="text"
                placeholder="Enter Order ID (e.g. OR00001)"
                value={searchOrderId}
                onChange={e => setSearchOrderId(e.target.value)}
                className="border px-3 py-2 rounded w-64"
              />
              {user?.isAdmin && (
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
                  <Search className="h-4 w-4" /> Search
                </button>
              )}
            </form>
            {/* Non-admin: show filtered orders */}
            {!user?.isAdmin && filteredOrders.length === 0 && (
              <div>No orders found.</div>
            )}
            {!user?.isAdmin &&
              filteredOrders.map(order => <OrderDisplay key={order._id} order={order} />)}
            {/* Admin: show selected order */}
            {user?.isAdmin && selectedOrder && !selectedOrder.error && (
              <OrderDisplay order={selectedOrder} />
            )}
            {user?.isAdmin && selectedOrder && selectedOrder.error && (
              <div className="text-red-600">{selectedOrder.error}</div>
            )}
          </div>
        );

      case 'contactInbox':
        return (
          <ContactInbox user={user} token={token || ''} />
        );

      case 'registerAdmin':
        // Redirect to /admin/add
        window.location.href = '/admin/add';
        return null;

      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {tabs.find(tab => tab.id === activeTab)?.name}
            </h2>
            <p className="text-gray-600">This section is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          {user?.isAdmin && (
            <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 text-white text-sm font-semibold shadow">
              <ShieldCheck className="h-4 w-4 mr-1" />
              Admin
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'registerAdmin') {
                          navigate('/admin/add');
                        } else if (tab.id === 'addProduct') {
                          navigate('/addproduct');
                        } else if (tab.id === 'addAd') {
                          navigate('/admin/ad');
                        } else if (tab.id === 'manageAds') {
                          navigate('/admin/manage-ads');
                        } else if (tab.id === 'contactInbox') {
                          setActiveTab('contactInbox');
                        } else {
                          setActiveTab(tab.id);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
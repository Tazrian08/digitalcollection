import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Cart: React.FC = () => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
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

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  // Update quantity of a cart item
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch {
      // Optionally show error
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch {
      // Optionally show error
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    if (!token) return;
    try {
      // Remove each item one by one
      for (const item of cartItems) {
        await fetch(`${apiBaseUrl}/api/cart/${item.product.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setCartItems([]);
    } catch {
      // Optionally show error
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const getImageUrl = (product: any) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const imagePath = product.images?.[0]?.replace(/\\/g, '/');
    return imagePath ? `${apiBaseUrl}${imagePath}` : '/placeholder.jpg';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-sky-200">
          <div className="w-32 h-32 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-16 w-16 text-sky-500" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 text-lg">Add some amazing products to get started!</p>
          <Link
            to="/products"
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 inline-flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600 text-lg">{cartItems.length} items in your cart</p>
          </div>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 transition-colors font-medium hover:bg-red-50 px-4 py-2 rounded-xl"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-sky-200">
              {cartItems.map((item, index) => (
                <div key={item.product._id} className={`p-8 ${index !== cartItems.length - 1 ? 'border-b border-sky-100' : ''}`}>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={getImageUrl(item.product)}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-2xl shadow-md"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="text-xl font-bold text-gray-900 hover:text-sky-600 transition-colors block mb-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sky-600 font-medium mb-3">{item.product.brand}</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 bg-sky-50 rounded-2xl p-3">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        className="p-2 rounded-xl hover:bg-sky-100 transition-colors text-sky-600 hover:text-sky-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-12 text-center font-bold text-lg text-gray-800">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        className="p-2 rounded-xl hover:bg-sky-100 transition-colors text-sky-600 hover:text-sky-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right flex flex-col items-end min-w-[48px]">
                      <p className="text-2xl font-bold text-gray-900 mb-3">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={async () => {
                          await removeFromCart(item.product._id);
                          // Refetch cart to update UI
                          const res = await fetch(`${apiBaseUrl}/api/cart`, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          const data = await res.json();
                          setCartItems(data.items || []);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-xl flex-shrink-0"
                        style={{ minWidth: 40 }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 sticky top-8 border border-sky-200">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold">{formatPrice(60)}</span>
                </div>
                <div className="border-t border-sky-200 pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold">Total</span>
                    <span className="font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                      {formatPrice(getCartTotal() + 60)}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 px-6 rounded-2xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 mb-4">
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-sky-600 hover:text-sky-700 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
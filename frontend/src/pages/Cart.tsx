import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Gift } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

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
                <div key={item.product.id} className={`p-8 ${index !== cartItems.length - 1 ? 'border-b border-sky-100' : ''}`}>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-2xl shadow-md"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product.id}`}
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
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="p-2 rounded-xl hover:bg-sky-100 transition-colors text-sky-600 hover:text-sky-700"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-12 text-center font-bold text-lg text-gray-800">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="p-2 rounded-xl hover:bg-sky-100 transition-colors text-sky-600 hover:text-sky-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 mb-3">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-xl"
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
                  <span className="font-bold">
                    {getCartTotal() > 500 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      formatPrice(29.99)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-bold">{formatPrice(getCartTotal() * 0.08)}</span>
                </div>
                <div className="border-t border-sky-200 pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold">Total</span>
                    <span className="font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                      {formatPrice(
                        getCartTotal() + 
                        (getCartTotal() > 500 ? 0 : 29.99) + 
                        (getCartTotal() * 0.08)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {getCartTotal() > 500 && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-emerald-600" />
                    <p className="text-emerald-800 font-bold">
                      🎉 You qualify for free shipping!
                    </p>
                  </div>
                </div>
              )}

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
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface ProductCardProps {
  product: Product;
  fromBuilder?: boolean;
  builderCategory?: string;
  builderState?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  fromBuilder,
  builderCategory,
  builderState
}) => {
  const { addToCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Please sign in to add items to your cart.');
      return;
    }
    try {
      const res = await fetch(`${apiBaseUrl}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });
      if (!res.ok) throw new Error('Failed to add to cart');
      alert('Added to cart!');
    } catch (err) {
      alert('Error adding to cart');
    }
  };

  const handleAddToBuilder = () => {
    const updatedBuilder = {
      ...builderState,
      [builderCategory?.toLowerCase()]: {
        id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
      }
    };
    const builderStateStr = encodeURIComponent(JSON.stringify(updatedBuilder));
    navigate(`/builder?builderState=${builderStateStr}`);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const imagePath = product.images && product.images[0]
    ? product.images[0].replace(/\\/g, '/')
    : '';
  const imageUrl = imagePath ? `${apiBaseUrl}${imagePath}` : '/placeholder.jpg';

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden border border-sky-100 hover:border-sky-300 transform hover:-translate-y-2">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Stock Status */}
          <div className="absolute bottom-4 left-4 z-20">
            {product.stock > 0 ? (
              <div className="flex items-center space-x-2 bg-emerald-100/90 backdrop-blur-sm text-emerald-800 text-xs font-medium px-3 py-2 rounded-full shadow-lg">
                <CheckCircle className="h-3 w-3" />
                <span>In Stock</span>
              </div>
            ) : (
              <div className="bg-red-100/90 backdrop-blur-sm text-red-800 text-xs font-medium px-3 py-2 rounded-full shadow-lg">
                Out of Stock
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-sky-600 bg-sky-50 px-3 py-1 rounded-full">{product.brand}</span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 font-medium">
                {/* {product.rating} */}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-sky-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-6 pb-6">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-4 rounded-2xl hover:from-sky-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>

        {/* Add to Builder button */}
        {fromBuilder && (
          <button
            onClick={handleAddToBuilder}
            className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-2 rounded-xl font-semibold shadow hover:from-emerald-600 hover:to-blue-700 transition"
          >
            Add to Builder
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
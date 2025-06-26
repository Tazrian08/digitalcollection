import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden border border-sky-100 hover:border-sky-300 transform hover:-translate-y-2">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2 z-20">
            {product.isNew && (
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                New
              </span>
            )}
            {product.isBestseller && (
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Bestseller
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-gradient-to-r from-red-400 to-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Sale
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 z-20">
            <button
              onClick={handleWishlistToggle}
              className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg hover:scale-110 ${
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Stock Status */}
          <div className="absolute bottom-4 left-4 z-20">
            {product.inStock ? (
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
                {product.rating} ({product.reviewCount})
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
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="px-6 pb-6">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-4 rounded-2xl hover:from-sky-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
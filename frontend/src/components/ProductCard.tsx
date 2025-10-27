import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DCLogo from "../../assets/DC_logo.png";
import { Product } from '../types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface ProductCardProps {
  product: Product;
  fromBuilder?: boolean;
  builderCategory?: string;
  builderState?: any;
}

type Notice = { type: 'success' | 'error'; message: string } | null;

const ProductCard: React.FC<ProductCardProps> = ({ product, fromBuilder, builderCategory, builderState }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  const showNotice = (n: Exclude<Notice, null>) => setNotice(n);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!token) {
      showNotice({ type: 'error', message: 'Please sign in to add items to your cart.' });
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
      showNotice({ type: 'success', message: 'Added to cart!' });
    } catch {
      showNotice({ type: 'error', message: 'Error adding to cart.' });
    }
  };

  const handleAddToBuilder = () => {
    if (!builderCategory || builderCategory === 'All Categories') {
      showNotice({ type: 'error', message: 'Choose a specific category to add this item.' });
      return;
    }
    const updatedBuilder = {
      ...builderState,
      [builderCategory.toLowerCase()]: {
        id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
      }
    };
    const builderStateStr = encodeURIComponent(JSON.stringify(updatedBuilder));
    navigate(`/builder?builderState=${builderStateStr}`);
  };

  const formatPrice = (price: number) => price.toLocaleString();

  const imagePath = product.images && product.images[0]
    ? product.images[0].replace(/\\/g, '/')
    : '';
  const imageUrl = imagePath ? `${apiBaseUrl}${imagePath}` : DCLogo;

  return (
    <div className="relative">
      {/* Fixed-height, equal cards: use flex-column and a set height so all cards match.
          shadow + rounded to clearly separate cards from background. */}
      <div className="bg-white rounded-xl shadow transition-all duration-200 overflow-hidden border border-sky-50 flex flex-col h-72">
        <Link to={`/product/${product._id}`} className="block flex-1">
          {/* Image area: centered, image fully visible via object-contain */}
          <div className="relative rounded-t-xl bg-gray-50 flex items-center justify-center overflow-hidden h-36">
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              draggable={false}
              decoding="async"
            />

            {/* Brand badge */}
            <div className="absolute top-3 left-3 z-20">
              <span className="text-xs font-semibold text-sky-700 bg-white/90 px-2 py-1 rounded-full shadow-sm">
                {product.brand}
              </span>
            </div>

            {/* Stock badge */}
            <div className="absolute bottom-3 left-3 z-20">
              {product.stock > 0 ? (
                <div className="flex items-center space-x-2 bg-emerald-100/90 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full shadow">
                  <CheckCircle className="h-3 w-3" />
                  <span>In stock</span>
                </div>
              ) : (
                <div className="bg-red-100/90 text-red-800 text-xs font-medium px-2 py-1 rounded-full shadow">
                  Out of stock
                </div>
              )}
            </div>
          </div>

          {/* Content area */}
          <div className="p-3 flex flex-col h-[calc(100%-9rem)]"> 
            {/* h calculation ensures content area stays consistent; button area pushed to bottom */}
            <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-tight group-hover:text-sky-700 transition-colors overflow-hidden line-clamp-2">
              {product.name}
            </h3>

            <div className="flex items-center justify-between mt-auto space-x-4">
              <div className="flex items-center">
                <div className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-28">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2 rounded-lg hover:from-sky-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>{product.stock > 0 ? 'Add' : 'Notify'}</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {fromBuilder && (
          <div className="px-3 pb-3">
            <button
              onClick={handleAddToBuilder}
              className="w-full bg-emerald-500 text-white py-2 rounded-lg font-medium shadow hover:bg-emerald-600 transition-colors text-sm"
            >
              Add to Builder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

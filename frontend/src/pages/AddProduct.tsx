
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  brand?: string;
  category?: string;
  images?: string[];
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load product');
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const getImageUrl = (imgPath?: string) => {
    if (!imgPath) return '/placeholder.jpg';
    const normalized = imgPath.replace(/\\\\/g, '/').replace(/\\/g, '/');
    return `${apiBaseUrl}${normalized}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">{error || 'The product could not be loaded.'}</p>
          <Link to="/products" className="text-sky-600 hover:text-sky-700">Back to products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-sky-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <div className="aspect-square bg-sky-50 rounded-2xl overflow-hidden flex items-center justify-center border border-sky-100">
                <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {product.images.slice(1, 5).map((img, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl(img)}
                      alt={`${product.name} ${idx+2}`}
                      className="h-20 w-full object-cover rounded-xl border border-sky-100"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                {product.name}
              </h1>
              {product.brand && (
                <p className="mt-1 text-sky-700 font-medium">{product.brand}</p>
              )}
              <p className="mt-4 text-3xl font-extrabold text-gray-900">
                {product.price.toLocaleString()}
              </p>

              {/* Description with preserved spacing & line breaks */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <div
                  className="text-gray-800 leading-relaxed whitespace-pre-wrap"
                >
                  {product.description}
                </div>
                {/*
                  NOTE:
                  - 'whitespace-pre-wrap' (Tailwind) == CSS 'white-space: pre-wrap'
                  - This preserves: newlines, multiple spaces, and tabs.
                  - If you only want to preserve newlines but collapse repeated spaces, use 'whitespace-pre-line' instead.
                */}
              </div>

              {product.category && (
                <p className="mt-6 text-sm text-gray-500">Category: {product.category}</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-2xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-md"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

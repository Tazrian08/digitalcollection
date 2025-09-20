import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, Shield, Truck, XCircle, CheckCircle } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Convert custom inline tags to safe HTML spans with classes
function preprocessDescription(input: string): string {
  return (input || '')
    .replace(/\[blue\]([\s\S]*?)\[\/blue\]/g, '<span class="dc-blue">$1</span>')
    .replace(/\[xl\]([\s\S]*?)\[\/xl\]/g, '<span class="size-xl">$1</span>')
    .replace(/\[lg\]([\s\S]*?)\[\/lg\]/g, '<span class="size-lg">$1</span>')
    .replace(/\[sm\]([\s\S]*?)\[\/sm\]/g, '<span class="size-sm">$1</span>');
}

// Allow span + class attribute for our custom formatting
const sanitizeSchema: any = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [
      ...(defaultSchema.attributes?.span || []),
      ['className', 'dc-blue', 'size-xl', 'size-lg', 'size-sm'],
    ],
  },
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [togglingStock, setTogglingStock] = useState(false);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiBaseUrl}/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
        console.log(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching product');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id || product._id);

  const handleAddToCart = async () => {
    if (!token) {
      setNotice({ type: 'error', message: 'Please sign in to add items to your cart.' });
      return;
    }
    try {
      const res = await fetch(`${apiBaseUrl}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id, quantity })
      });
      if (!res.ok) throw new Error('Failed to add to cart');
      setNotice({ type: 'success', message: 'Added to cart!' });
    } catch {
      setNotice({ type: 'error', message: 'Error adding to cart.' });
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id || product._id);
    } else {
      addToWishlist(product.id || product._id);
    }
  };

  const handleDeleteProduct = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/products/${product._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete product');
      setNotice({ type: 'success', message: 'Product deleted!' });
      setTimeout(() => navigate('/products'), 1200);
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Error deleting product' });
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(price);

  const getImageUrl = (img: string) => {
    if (!img) return '/placeholder.jpg';
    if (img.startsWith('http')) return img;
    const path = img.replace(/\\/g, '/');
    return `${apiBaseUrl}${path}`;
  };

  // Preprocess + sanitize description; preserve whitespace when rendering
  const processedDescription = preprocessDescription(product.description || '');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images & CTAs */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
              <img
                src={getImageUrl(product.images?.[selectedImage])}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-4 mb-4">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-600' : 'border-gray-200'}`}
                  >
                    <img src={getImageUrl(image)} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-3">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={product.stock <= 0}
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Full Description below Add to Cart */}
            {product.long_desc && (
              <div className="bg-white rounded-lg shadow p-6 mb-6 hidden lg:block">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Full Description</h2>
                <div className="prose max-w-none whitespace-pre-wrap text-gray-700 break-words overflow-hidden">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                  >
                    {product.long_desc}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="bg-white rounded-lg shadow-md p-8 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-sky-400 scrollbar-track-sky-100"
               style={{ maxHeight: 'calc(100vh - 6rem)', scrollbarWidth: 'thin', scrollbarColor: '#38bdf8 #e0f2fe', msOverflowStyle: 'none' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-600 font-medium">{product.brand}</span>
              <div className="flex items-center space-x-2">
                {product.isNew && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">New</span>}
                {product.isBestseller && <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Bestseller</span>}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            {user?.isAdmin && token && (
              <button onClick={handleDeleteProduct} className="mb-3 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition">
                Delete Product
              </button>
            )}
            {user?.isAdmin && token && (
              <button
                onClick={async () => {
                  setTogglingStock(true);
                  try {
                    const res = await fetch(`${apiBaseUrl}/api/products/${product._id}/toggle-stock`, {
                      method: 'PATCH',
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Failed to toggle stock');
                    setProduct((prev: any) => ({ ...prev, stock: data.stock }));
                    setNotice({ type: 'success', message: data.stock > 0 ? 'Product is now in stock!' : 'Product is now out of stock!' });
                  } catch (err: any) {
                    setNotice({ type: 'error', message: err.message || 'Error toggling stock' });
                  }
                  setTogglingStock(false);
                }}
                className="mb-4 bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition"
                disabled={togglingStock}
              >
                {product.stock > 0 ? 'Mark Out of Stock' : 'Mark In Stock'}
              </button>
            )}

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>}
              {product.originalPrice && <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">Save {formatPrice(product.originalPrice - product.price)}</span>}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <div className="prose max-w-none whitespace-pre-wrap">
                <style>{`
                  .dc-blue { color: #38bdf8; } /* match site light blue (sky-400) */
                  .size-xl { font-size: 1.25rem; line-height: 1.75rem; font-weight: 600; }
                  .size-lg { font-size: 1.125rem; line-height: 1.75rem; }
                  .size-sm { font-size: 0.875rem; line-height: 1.25rem; }
                `}</style>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                >
                  {processedDescription}
                </ReactMarkdown>
              </div>
            </div>

            {/* Full Description below Description in mobile view */}
            {product.long_desc && (
              <div className="bg-white rounded-lg shadow p-6 mb-6 block lg:hidden">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Full Description</h2>
                <div className="prose max-w-none whitespace-pre-wrap text-gray-700 break-words overflow-hidden">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                  >
                    {product.long_desc}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">In Stock</span>
                </div>
              ) : (
                <div className="text-red-600 font-medium">Out of Stock</div>
              )}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Free shipping over $500</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="h-4 w-4" />
                <span>2-year warranty</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Check className="h-4 w-4" />
                <span>30-day returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-900">{key}</span>
                  <span className="text-gray-700">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toast */}
        {notice && (
          <div className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-2xl text-white font-semibold flex items-center gap-3
              ${notice.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-pink-600'}`}
               role="status" aria-live="polite">
            {notice.type === 'success' ? <CheckCircle className="h-5 w-5 text-white" /> : <XCircle className="h-5 w-5 text-white" />}
            <span>{notice.message}</span>
            <button onClick={() => setNotice(null)} className="ml-2 rounded-lg bg-white/10 hover:bg-white/20 px-2 py-1 text-xs">
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

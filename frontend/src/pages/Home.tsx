import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Headphones, Sparkles, Zap, Award } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AdSlider from '../components/AdSlider';

import { Product, Ad } from '../types'; // Make sure this type exists

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;


const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${apiBaseUrl}/api/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();

        setProducts(data.products);
      } catch (err: any) {
        setError(err.message || 'Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/ads`);
        if (!res.ok) throw new Error('Failed to fetch ads');
        const data = await res.json();
        setAds(data.ads);
      } catch (err: any) {
        console.error('Error fetching ads:', err.message);
      }
    };

    fetchAds();
  }, []);

  const featuredProducts = products.filter((_, i) => [1, 2, 3, 5].includes(i));

  

  return (
    <div className="min-h-screen">
      {/* Ad Slider */}
      <AdSlider ads={ads} />

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-white to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-4">
              Why Choose DigitalCollection?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium services and commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-sky-100 hover:border-sky-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-sky-100 to-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="h-10 w-10 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Free Shipping</h3>
              <p className="text-gray-600 leading-relaxed">Free shipping on orders over $500 with express delivery options available</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-sky-100 hover:border-sky-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-emerald-100 to-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Warranty Protection</h3>
              <p className="text-gray-600 leading-relaxed">Extended warranty coverage on all products with comprehensive protection plans</p>
            </div>
            
            <div className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-sky-100 hover:border-sky-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-100 to-pink-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Expert Support</h3>
              <p className="text-gray-600 leading-relaxed">24/7 technical support from photography professionals and equipment experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-200 mb-4">
              <Zap className="h-4 w-4 text-sky-500" />
              <span className="text-sm font-medium text-sky-700">Best Sellers</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our best-selling cameras and equipment, carefully selected for professionals and enthusiasts.
            </p>
          </div>
          
          {loading ? (
            <div className="text-center text-lg text-gray-500">Loading products...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Link
              to="/products"
              className="group bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 inline-flex items-center space-x-2 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-6">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you need for your photography and videography projects.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/products?category=Cameras"
              className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-sky-100 hover:border-sky-300 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Cameras"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-sky-700 transition-colors">Cameras</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Professional DSLR and mirrorless cameras for every skill level</p>
                <div className="flex items-center text-sky-600 font-bold group-hover:text-sky-700 transition-colors">
                  <span>Shop Cameras</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link
              to="/products?category=Lenses"
              className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-sky-100 hover:border-sky-300 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/225157/pexels-photo-225157.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Lenses"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-sky-700 transition-colors">Lenses</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Wide selection of professional lenses for every photography style</p>
                <div className="flex items-center text-sky-600 font-bold group-hover:text-sky-700 transition-colors">
                  <span>Shop Lenses</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link
              to="/products?category=Accessory"
              className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-sky-100 hover:border-sky-300 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Accessories"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-sky-700 transition-colors">Accessories</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">Tripods, filters, and essential gear to complete your setup</p>
                <div className="flex items-center text-sky-600 font-bold group-hover:text-sky-700 transition-colors">
                  <span>Shop Accessories</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
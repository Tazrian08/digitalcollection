import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const categories = [
  'All Categories',
  'Camera',
  'Lens',
  'Accessory',
  'Lighting',
  'Tripods',
  'Storage'
];

const brands = [
  'All Brands',
  'Canon',
  'Sony',
  'Nikon',
  'Fujifilm',
  'Panasonic',
  'Olympus'
];

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedCategory = searchParams.get('category') || 'All Categories';
  const selectedBrand = searchParams.get('brand') || 'All Brands';
  const sortBy = searchParams.get('sort') || 'name';
  const fromBuilder = searchParams.get('fromBuilder') === '1';
  const builderState = searchParams.get('builderState')
    ? JSON.parse(decodeURIComponent(searchParams.get('builderState')!))
    : {};

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

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by brand
    if (selectedBrand !== 'All Brands') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, selectedCategory, selectedBrand, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All Categories' || value === 'All Brands') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div className="mb-6 lg:mb-0">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-200 mb-4">
              <Sparkles className="h-4 w-4 text-sky-500" />
              <span className="text-sm font-medium text-sky-700">Professional Equipment</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Products
            </h1>
            <p className="text-gray-600 text-lg">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="border-2 border-sky-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white/80 backdrop-blur-sm font-medium"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>

            {/* View Mode */}
            <div className="flex border-2 border-sky-200 rounded-xl bg-white/80 backdrop-blur-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-l-xl transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-sky-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-r-xl transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:text-sky-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 space-y-8 border border-sky-200">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                Filters
              </h3>

              {/* Category Filter */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-lg">Category</h4>
                <div className="space-y-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center group cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => updateFilter('category', e.target.value)}
                        className="mr-3 text-sky-600 focus:ring-sky-500 w-4 h-4"
                      />
                      <span className="text-gray-700 group-hover:text-sky-600 transition-colors font-medium">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-lg">Brand</h4>
                <div className="space-y-3">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center group cursor-pointer">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={selectedBrand === brand}
                        onChange={(e) => updateFilter('brand', e.target.value)}
                        className="mr-3 text-sky-600 focus:ring-sky-500 w-4 h-4"
                      />
                      <span className="text-gray-700 group-hover:text-sky-600 transition-colors font-medium">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-sky-200">
                <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="h-12 w-12 text-sky-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 text-lg">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id || product._id}
                    product={product}
                    fromBuilder={fromBuilder}
                    builderCategory={selectedCategory}
                    builderState={builderState}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
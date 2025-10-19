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
  'CANON',
  'Sony',
  'Nikon',
  'Fujifilm',
  'Panasonic',
  'Olympus',
  'VILTROX',
];

const PAGE_SIZE = 15;

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Query params
  const selectedCategory = searchParams.get('category') || 'All Categories';
  const selectedBrand = searchParams.get('brand') || 'All Brands';
  const sortBy = searchParams.get('sort') || 'name';
  const fromBuilder = searchParams.get('fromBuilder') === '1';
  const builderState = searchParams.get('builderState')
    ? JSON.parse(decodeURIComponent(searchParams.get('builderState')!))
    : {};
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const selectedStock = searchParams.get('stock') || 'all';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Filter + sort (does not paginate; this prepares the full filtered list)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedBrand !== 'All Brands') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // In stock filter
    if (selectedStock === 'in') {
      filtered = filtered.filter(product => product.stock > 0);
    } else if (selectedStock === 'out') {
      filtered = filtered.filter(product => product.stock === 0);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price ?? 0) - (b.price ?? 0);
        case 'price-high':
          return (b.price ?? 0) - (a.price ?? 0);
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0);
        case 'newest':
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        default:
          return String(a.name || '').localeCompare(String(b.name || ''));
      }
    });

    return filtered;
  }, [products, selectedCategory, selectedBrand, sortBy, selectedStock]);

  // Pagination math
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages); // guard if filters shrink results

  // Slice ONLY the current page items (ensures only 15 are rendered)
  const currentPageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, safePage]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if ((key === 'category' && value === 'All Categories') || (key === 'brand' && value === 'All Brands') || (key === 'stock' && value === 'all')) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    // Reset to page 1 whenever filters or sort change
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const goToPage = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
    // Optional: scroll to top on page switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // Create a compact pagination with first/last + around current
    const pages: number[] = [];
    const add = (p: number) => {
      if (p >= 1 && p <= totalPages && !pages.includes(p)) pages.push(p);
    };

    add(1);
    add(2);
    add(safePage - 2);
    add(safePage - 1);
    add(safePage);
    add(safePage + 1);
    add(safePage + 2);
    add(totalPages - 1);
    add(totalPages);

    const uniqueSorted = [...new Set(pages)].sort((a, b) => a - b);

    return (
      <div className="mt-10 flex items-center justify-center gap-2">
        <button
          onClick={() => goToPage(Math.max(1, safePage - 1))}
          disabled={safePage === 1}
          className="px-4 py-2 rounded-xl bg-white/80 border border-sky-200 text-gray-700 disabled:opacity-50 hover:bg-white shadow-sm"
        >
          Prev
        </button>

        {uniqueSorted.map((p, idx) => {
          const prev = uniqueSorted[idx - 1];
          const showDots = prev && p - prev > 1;
          return (
            <React.Fragment key={p}>
              {showDots && <span className="px-2 text-gray-400">…</span>}
              <button
                onClick={() => goToPage(p)}
                className={`px-4 py-2 rounded-xl border shadow-sm transition ${
                  p === safePage
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent'
                    : 'bg-white/80 border-sky-200 text-gray-700 hover:bg-white'
                }`}
              >
                {p}
              </button>
            </React.Fragment>
          );
        })}

        <button
          onClick={() => goToPage(Math.min(totalPages, safePage + 1))}
          disabled={safePage === totalPages}
          className="px-4 py-2 rounded-xl bg-white/80 border border-sky-200 text-gray-700 disabled:opacity-50 hover:bg-white shadow-sm"
        >
          Next
        </button>
      </div>
    );
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
              Showing {(currentPageItems.length)} of {totalItems} products
            </p>
          </div>

          <div className="flex flex-col w-full lg:w-auto space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-4">
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

            {/* View Mode - only show on desktop */}
            <div className="hidden lg:flex border-2 border-sky-200 rounded-xl bg-white/80 backdrop-blur-sm">
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

            {/* Mobile: Filter Button left below sorting */}
            <div className="flex w-full lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-2"
                style={{ marginRight: 'auto' }}
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 space-y-8 border border-sky-200">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                Filters
              </h3>
                            {/* In Stock Filter */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-lg">Stock</h4>
                <div className="space-y-3">
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      name="stock"
                      value="all"
                      checked={selectedStock === 'all'}
                      onChange={(e) => updateFilter('stock', e.target.value)}
                      className="mr-3 text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    <span className="text-gray-700 group-hover:text-sky-600 transition-colors font-medium">
                      All
                    </span>
                  </label>
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      name="stock"
                      value="in"
                      checked={selectedStock === 'in'}
                      onChange={(e) => updateFilter('stock', e.target.value)}
                      className="mr-3 text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    <span className="text-gray-700 group-hover:text-sky-600 transition-colors font-medium">
                      In Stock
                    </span>
                  </label>
                  <label className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      name="stock"
                      value="out"
                      checked={selectedStock === 'out'}
                      onChange={(e) => updateFilter('stock', e.target.value)}
                      className="mr-3 text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    <span className="text-gray-700 group-hover:text-sky-600 transition-colors font-medium">
                      Out of Stock
                    </span>
                  </label>
                </div>
              </div>

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

          {/* Products Grid (only render current page items) */}
          <div className="lg:w-3/4">
            {currentPageItems.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-sky-200">
                <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="h-12 w-12 text-sky-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 text-lg">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <>
                <div className={`grid gap-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {currentPageItems.map(product => (
                    <ProductCard
                      key={product.id || product._id}
                      product={product}
                      fromBuilder={fromBuilder}
                      builderCategory={selectedCategory}
                      builderState={builderState}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

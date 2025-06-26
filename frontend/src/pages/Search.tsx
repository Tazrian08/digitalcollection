import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowercaseQuery = query.toLowerCase().trim();
    
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.features.some(feature => 
        feature.toLowerCase().includes(lowercaseQuery)
      )
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-8">
          <SearchIcon className="h-8 w-8 text-gray-400" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
            {query && (
              <p className="text-gray-600 mt-1">
                {searchResults.length} results for "{query}"
              </p>
            )}
          </div>
        </div>

        {!query ? (
          <div className="text-center py-12">
            <SearchIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h2>
            <p className="text-gray-600">Enter a search term to find products</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12">
            <SearchIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No results found</h2>
            <p className="text-gray-600 mb-4">
              We couldn't find any products matching "{query}"
            </p>
            <div className="text-sm text-gray-500">
              <p className="mb-2">Try:</p>
              <ul className="space-y-1">
                <li>• Checking your spelling</li>
                <li>• Using different keywords</li>
                <li>• Searching for a brand name</li>
                <li>• Using more general terms</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
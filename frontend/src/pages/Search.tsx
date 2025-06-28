import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBaseUrl}/api/products/query/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Failed to fetch search results');
        const data = await res.json();
        setSearchResults(data.products || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching search results');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  console.log('Search results:', searchResults);

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
        ) : loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
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
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
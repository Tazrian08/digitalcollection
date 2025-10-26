import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext'; 
import DCLogo from "../../assets/DC_logo.png";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const cartItemCount = getCartItemCount();

  const handleAccountClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-sky-50 to-blue-50 shadow-xl sticky top-0 z-50 backdrop-blur-sm border-b border-sky-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
         <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
  <div className="relative">
    <img
      src={DCLogo}
      alt="Digital Collection Logo"
      className="h-10 w-10 object-contain group-hover:scale-110 transition-transform"
    />
  </div>
  {/* Show name on all screen sizes */}
  <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
    Digital Collection
  </span>
</Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="relative text-gray-700 hover:text-sky-600 transition-colors font-medium group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/products" className="relative text-gray-700 hover:text-sky-600 transition-colors font-medium group">
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/contact" className="relative text-gray-700 hover:text-sky-600 transition-colors font-medium group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
             <Link to="/builder" className="relative text-gray-700 hover:text-sky-600 transition-colors font-medium group">
              Builder
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cameras, lenses, accessories..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-sky-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg"
                />
                <div className="absolute left-4 top-3.5 h-5 w-5 text-sky-400 group-hover:text-sky-600 transition-colors">
                  <Search className="h-5 w-5" />
                </div>
              </div>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2">
            <Link
              to="/cart"
              className="p-3 text-gray-700 hover:text-sky-600 transition-all duration-300 hover:bg-sky-100 rounded-xl relative group"
            >
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={handleAccountClick}
                className="p-3 text-gray-700 hover:text-sky-600 transition-all duration-300 hover:bg-sky-100 rounded-xl group"
              >
                <User className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {!user ? (
                    <div className="py-2">
                      <Link
                        to="/signin"
                        className="block px-4 py-2 text-gray-700 hover:bg-sky-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="block px-4 py-2 text-gray-700 hover:bg-sky-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  ) : (
                    <div className="py-2">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-gray-700 hover:bg-sky-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-sky-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 text-gray-700 hover:text-sky-600 transition-all duration-300 hover:bg-sky-100 rounded-xl"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-sky-200 bg-white/90 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-sky-400" />
                </div>
              </form>
              
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              {/* NEW: Builder in mobile nav */}
                <Link
                  to="/builder"
                  className="block px-3 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Builder
                </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

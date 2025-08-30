import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import DCLogo from "../../assets/DC_logo.png"; // <-- Import logo

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-sky-900 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-sky-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cyan-400 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={DCLogo}
                  alt="Digital Collection Logo"
                  className="relative h-10 w-10 object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                DigitalCollection
              </span>
            </Link>
            <p className="text-sky-100 mb-6 max-w-md leading-relaxed">
              Your trusted partner for professional camera equipment. We provide high-quality cameras, 
              lenses, and accessories for photographers and videographers of all levels.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/DigitalCollectionBD/" className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-sky-300 hover:text-white hover:bg-sky-500 transition-all duration-300 hover:scale-110">
                <Facebook className="h-5 w-5" />
              </a>
              {/* <a href="#" className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-sky-300 hover:text-white hover:bg-sky-500 transition-all duration-300 hover:scale-110">
                <Twitter className="h-5 w-5" />
              </a> */}
              <a href="https://www.instagram.com/digitalcollection___?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-sky-300 hover:text-white hover:bg-sky-500 transition-all duration-300 hover:scale-110">
                <Instagram className="h-5 w-5" />
              </a>
              {/* <a href="#" className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-sky-300 hover:text-white hover:bg-sky-500 transition-all duration-300 hover:scale-110">
                <Youtube className="h-5 w-5" />
              </a> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-sky-200">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sky-100 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sky-100 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sky-100 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/builder" className="text-sky-100 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  Builder
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sky-100 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-sky-200">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-sky-100 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="/contact" className="text-sky-100 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sky-100 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  Returns
                </a>
              </li>
              <li>
                {/* <a href="#" className="text-sky-100 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  Warranty
                </a> */}
              </li>
              <li>
                <a href="/contact" className="text-sky-100 hover:text-white transition-colors hover:translate-x-1 transform duration-200 block">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sky-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sky-200 text-sm">
            © 2025 DigitalCollection. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sky-200 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sky-200 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

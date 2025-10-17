import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hand, Menu, Brain } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Personal Blueprint</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                isActive('/') ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                isActive('/about') ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              How it Works
            </Link>
            <Link 
              to="/faq" 
              className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                isActive('/faq') ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              FAQ
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                isActive('/contact') ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Link to="/intake">
                <Brain className="w-4 h-4 mr-2" />
                Build My Blueprint
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" className="md:hidden" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                isActive('/') ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                isActive('/about') ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              How it Works
            </Link>
            <Link 
              to="/faq" 
              className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                isActive('/faq') ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              FAQ
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                isActive('/contact') ? 'text-purple-600' : 'text-gray-600'
              }`}
            >
              Contact
            </Link>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full mt-2">
              <Link to="/intake">
                <Brain className="w-4 h-4 mr-2" />
                Build My Blueprint
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Link } from 'react-router-dom';
import { Hand, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Hand className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Palmistry AI</span>
            </Link>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              Discover the secrets hidden in your palm lines with AI-powered palmistry analysis. 
              Get personalized insights into your personality, relationships, and life path.
            </p>
            <p className="text-xs text-gray-500">
              * For entertainment purposes only. Not intended for medical, legal, or professional advice.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                Home
              </Link>
              <Link to="/about" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                How it Works
              </Link>
              <Link to="/faq" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                FAQ
              </Link>
              <Link to="/premium" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                Premium
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <div className="space-y-2">
              <Link to="/contact" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                Contact Us
              </Link>
              <Link to="/terms" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="block text-sm text-gray-600 hover:text-purple-600 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © 2025 Palmistry AI. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>using</span>
              <a 
                href="https://emergent.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
              >
                Emergent
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
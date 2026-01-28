import React from 'react';
import { ViewState } from '../utils/router';

interface FooterProps {
  onNavigate?: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, view: ViewState) => {
    e.preventDefault();
    if (onNavigate) onNavigate(view);
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-brand-600 text-white p-1.5 rounded-lg">
                <i className="fa-solid fa-shield-halved text-lg"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">PVA<span className="text-brand-600">Markets</span></span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              The #1 marketplace for verified accounts. Secure, fast, and reliable delivery for all your social and business needs.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/products" onClick={(e) => handleNav(e, 'products')} className="hover:text-brand-600">Social Media</a></li>
              <li><a href="/products" onClick={(e) => handleNav(e, 'products')} className="hover:text-brand-600">Payment Accounts</a></li>
              <li><a href="/products" onClick={(e) => handleNav(e, 'products')} className="hover:text-brand-600">Freelance</a></li>
              <li><a href="/products" onClick={(e) => handleNav(e, 'products')} className="hover:text-brand-600">VPN & Security</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/whyus" onClick={(e) => handleNav(e, 'whyus')} className="hover:text-brand-600">Why Choose Us</a></li>
              <li><a href="#" className="hover:text-brand-600">Reviews</a></li>
              <li><a href="#" className="hover:text-brand-600">Blog</a></li>
              <li><a href="#" className="hover:text-brand-600">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-brand-600">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-600">Contact Us</a></li>
              <li><a href="#" className="hover:text-brand-600">Telegram Channel</a></li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-600"><i className="fa-brands fa-twitter text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-brand-600"><i className="fa-brands fa-telegram text-xl"></i></a>
              <a href="#" className="text-gray-400 hover:text-brand-600"><i className="fa-brands fa-discord text-xl"></i></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} PVA Markets. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <i className="fa-brands fa-cc-visa text-gray-300 text-2xl"></i>
            <i className="fa-brands fa-cc-mastercard text-gray-300 text-2xl"></i>
            <i className="fa-brands fa-bitcoin text-gray-300 text-2xl"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};
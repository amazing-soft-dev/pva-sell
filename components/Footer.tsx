import React, { useState } from 'react';
import { ViewState } from '../utils/router';
import { useApp } from '../contexts/AppContext';

interface FooterProps {
  onNavigate?: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { openChat } = useApp();
  const [logoError, setLogoError] = useState(false);
  const logo = '/logo.png';
  
  const handleNav = (e: React.MouseEvent, view: ViewState) => {
    e.preventDefault();
    if (onNavigate) onNavigate(view);
  };

  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pt-16 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div 
              className="mb-6 cursor-pointer"
              onClick={(e) => handleNav(e, 'home')}
            >
              {!logoError ? (
                <img 
                  src={logo} 
                  alt="Credexus Market" 
                  className="h-10 w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <i className="fa-solid fa-shield-halved text-white text-xl"></i>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Credexus</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
              The #1 marketplace for verified accounts. Secure, fast, and reliable delivery for all your social and business needs.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <li><a href="/products" onClick={(e) => handleNav(e, 'products')} className="hover:text-brand-600 dark:hover:text-brand-400">Social Media</a></li>
              <li><a href="/products" onClick={(e) => handleNav(e, 'products')} className="hover:text-brand-600 dark:hover:text-brand-400">Payment Accounts</a></li>
              <li><a href="/products" onClick={(e) => handleNav(e, 'products')} className="hover:text-brand-600 dark:hover:text-brand-400">Freelance</a></li>
              <li><a href="/products" onClick={(e) => handleNav(e, 'products')} className="hover:text-brand-600 dark:hover:text-brand-400">VPN & Security</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <li><a href="/whyus" onClick={(e) => handleNav(e, 'whyus')} className="hover:text-brand-600 dark:hover:text-brand-400">Why Choose Us</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">Reviews</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">Blog</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
              <li>
                <button 
                  onClick={openChat} 
                  className="hover:text-brand-600 dark:hover:text-brand-400 text-left"
                >
                  Live Chat
                </button>
              </li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">Help Center</a></li>
              <li><a href="mailto:support@credexus.com" className="hover:text-brand-600 dark:hover:text-brand-400">Contact Us</a></li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href="https://x.com/credexus" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400" aria-label="X (Twitter)">
                <i className="fa-brands fa-x-twitter text-xl"></i>
              </a>
              <a href="https://t.me/credexusmarket" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400" aria-label="Telegram">
                <i className="fa-brands fa-telegram text-xl"></i>
              </a>
              <a href="https://discord.gg/46uhGrSS" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400" aria-label="Discord">
                <i className="fa-brands fa-discord text-xl"></i>
              </a>
              <a href="https://join.slack.com/t/credexus-market/shared_invite/zt-3n2sw70yb-7sKp7tv6F5BK4N3xzsMQeQ" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400" aria-label="Slack">
                <i className="fa-brands fa-slack text-xl"></i>
              </a>
              <a href="https://teams.live.com/l/invite/FBAHivBBV187MSG7QE?v=g1" target="_blank" rel="noopener noreferrer" className="text-gray-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400" aria-label="Microsoft Teams">
                <i className="fa-brands fa-microsoft text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-slate-500">&copy; {new Date().getFullYear()} Credexus Market. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <i className="fa-brands fa-cc-visa text-gray-300 dark:text-slate-600 text-2xl"></i>
            <i className="fa-brands fa-cc-mastercard text-gray-300 dark:text-slate-600 text-2xl"></i>
            <i className="fa-brands fa-bitcoin text-gray-300 dark:text-slate-600 text-2xl"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};
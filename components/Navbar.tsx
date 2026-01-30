import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { ViewState } from '../utils/router';
import logo from '../assets/logo.png';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenCart, onNavigate, currentView }) => {
  const { user, cart, logout, theme, toggleTheme } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setIsMenuOpen(false);
  };

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-200" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer z-50"
            onClick={() => handleNav('home')}
            aria-label="Credexus Market Home"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNav('home')}
          >
            {!logoError ? (
              <img 
                src={logo} 
                alt="Credexus Market" 
                className="h-10 sm:h-12 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
                  <i className="fa-solid fa-shield-halved text-white text-xl sm:text-2xl"></i>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Credexus</span>
              </div>
            )}
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNav('home')} 
              className={`${currentView === 'home' ? 'text-brand-600' : 'text-gray-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-brand-400 font-medium transition`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNav('products')} 
              className={`${currentView === 'products' ? 'text-brand-600' : 'text-gray-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-brand-400 font-medium transition`}
            >
              Products
            </button>
            <button 
              onClick={() => handleNav('whyus')} 
              className={`${currentView === 'whyus' ? 'text-brand-600' : 'text-gray-600 dark:text-slate-400'} hover:text-brand-600 dark:hover:text-brand-400 font-medium transition`}
            >
              Why Us
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <i className="fa-solid fa-moon text-xl"></i>
              ) : (
                <i className="fa-solid fa-sun text-xl"></i>
              )}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <button 
                  onClick={() => handleNav('profile')}
                  className={`flex items-center gap-2 text-sm font-medium ${currentView === 'profile' ? 'text-brand-600' : 'text-gray-700 dark:text-slate-300'} hover:text-brand-600 dark:hover:text-brand-400`}
                  aria-label="User Profile"
                >
                  <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </button>
                <div className="h-4 w-px bg-gray-300 dark:bg-slate-700 mx-1"></div>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium">Logout</button>
              </div>
            ) : (
              <button onClick={onOpenAuth} className="hidden sm:block text-gray-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium text-sm">
                Login / Register
              </button>
            )}
            
            <button onClick={onOpenCart} className="relative p-2 text-gray-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition" aria-label="Open shopping cart">
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-lg animate-fade-in z-30">
          <div className="px-4 py-4 space-y-4">
            <div className="space-y-2">
              <button 
                onClick={() => handleNav('home')} 
                className={`block w-full text-left px-4 py-2 rounded-lg ${currentView === 'home' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNav('products')} 
                className={`block w-full text-left px-4 py-2 rounded-lg ${currentView === 'products' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                Products
              </button>
              <button 
                onClick={() => handleNav('whyus')} 
                className={`block w-full text-left px-4 py-2 rounded-lg ${currentView === 'whyus' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                Why Us
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4">
                    <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleNav('profile')}
                    className={`block w-full text-left px-4 py-2 rounded-lg ${currentView === 'profile' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                  >
                    My Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
                  className="w-full bg-brand-600 text-white px-4 py-3 rounded-lg font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
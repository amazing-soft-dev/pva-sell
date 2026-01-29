import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { ViewState } from '../utils/router';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenCart, onNavigate, currentView }) => {
  const { user, cart, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer z-50"
            onClick={() => handleNav('home')}
          >
            <div className="bg-brand-600 text-white p-2 rounded-lg shrink-0">
              <i className="fa-solid fa-shield-halved text-xl"></i>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
              PVA<span className="text-brand-600">Markets</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNav('home')} 
              className={`${currentView === 'home' ? 'text-brand-600' : 'text-gray-600'} hover:text-brand-600 font-medium transition`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNav('products')} 
              className={`${currentView === 'products' ? 'text-brand-600' : 'text-gray-600'} hover:text-brand-600 font-medium transition`}
            >
              Products
            </button>
            <button 
              onClick={() => handleNav('whyus')} 
              className={`${currentView === 'whyus' ? 'text-brand-600' : 'text-gray-600'} hover:text-brand-600 font-medium transition`}
            >
              Why Us
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <button 
                  onClick={() => handleNav('profile')}
                  className={`flex items-center gap-2 text-sm font-medium ${currentView === 'profile' ? 'text-brand-600' : 'text-gray-700'} hover:text-brand-600`}
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1"></div>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 font-medium">Logout</button>
              </div>
            ) : (
              <button onClick={onOpenAuth} className="hidden sm:block text-gray-600 hover:text-brand-600 font-medium text-sm">
                Login / Register
              </button>
            )}
            
            <button onClick={onOpenCart} className="relative p-2 text-gray-600 hover:text-brand-600 transition">
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
              className="md:hidden p-2 text-gray-600 hover:text-brand-600 transition rounded-md hover:bg-gray-100"
            >
              <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-fade-in z-30">
          <div className="px-4 py-4 space-y-4">
            <div className="space-y-2">
              <button 
                onClick={() => handleNav('home')} 
                className={`block w-full text-left px-4 py-2 rounded-lg ${currentView === 'home' ? 'bg-brand-50 text-brand-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNav('products')} 
                className={`block w-full text-left px-4 py-2 rounded-lg ${currentView === 'products' ? 'bg-brand-50 text-brand-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Products
              </button>
              <button 
                onClick={() => handleNav('whyus')} 
                className={`block w-full text-left px-4 py-2 rounded-lg ${currentView === 'whyus' ? 'bg-brand-50 text-brand-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Why Us
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4">
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleNav('profile')}
                    className={`block w-full text-left px-4 py-2 rounded-lg ${currentView === 'profile' ? 'bg-brand-50 text-brand-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    My Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
                  className="w-full bg-brand-600 text-white px-4 py-3 rounded-lg font-bold shadow-lg shadow-brand-500/20"
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
import React from 'react';
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
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-brand-600 text-white p-2 rounded-lg">
              <i className="fa-solid fa-shield-halved text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">PVA<span className="text-brand-600">Markets</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('home')} 
              className={`${currentView === 'home' ? 'text-brand-600' : 'text-gray-600'} hover:text-brand-600 font-medium transition`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('products')} 
              className={`${currentView === 'products' ? 'text-brand-600' : 'text-gray-600'} hover:text-brand-600 font-medium transition`}
            >
              Products
            </button>
            <button 
              onClick={() => onNavigate('whyus')} 
              className={`${currentView === 'whyus' ? 'text-brand-600' : 'text-gray-600'} hover:text-brand-600 font-medium transition`}
            >
              Why Us
            </button>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center gap-2 text-sm font-medium ${currentView === 'profile' ? 'text-brand-600' : 'text-gray-700'} hover:text-brand-600`}
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                </button>
                <div className="h-4 w-px bg-gray-300 mx-1"></div>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 font-medium">Logout</button>
              </div>
            ) : (
              <button onClick={onOpenAuth} className="text-gray-600 hover:text-brand-600 font-medium">
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
          </div>
        </div>
      </div>
    </nav>
  );
};
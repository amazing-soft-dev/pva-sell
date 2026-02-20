import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { ViewState } from '../utils/router';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenCart, onNavigate, currentView }) => {
  const { user, cart, logout, theme, toggleTheme } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Correctly resolve logo path based on deployment base URL
  const base = import.meta.env.BASE_URL || '/';
  const logoPath = base.endsWith('/') ? `${base}logo.png` : `${base}/logo.png`;

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md py-1' 
          : 'bg-white dark:bg-slate-900 py-3'
      } border-b border-gray-100 dark:border-slate-800`}
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
            onClick={() => handleNav('home')}
            aria-label="Credexus Market Home"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNav('home')}
          >
            {!logoError ? (
              <img 
                src={logoPath} 
                alt="Credexus Market" 
                className="h-9 sm:h-10 w-auto object-contain"
                onError={() => setLogoError(true)}
                width="40"
                height="40"
              />
            ) : (
              <div className="h-9 w-9 sm:h-10 sm:w-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 transform hover:rotate-3 transition-transform">
                <i className="fa-solid fa-shield-halved text-white text-lg sm:text-xl"></i>
              </div>
            )}
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight sm:block hidden">
              Credexus<span className="text-brand-600">.</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {['home', 'products', 'whyus'].map((view) => (
              <button 
                key={view}
                onClick={() => handleNav(view as ViewState)} 
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  currentView === view 
                    ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' 
                    : 'text-gray-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-200'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1).replace('whyus', 'Why Us')}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'} text-lg`}></i>
            </button>

            {/* Cart Button */}
            <button 
              onClick={onOpenCart} 
              className="relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition" 
              aria-label={`Open shopping cart with ${cartCount} items`}
            >
              <i className="fa-solid fa-cart-shopping text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

            {/* Auth/Profile */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  onClick={() => handleNav('profile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition ${
                    currentView === 'profile' 
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600' 
                      : 'border-transparent text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                  aria-label="User Profile"
                >
                  <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>
                <button
                   onClick={handleLogout}
                   className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition"
                   title="Sign Out"
                   aria-label="Sign Out"
                >
                   <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth} 
                className="hidden sm:block px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-500/20 transition-all active:scale-95"
              >
                Get Started
              </button>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[50] transition-opacity duration-300 md:hidden ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Sidebar Menu */}
      <aside 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-slate-900 z-[60] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-black text-gray-900 dark:text-white">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg" aria-label="Close menu">
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {[
                { id: 'home', icon: 'fa-house', label: 'Home' },
                { id: 'products', icon: 'fa-bag-shopping', label: 'Marketplace' },
                { id: 'whyus', icon: 'fa-shield-heart', label: 'Why Us?' },
                { id: 'profile', icon: 'fa-user-circle', label: 'My Dashboard' }
            ].map((item) => (
                <button 
                    key={item.id}
                    onClick={() => handleNav(item.id as ViewState)} 
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
                        currentView === item.id 
                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25' 
                            : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                >
                    <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
                    {item.label}
                </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-800">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-black">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white leading-none">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1 truncate max-w-[150px]">{user.email}</p>
                    </div>
                </div>
                <button 
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl border border-red-100 dark:border-red-900/30 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition flex items-center justify-center gap-2"
                >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    Sign Out
                </button>
              </div>
            ) : (
                <button 
                    onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
                    className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition"
                >
                    Login / Register
                </button>
            )}
          </div>
        </div>
      </aside>
    </nav>
  );
};
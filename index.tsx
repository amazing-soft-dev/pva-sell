import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { api, Product, User, Order } from './services/api';

// --- Contexts ---

interface CartItem extends Product {
  quantity: number;
}

interface AppContextType {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        const prodData = await api.getProducts();
        setProducts(prodData);
        
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) setUser(JSON.parse(savedUser));

        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Init error", e);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const { user: u } = await api.login(email, pass);
      setUser(u);
      localStorage.setItem('currentUser', JSON.stringify(u));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const { user: u } = await api.register(name, email, pass);
      setUser(u);
      localStorage.setItem('currentUser', JSON.stringify(u));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setCart([]);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const clearCart = () => setCart([]);

  const checkout = async () => {
    if (!user) throw new Error("Must be logged in");
    setIsLoading(true);
    try {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      await api.createOrder(user.id, cart, total);
      clearCart();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, products, cart, isLoading, 
      login, register, logout, 
      addToCart, removeFromCart, clearCart, checkout 
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// --- Components ---

type ViewState = 'home' | 'profile' | 'products' | 'whyus';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenCart, onNavigate, currentView }) => {
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

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useApp();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-brand-50 rounded-lg group-hover:bg-brand-100 transition-colors">
            <i className={`${product.icon} text-3xl text-brand-600`}></i>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            In Stock: {product.stock}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{product.description}</p>
        <ul className="space-y-2 mb-6">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm text-gray-600">
              <i className="fa-solid fa-check text-green-500 mr-2"></i>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
        <div>
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">/ each</span>
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition active:scale-95 shadow-lg shadow-brand-500/30"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const FeaturesSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
    <div className="p-6">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
        <i className="fa-solid fa-bolt"></i>
      </div>
      <h3 className="text-lg font-bold mb-2">Instant Delivery</h3>
      <p className="text-gray-500">Get your accounts delivered to your dashboard and email immediately after payment.</p>
    </div>
    <div className="p-6">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
        <i className="fa-solid fa-rotate"></i>
      </div>
      <h3 className="text-lg font-bold mb-2">3-Day Replacement</h3>
      <p className="text-gray-500">If any account doesn't work, we replace it instantly within 3 days of purchase.</p>
    </div>
    <div className="p-6">
      <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
        <i className="fa-solid fa-headset"></i>
      </div>
      <h3 className="text-lg font-bold mb-2">24/7 Support</h3>
      <p className="text-gray-500">Our team is available round the clock to assist you with any issues.</p>
    </div>
  </div>
);

const Hero: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Premium Verified</span>{' '}
                <span className="block text-brand-600 xl:inline">Accounts Market</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Instant access to high-quality, phone-verified accounts for social media, freelancing, and payment gateways. Secure, anonymous, and guaranteed.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={() => onNavigate('products')}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Browse Accounts
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    onClick={() => onNavigate('whyus')}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-700 bg-brand-100 hover:bg-brand-200 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Why Choose Us
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50">
        <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center p-10">
             <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
                 <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300">
                    <i className="fa-brands fa-linkedin text-5xl text-[#0077b5] mb-4"></i>
                    <span className="font-bold text-gray-800">LinkedIn</span>
                    <span className="text-xs text-green-500 font-medium">ID Verified</span>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300 translate-y-8">
                    <i className="fa-brands fa-upwork text-5xl text-[#14a800] mb-4"></i>
                    <span className="font-bold text-gray-800">Upwork</span>
                    <span className="text-xs text-green-500 font-medium">Ready to work</span>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300">
                    <i className="fa-brands fa-discord text-5xl text-[#5865F2] mb-4"></i>
                    <span className="font-bold text-gray-800">Discord</span>
                    <span className="text-xs text-gray-500 font-medium">2015 - 2020</span>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300 translate-y-8">
                    <i className="fa-solid fa-money-check-dollar text-5xl text-gray-700 mb-4"></i>
                    <span className="font-bold text-gray-800">Payment</span>
                    <span className="text-xs text-gray-500 font-medium">Verified Accounts</span>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

const HomeView = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
  const { products } = useApp();
  const featuredProducts = products.slice(0, 3); // Show first 3 products as featured

  return (
    <>
      <Hero onNavigate={onNavigate} />
      
      {/* Featured Products Preview */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Accounts</h2>
              <p className="mt-2 text-gray-500">Our most popular verified accounts.</p>
            </div>
            <button 
              onClick={() => onNavigate('products')}
              className="text-brand-600 font-medium hover:text-brand-700 flex items-center"
            >
              View Marketplace <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Why Us Preview */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose PVA Markets?</h2>
          </div>
          <FeaturesSection />
          <div className="text-center mt-10">
            <button 
              onClick={() => onNavigate('whyus')} 
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Learn More About Us
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ProductsView = () => {
  const { products } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Social Media', 'Payment', 'Freelance', 'Developer Tools', 'Verification', 'VPN & Security'];

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = product.title.toLowerCase().includes(query) ||
                          product.description.toLowerCase().includes(query) ||
                          product.category.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Marketplace</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Browse our extensive catalog of verified accounts. Filter by category or search for specific platforms.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-brand-500 transition-colors"></i>
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm transition-all duration-200 ease-in-out"
            placeholder="Search for accounts (e.g., 'Gmail', 'old', 'verified')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
            >
                {category}
            </button>
          ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <i className="fa-solid fa-magnifying-glass text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search terms or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const WhyUsView = () => {
  return (
    <div className="bg-white animate-fade-in">
      {/* Hero Header - Enhanced with gradient and pattern */}
      <div className="relative bg-brand-900 py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent to-black/30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 drop-shadow-lg">
            Why Leading Marketers<br/>Trust <span className="text-brand-400">PVA Markets</span>
          </h1>
          <p className="mt-6 text-xl text-brand-100 max-w-3xl mx-auto font-light leading-relaxed">
            In an industry full of low-quality bots and scams, we stand apart. 
            We provide legitimate, phone-verified accounts that actually last, 
            backed by ironclad guarantees and 24/7 expert support.
          </p>
        </div>
      </div>

      {/* Trust Stats Bar */}
      <div className="bg-brand-800 border-y border-brand-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">50,000+</div>
              <div className="text-brand-200 text-sm uppercase tracking-wider">Accounts Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">99.8%</div>
              <div className="text-brand-200 text-sm uppercase tracking-wider">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">15 min</div>
              <div className="text-brand-200 text-sm uppercase tracking-wider">Avg. Support Response</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">3 Days</div>
              <div className="text-brand-200 text-sm uppercase tracking-wider">Replacement Warranty</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <div className="inline-flex items-center justify-center p-3 bg-brand-100 rounded-xl mb-6">
                <i className="fa-solid fa-shield-halved text-2xl text-brand-600"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Bank-Grade Security & Privacy</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We understand that privacy is paramount in this business. Our infrastructure is built to protect your identity and data at every step.
              </p>
              <ul className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600">
                      <i className="fa-solid fa-lock"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">Encrypted Transactions</h4>
                    <p className="mt-1 text-gray-500">We utilize 256-bit SSL encryption. We never store your credit card details; payments are handled by secure processors like Stripe and Coinbase Commerce.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600">
                      <i className="fa-solid fa-user-secret"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">Anonymous Delivery</h4>
                    <p className="mt-1 text-gray-500">Accounts are delivered directly to your private dashboard. No email logs, no public ledgers.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-50 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white border border-gray-100 shadow-2xl rounded-3xl p-8">
                 <div className="flex flex-col items-center justify-center py-12 text-center">
                    <i className="fa-solid fa-fingerprint text-8xl text-brand-100 mb-6"></i>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Zero-Trace Policy</h3>
                    <p className="text-gray-500 max-w-xs">We minimize data retention. Once your order is completed and warranty expires, unnecessary data is purged.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reliability Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Our Accounts Last Longer</h2>
            <p className="text-lg text-gray-600">
              Most vendors sell bot-created accounts that get banned in 24 hours. We do things differently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition duration-300 border border-gray-100">
               <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-6">
                 <i className="fa-solid fa-sim-card"></i>
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Real SIM Verification</h3>
               <p className="text-gray-500 leading-relaxed">
                 We use physical SIM cards for verification, not cheap VoIP numbers that are flagged by major platforms.
               </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition duration-300 border border-gray-100">
               <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl mb-6">
                 <i className="fa-solid fa-network-wired"></i>
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Residential IPs</h3>
               <p className="text-gray-500 leading-relaxed">
                 Every account is created and managed using high-quality residential proxies, mimicking real user behavior to avoid detection.
               </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition duration-300 border border-gray-100">
               <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-2xl mb-6">
                 <i className="fa-solid fa-hourglass-half"></i>
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Proper Aging</h3>
               <p className="text-gray-500 leading-relaxed">
                 We let accounts "season" (age) before listing them. Aged accounts have significantly higher trust scores and lower ban rates.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Support Section */}
      <div className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center bg-brand-600 rounded-3xl overflow-hidden shadow-2xl">
               <div className="lg:col-span-7 p-10 sm:p-16">
                  <h2 className="text-3xl font-bold text-white mb-6">We're Here When You Need Us</h2>
                  <p className="text-brand-100 text-lg mb-8 leading-relaxed">
                    Have a specific requirement? Need help with a bulk order? Or facing an issue with a purchase? Our dedicated support team is available 24/7.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="flex items-center text-white">
                        <i className="fa-solid fa-check-circle text-brand-300 mr-3 text-xl"></i>
                        <span>Live Chat Support</span>
                     </div>
                     <div className="flex items-center text-white">
                        <i className="fa-solid fa-check-circle text-brand-300 mr-3 text-xl"></i>
                        <span>Email Ticket System</span>
                     </div>
                     <div className="flex items-center text-white">
                        <i className="fa-solid fa-check-circle text-brand-300 mr-3 text-xl"></i>
                        <span>Active Telegram Channel</span>
                     </div>
                     <div className="flex items-center text-white">
                        <i className="fa-solid fa-check-circle text-brand-300 mr-3 text-xl"></i>
                        <span>Detailed FAQ & Guides</span>
                     </div>
                  </div>
               </div>
               <div className="lg:col-span-5 bg-brand-700 p-10 sm:p-16 h-full flex flex-col justify-center items-center text-center">
                   <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-brand-600 text-4xl mb-6 shadow-lg">
                      <i className="fa-solid fa-headset"></i>
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">Need Help?</h3>
                   <p className="text-brand-200 mb-6">Contact us anytime.</p>
                   <button className="bg-white text-brand-700 px-8 py-3 rounded-full font-bold hover:bg-brand-50 transition shadow-lg">
                     Open Support Ticket
                   </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const ProfileView = () => {
  const { user, products } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const data = await api.getOrders(user.id);
          setOrders(data);
        } catch (e) {
          console.error("Failed to fetch orders", e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [user]);

  const handleDownloadInvoice = (order: Order) => {
    if (!user) return;
    
    const doc = new jsPDF();
    
    // Header Branding
    doc.setTextColor(14, 165, 233); // Brand color #0ea5e9
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PVA Markets', 14, 20);
    
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Verified Accounts', 14, 26);
    doc.text('https://pvamarkets.com', 14, 31);
    
    // Invoice Info Box
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 140, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${order.id}`, 140, 28);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 140, 33);
    doc.text(`Status: ${order.status.toUpperCase()}`, 140, 38);

    // Bill To
    doc.text('Bill To:', 14, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(user.name, 14, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(user.email, 14, 60);

    // Table
    const tableColumn = ["Item Description", "Qty", "Unit Price", "Amount"];
    const tableRows = order.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return [
        product?.title || "Unknown Product",
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${(item.price * item.quantity).toFixed(2)}`
      ];
    });

    autoTable(doc, {
      startY: 70,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { 
        fillColor: [14, 165, 233], 
        textColor: 255, 
        fontStyle: 'bold',
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' }
      },
      foot: [['', '', 'Total Amount:', `$${order.total.toFixed(2)}`]],
      footStyles: { 
        fillColor: [245, 245, 245], 
        textColor: 0, 
        fontStyle: 'bold',
        halign: 'right'
      }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setDrawColor(220);
    doc.line(14, finalY, 196, finalY);
    
    doc.setFontSize(9);
    doc.setTextColor(128);
    doc.text('Thank you for your business!', 14, finalY + 10);
    doc.text('If you have any questions about this invoice, please contact support@pvamarkets.com', 14, finalY + 15);
    doc.text('This is a computer-generated document. No signature is required.', 14, finalY + 20);

    doc.save(`invoice-${order.id}.pdf`);
  };

  if (!user) return <div className="p-12 text-center text-gray-500">Please log in to view your dashboard.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-20 w-20 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-3xl font-bold border-4 border-white shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-500 text-sm break-all">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Account Status</div>
                <div className="flex items-center text-green-600 font-medium">
                  <i className="fa-solid fa-check-circle mr-2"></i> Verified Member
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500">Member ID</span>
                  <span className="font-mono text-gray-900">{user.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500">Total Orders</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center">
                <i className="fa-solid fa-clock-rotate-left mr-2 text-brand-500"></i>
                Order History
              </h3>
            </div>
            
            {loading ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-4 text-brand-400"></i>
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-box-open text-4xl text-gray-400"></i>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">When you purchase accounts, they will appear here with all details.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-brand-600 hover:text-brand-700 font-medium"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map(order => (
                  <div key={order.id} className="p-6 hover:bg-gray-50/50 transition duration-150">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-bold text-gray-900">Order #{order.id}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {order.status === 'completed' && <i className="fa-solid fa-check mr-1"></i>}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(order.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(order.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-brand-600">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="space-y-3">
                        {order.items.map((item, idx) => {
                          const product = products.find(p => p.id === item.productId);
                          return (
                            <div key={idx} className="flex justify-between items-center text-sm group">
                               <div className="flex items-center">
                                 <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center mr-3 text-brand-500">
                                   <i className={product?.icon || 'fa-solid fa-box'}></i>
                                 </div>
                                 <span className="text-gray-700 font-medium">{product?.title || 'Unknown Product'}</span>
                                 <span className="text-gray-400 mx-2">×</span>
                                 <span className="text-gray-600">{item.quantity}</span>
                               </div>
                               <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                       <button 
                         onClick={() => handleDownloadInvoice(order)}
                         className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center"
                       >
                         <i className="fa-regular fa-file-pdf mr-2"></i> Download Invoice
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
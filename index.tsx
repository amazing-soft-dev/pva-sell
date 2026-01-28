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
    <div className="bg-white">
      {/* Hero Header */}
      <div className="bg-brand-900 py-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Why Trust PVA Markets?</h1>
          <p className="text-xl text-brand-100 max-w-3xl mx-auto font-light">
            We are setting the industry standard for high-quality, verified accounts. 
            Here is how we ensure your success and safety.
          </p>
        </div>
      </div>

      {/* Main Features Grid (Summary) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FeaturesSection />
      </div>

      {/* Deep Dive Sections */}
      
      {/* Security */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-10 lg:mb-0">
               <div className="flex items-center justify-center h-16 w-16 rounded-md bg-brand-600 text-white mb-6 shadow-lg">
                  <i className="fa-solid fa-lock text-2xl"></i>
               </div>
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Unmatched Security & Privacy</h2>
               <p className="text-lg text-gray-600 mb-6">
                 Your security is our top priority. We employ military-grade encryption to protect your data and ensure that your purchase history remains confidential.
               </p>
               <ul className="space-y-4">
                 <li className="flex items-start">
                   <div className="flex-shrink-0">
                     <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
                   </div>
                   <p className="ml-3 text-base text-gray-600">
                     <strong>Safe Payments:</strong> We use Stripe and crypto payments to ensure secure transactions without storing sensitive financial data.
                   </p>
                 </li>
                 <li className="flex items-start">
                   <div className="flex-shrink-0">
                     <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
                   </div>
                   <p className="ml-3 text-base text-gray-600">
                     <strong>Clean Audit Trails:</strong> All accounts are delivered privately to your dashboard. No public ledgers or shared lists.
                   </p>
                 </li>
                 <li className="flex items-start">
                   <div className="flex-shrink-0">
                     <i className="fa-solid fa-check-circle text-green-500 mt-1"></i>
                   </div>
                   <p className="ml-3 text-base text-gray-600">
                     <strong>Strict Privacy:</strong> We never sell your data to third parties. Your business remains your business.
                   </p>
                 </li>
               </ul>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-brand-200 transform -rotate-2 rounded-2xl opacity-50"></div>
               <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                  <div className="flex flex-col items-center text-center">
                    <i className="fa-solid fa-user-shield text-6xl text-brand-200 mb-6"></i>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">100% Anonymous</h3>
                    <p className="text-gray-500">
                      Our platform is designed to protect your identity. From registration to checkout, we minimize data collection to what is strictly necessary.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reliability */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
             <div className="order-2 lg:order-1 relative">
               <div className="absolute inset-0 bg-green-100 transform rotate-2 rounded-2xl opacity-50"></div>
               <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                  <div className="space-y-6">
                    <div className="flex items-center">
                       <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">1</div>
                       <div>
                         <h4 className="font-bold text-gray-900">Real SIM Verification</h4>
                         <p className="text-sm text-gray-500">We use physical SIM cards, not VOIP numbers, ensuring high trust scores.</p>
                       </div>
                    </div>
                    <div className="flex items-center">
                       <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">2</div>
                       <div>
                         <h4 className="font-bold text-gray-900">Residential Proxies</h4>
                         <p className="text-sm text-gray-500">Accounts are created using high-quality residential IPs to mimic real user behavior.</p>
                       </div>
                    </div>
                    <div className="flex items-center">
                       <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold mr-4">3</div>
                       <div>
                         <h4 className="font-bold text-gray-900">Aging Process</h4>
                         <p className="text-sm text-gray-500">We let accounts age naturally before listing them, increasing their durability.</p>
                       </div>
                    </div>
                  </div>
               </div>
             </div>
             <div className="order-1 lg:order-2 mb-10 lg:mb-0">
               <div className="flex items-center justify-center h-16 w-16 rounded-md bg-green-600 text-white mb-6 shadow-lg">
                  <i className="fa-solid fa-server text-2xl"></i>
               </div>
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Rock-Solid Reliability</h2>
               <p className="text-lg text-gray-600 mb-6">
                 Tired of accounts getting banned immediately? So were we. That's why we developed a proprietary creation process that ensures maximum longevity.
               </p>
               <p className="text-gray-600 mb-6">
                 Our <strong>3-Day Replacement Guarantee</strong> isn't just a policy; it's a promise. If an account is flagged or disabled due to a fault on our end within 72 hours, we replace it instantly. No questions asked.
               </p>
               <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 text-green-700 font-medium">
                  <i className="fa-solid fa-check mr-2"></i> 99.8% Success Rate
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Support */}
      <div className="bg-brand-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-3xl font-bold text-gray-900 mb-4">World-Class Customer Support</h2>
           <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
             We don't just sell accounts; we support your business growth. Our team of experts is available 24/7 to help you.
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                 <i className="fa-solid fa-comments text-4xl text-brand-600 mb-4"></i>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Live Chat</h3>
                 <p className="text-gray-500">Instant answers to your questions via our website widget.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                 <i className="fa-solid fa-envelope text-4xl text-brand-600 mb-4"></i>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Email Support</h3>
                 <p className="text-gray-500">Detailed assistance for complex orders or technical issues.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                 <i className="fa-brands fa-telegram text-4xl text-brand-600 mb-4"></i>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Telegram Community</h3>
                 <p className="text-gray-500">Join our channel for updates, flash sales, and direct support.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl relative">
              <i className="fa-solid fa-quote-left text-4xl text-gray-200 absolute top-8 left-8"></i>
              <p className="text-gray-600 relative z-10 mb-6 italic pt-8">
                "I've bought hundreds of Gmail accounts for my marketing agency from various vendors, but PVA Markets is the only one that delivers consistent quality. The accounts actually last!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-brand-200 rounded-full flex items-center justify-center font-bold text-brand-700 mr-3">JD</div>
                <div>
                  <div className="font-bold text-gray-900">John Doe</div>
                  <div className="text-sm text-gray-500">Marketing Director, AdScale</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl relative">
              <i className="fa-solid fa-quote-left text-4xl text-gray-200 absolute top-8 left-8"></i>
              <p className="text-gray-600 relative z-10 mb-6 italic pt-8">
                "The support team helped me choose the right type of LinkedIn accounts for my outreach campaign. Their advice was spot on and saved me a lot of money."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-200 rounded-full flex items-center justify-center font-bold text-accent-700 mr-3">SM</div>
                <div>
                  <div className="font-bold text-gray-900">Sarah Miller</div>
                  <div className="text-sm text-gray-500">Freelance Recruiter</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
           <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-2">Are these accounts hacked?</h3>
                 <p className="text-gray-600">Absolutely not. All accounts are created by our team or our trusted partners using legitimate methods. We do not sell stolen or compromised credentials.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-2">How fast is delivery?</h3>
                 <p className="text-gray-600">Delivery is instant for 95% of our inventory. As soon as your payment is confirmed, you receive an email with login details. Custom orders (like documents) take 1-3 days.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-2">Do you offer bulk discounts?</h3>
                 <p className="text-gray-600">Yes! For orders exceeding $500, please contact our support team for a custom rate. We also have a reseller program available.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-2">What happens if an account doesn't work?</h3>
                 <p className="text-gray-600">Our 3-Day Replacement Policy covers you. If you cannot login or the account is banned upon first use, simply open a ticket with the order ID, and we will issue a fresh replacement immediately.</p>
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

// --- App Entry and Logic ---

const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500"><i className="fa-solid fa-xmark"></i></button>
        <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" placeholder="Name" className="w-full p-2 border rounded" 
              value={name} onChange={e => setName(e.target.value)} required 
            />
          )}
          <input 
            type="email" placeholder="Email" className="w-full p-2 border rounded" 
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Password" className="w-full p-2 border rounded" 
            value={password} onChange={e => setPassword(e.target.value)} required 
          />
          <button type="submit" className="w-full bg-brand-600 text-white p-2 rounded hover:bg-brand-700">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="mt-4 text-sm text-brand-600 hover:underline">
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
};

const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, checkout, user } = useApp();
  if (!isOpen) return null;
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? <p className="text-gray-500">Cart is empty</p> : cart.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.quantity} x ${item.price}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500"><i className="fa-solid fa-trash"></i></button>
            </div>
          ))}
        </div>
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between font-bold mb-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button 
            onClick={async () => {
              if (!user) { alert('Please login first'); return; }
              await checkout();
              alert('Order placed!');
              onClose();
            }}
            disabled={cart.length === 0}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState<ViewState>('home');
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <AppProvider>
      <MainLayout 
        view={view} setView={setView} 
        authOpen={authOpen} setAuthOpen={setAuthOpen} 
        cartOpen={cartOpen} setCartOpen={setCartOpen} 
      />
    </AppProvider>
  );
};

const MainLayout = ({ view, setView, authOpen, setAuthOpen, cartOpen, setCartOpen }: any) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        currentView={view} 
        onNavigate={setView} 
        onOpenAuth={() => setAuthOpen(true)} 
        onOpenCart={() => setCartOpen(true)} 
      />
      <main>
        {view === 'home' && <HomeView onNavigate={setView} />}
        {view === 'products' && <ProductsView />}
        {view === 'whyus' && <WhyUsView />}
        {view === 'profile' && <ProfileView />}
      </main>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

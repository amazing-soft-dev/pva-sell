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

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onNavigate: (view: 'home' | 'profile') => void;
  currentView: 'home' | 'profile';
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
            <button onClick={() => onNavigate('home')} className={`${currentView === 'home' ? 'text-brand-600' : 'text-gray-600'} hover:text-brand-600 font-medium transition`}>Home</button>
            <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-brand-600 font-medium transition">Products</button>
            <button onClick={() => onNavigate('home')} className="text-gray-600 hover:text-brand-600 font-medium transition">Why Us</button>
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

const Hero = () => {
  return (
    <div className="relative bg-brand-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center">
        <div className="sm:w-1/2">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Premium Verified</span>
            <span className="block text-brand-300">Social Accounts</span>
          </h1>
          <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            Boost your marketing campaigns with our high-quality, phone-verified accounts (PVA). Instant delivery, 24/7 support, and replacement guarantee.
          </p>
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-start">
            <div className="rounded-md shadow">
              <a href="#products" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition transform hover:-translate-y-1">
                View Marketplace
              </a>
            </div>
          </div>
        </div>
        <div className="sm:w-1/2 mt-10 sm:mt-0 flex justify-center">
           <div className="grid grid-cols-2 gap-4 opacity-80">
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm animate-pulse">
                 <i className="fa-brands fa-google text-6xl text-white"></i>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm mt-8">
                 <i className="fa-brands fa-facebook text-6xl text-white"></i>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm -mt-8">
                 <i className="fa-brands fa-instagram text-6xl text-white"></i>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                 <i className="fa-brands fa-twitter text-6xl text-white"></i>
              </div>
           </div>
        </div>
      </div>
    </div>
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

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register, isLoading } = useApp();
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
        setIsForgotPassword(false);
        setResetSent(false);
        setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isForgotPassword) {
        // Mock password reset
        setResetSent(true);
        return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                
                {isForgotPassword ? (
                   <>
                     <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                       Reset Password
                     </h3>
                     {resetSent ? (
                        <div className="text-center py-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <i className="fa-solid fa-check text-green-600"></i>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">
                                If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
                            </p>
                            <button
                                type="button"
                                onClick={() => { setIsForgotPassword(false); setResetSent(false); }}
                                className="text-brand-600 hover:text-brand-500 font-medium"
                            >
                                Back to Sign In
                            </button>
                        </div>
                     ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <p className="text-sm text-gray-500 mb-4">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email address</label>
                                <input 
                                  type="email" 
                                  required 
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                                  value={email}
                                  onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                            >
                                Send Reset Link
                            </button>
                            <div className="text-center mt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsForgotPassword(false)}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                     )}
                   </>
                ) : (
                    <>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        {isLogin ? 'Login to your account' : 'Create a new account'}
                        </h3>
                        {error && <div className="bg-red-50 text-red-600 p-2 rounded mb-4 text-sm">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                type="text" 
                                required 
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <input 
                            type="email" 
                            required 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                {isLogin && (
                                    <button 
                                        type="button"
                                        onClick={() => setIsForgotPassword(true)}
                                        className="text-xs text-brand-600 hover:text-brand-500"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <input 
                            type="password" 
                            required 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
                        </button>
                        </form>
                        <div className="mt-4 text-center">
                        <button 
                            type="button" 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-brand-600 hover:text-brand-500"
                        >
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                        </div>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { cart, removeFromCart, checkout, isLoading, user } = useApp();
  const [step, setStep] = useState(1); // 1: Cart, 2: Payment, 3: Success
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await checkout();
      setStep(3);
    } catch (err) {
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 1 && 'Shopping Cart'}
                {step === 2 && 'Secure Checkout'}
                {step === 3 && 'Order Confirmed'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {step === 1 && (
              <>
                {cart.length === 0 ? (
                  <div className="text-center py-10">
                    <i className="fa-solid fa-cart-shopping text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-white rounded-full border border-gray-200 text-brand-500">
                            <i className={item.icon}></i>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">${item.price.toFixed(2)} x {item.quantity}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-brand-600">${total.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => user ? setStep(2) : alert("Please login to checkout")}
                      className="w-full mt-4 bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <form onSubmit={handlePayment} className="space-y-6">
                 <div className="bg-blue-50 p-4 rounded-md mb-4 flex items-center">
                   <i className="fa-brands fa-stripe text-4xl text-blue-600 mr-4"></i>
                   <span className="text-sm text-blue-800">Payments are processed securely via Stripe. We do not store your card details.</span>
                 </div>

                 <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                   <div className="sm:col-span-6">
                     <label className="block text-sm font-medium text-gray-700">Card number</label>
                     <div className="mt-1 relative rounded-md shadow-sm">
                       <input type="text" className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-3 sm:text-sm border-gray-300 rounded-md py-2 border" placeholder="4242 4242 4242 4242" required />
                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                         <i className="fa-regular fa-credit-card text-gray-400"></i>
                       </div>
                     </div>
                   </div>

                   <div className="sm:col-span-3">
                     <label className="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</label>
                     <input type="text" className="mt-1 focus:ring-brand-500 focus:border-brand-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border" placeholder="12/25" required />
                   </div>

                   <div className="sm:col-span-3">
                     <label className="block text-sm font-medium text-gray-700">CVC</label>
                     <input type="text" className="mt-1 focus:ring-brand-500 focus:border-brand-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border" placeholder="123" required />
                   </div>
                 </div>

                 <div className="flex justify-between items-center pt-4">
                   <button type="button" onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-800">Back</button>
                   <button 
                     type="submit" 
                     disabled={isLoading}
                     className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 transition disabled:opacity-50 flex items-center"
                   >
                     {isLoading ? (
                       <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Processing...</>
                     ) : (
                       `Pay $${total.toFixed(2)}`
                     )}
                   </button>
                 </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-10">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                  <i className="fa-solid fa-check text-4xl text-green-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-500 mb-8">Thank you for your purchase. Your accounts have been sent to your email.</p>
                <button 
                  onClick={() => { setStep(1); onClose(); }}
                  className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 transition"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatWidget = ({ onOpenCart }: { onOpenCart: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { products, addToCart } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are the AI Sales Assistant for PVAMarkets. 
      We sell Verified Accounts (PVA) for Gmail, Facebook, Instagram, Twitter, etc.
      
      Current Product Inventory:
      ${products.map(p => `- ${p.title}: $${p.price} (${p.description})`).join('\n')}
      
      Your goal is to help customers choose the right account type, answer questions about verification, and facilitate the purchase process.
      - Be professional, concise, and helpful.
      - If the user explicitly asks to add a product to the cart, use the 'addToCart' tool.
      - If the user says they are ready to buy or checkout, use the 'openCheckout' tool.
      - If asked about bulk discounts, say we offer 10% off for orders over $100.
      - If asked about delivery, say it is instant via email.
      `;

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { 
            systemInstruction,
            tools: [{
                functionDeclarations: [
                    {
                        name: 'addToCart',
                        description: 'Add a product to the shopping cart. Finds the product by name.',
                        parameters: {
                            type: Type.OBJECT,
                            properties: {
                                productName: {
                                    type: Type.STRING,
                                    description: 'The name of the product to add (e.g., "Facebook", "Gmail").'
                                },
                                quantity: {
                                    type: Type.NUMBER,
                                    description: 'The number of items to add (default is 1).'
                                }
                            },
                            required: ['productName']
                        }
                    },
                    {
                        name: 'openCheckout',
                        description: 'Open the checkout modal window for the user to proceed with payment.',
                        parameters: {
                            type: Type.OBJECT,
                            properties: {}
                        }
                    }
                ]
            }]
        },
        history: messages.map(m => ({ 
            role: m.role, 
            parts: [{ text: m.text }] 
        }))
      });

      let response = await chat.sendMessage({ message: userMsg });

      // Handle function calls loop
      while (response.functionCalls && response.functionCalls.length > 0) {
        const functionResponseParts = [];
        for (const call of response.functionCalls) {
            let result = "";
            if (call.name === 'addToCart') {
                const { productName, quantity } = call.args as any;
                const qty = quantity || 1;
                const product = products.find(p => p.title.toLowerCase().includes(productName.toLowerCase()));
                
                if (product) {
                    addToCart(product, qty);
                    result = `Successfully added ${qty} x ${product.title} to the cart.`;
                } else {
                    result = `Error: Product matching "${productName}" not found. Please ask the user to specify the exact product name from the list.`;
                }
            } else if (call.name === 'openCheckout') {
                onOpenCart();
                result = "Checkout modal opened successfully.";
            }

            functionResponseParts.push({
                functionResponse: {
                    name: call.name,
                    response: { result }
                }
            });
        }
        // Send the function execution results back to the model
        response = await chat.sendMessage(functionResponseParts);
      }

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I processed your request." }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the server. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[500px]">
          <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <h3 className="font-bold">Sales Support</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-brand-700 p-1 rounded">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3 min-h-[300px]">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-10">
                <i className="fa-solid fa-robot text-2xl mb-2 text-brand-300"></i>
                <p>Hi! How can I help you with our accounts today?</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..." 
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <button type="submit" className="w-10 h-10 rounded-full bg-brand-600 text-white hover:bg-brand-700 flex items-center justify-center transition disabled:opacity-50" disabled={isTyping || !input.trim()}>
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </form>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-brand-500/50 transition-all flex items-center justify-center transform hover:scale-110"
      >
        {isOpen ? <i className="fa-solid fa-xmark text-2xl"></i> : <i className="fa-solid fa-comment-dots text-2xl"></i>}
      </button>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">PVA Markets</h3>
          <p className="text-sm">The #1 marketplace for verified social media accounts. Instant delivery and 100% satisfaction guaranteed.</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand-500">Home</a></li>
            <li><a href="#" className="hover:text-brand-500">Products</a></li>
            <li><a href="#" className="hover:text-brand-500">Support</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li><i className="fa-regular fa-envelope mr-2"></i> support@pvamarkets.com</li>
            <li><i className="fa-brands fa-telegram mr-2"></i> @pvamarkets</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-4">System Status</h4>
          <div className="flex items-center space-x-2 text-sm">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span>All Systems Operational</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Build: v2.4.0 (983f2a1)
            <br/>Deployed via GitHub Actions
          </p>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
        © 2024 PVA Markets Clone. For demonstration purposes only.
      </div>
    </div>
  </footer>
);

// --- Main App ---

const App = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { products } = useApp();

  const categories = ['All', 'Social Media', 'Payment', 'Email', 'Games & Streaming'];

  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = product.title.toLowerCase().includes(query) ||
                          product.description.toLowerCase().includes(query) ||
                          product.category.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onOpenAuth={() => setIsAuthOpen(true)} 
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={setCurrentView}
        currentView={currentView}
      />
      
      <main className="flex-grow">
        {currentView === 'home' ? (
          <>
            <Hero />
            
            <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Available Accounts</h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                  Select from our wide range of phone verified accounts.
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

            <div id="features" className="bg-white py-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
               </div>
            </div>
          </>
        ) : (
          <ProfileView />
        )}
      </main>

      <Footer />
      <ChatWidget onOpenCart={() => setIsCartOpen(true)} />
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CheckoutModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
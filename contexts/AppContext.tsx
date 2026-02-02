import React, { useState, useEffect, createContext, useContext } from 'react';
import { api, Product, User, ContactDetails } from '../services/api';
import { CustomAlert } from '../components/CustomAlert';

export interface CartItem extends Product {
  quantity: number;
}

export type Theme = 'light' | 'dark';
export type AlertType = 'success' | 'error' | 'info';

interface AppContextType {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  theme: Theme;
  isChatOpen: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, contacts: ContactDetails) => Promise<void>;
  logout: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: (contactDetails?: ContactDetails) => Promise<void>;
  toggleTheme: () => void;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  showAlert: (message: string, type?: AlertType) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Alert State
  const [alertState, setAlertState] = useState<{ isOpen: boolean; message: string; type: AlertType }>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Apply theme to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        const prodData = await api.getProducts();
        if (Array.isArray(prodData)) {
            setProducts(prodData);
        }
        
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) setUser(JSON.parse(savedUser));

        const savedCart = localStorage.getItem('cart');
        if (savedCart) setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Init error: Failed to connect to backend.", e);
        // Do not crash the app, just leave products empty
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

  const register = async (name: string, email: string, pass: string, contacts: ContactDetails) => {
    setIsLoading(true);
    try {
      const { user: u } = await api.register(name, email, pass, contacts);
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

  const checkout = async (contactDetails?: ContactDetails) => {
    // Validation handled by caller or API, but ensure we have something
    if (!user && !contactDetails) throw new Error("Contact details required for checkout");
    
    setIsLoading(true);
    try {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const userId = user ? user.id : null;
      // If user is logged in, we try to use their stored contacts (handled in backend if contactDetails is missing)
      // If guest, contactDetails is mandatory
      
      await api.createOrder(userId, cart, total, contactDetails);
      clearCart();
    } finally {
      setIsLoading(false);
    }
  };

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const toggleChat = () => setIsChatOpen(prev => !prev);

  const showAlert = (message: string, type: AlertType = 'info') => {
    setAlertState({ isOpen: true, message, type });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <AppContext.Provider value={{ 
      user, products, cart, isLoading, theme, isChatOpen,
      login, register, logout, 
      addToCart, removeFromCart, clearCart, checkout, toggleTheme,
      openChat, closeChat, toggleChat,
      showAlert
    }}>
      {children}
      <CustomAlert 
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={closeAlert}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
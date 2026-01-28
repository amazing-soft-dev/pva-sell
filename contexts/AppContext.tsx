import React, { useState, useEffect, createContext, useContext } from 'react';
import { api, Product, User } from '../services/api';

export interface CartItem extends Product {
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
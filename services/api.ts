// Types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  icon: string;
  description: string;
  features: string[];
}

export interface Order {
  id: string;
  userId: string | null;
  guestEmail?: string;
  items: { productId: string; title: string; quantity: number; price: number }[];
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed';
}

// API URL (Relative for proxy or absolute)
const API_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    
    // Store token
    localStorage.setItem('authToken', data.token);
    return data;
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    
    localStorage.setItem('authToken', data.token);
    return data;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  // Orders
  createOrder: async (userId: string | null, items: any[], total: number, guestEmail?: string): Promise<Order> => {
    // Simplify items for backend storage (ensure title is included for history)
    const orderItems = items.map(i => ({
        productId: i.id,
        title: i.title,
        quantity: i.quantity,
        price: i.price
    }));

    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, guestEmail, items: orderItems, total })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create order');
    return data;
  },

  getOrders: async (userId: string, userEmail?: string): Promise<Order[]> => {
    let url = `${API_URL}/orders?userId=${userId}`;
    if (userEmail) url += `&email=${userEmail}`;
    
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  // Chat
  sendChatMessage: async (message: string, history: { role: string; content: string }[]) => {
      const res = await fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Chat error');
      return data;
  }
};
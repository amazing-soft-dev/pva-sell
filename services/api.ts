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

// Helper to handle responses and check for valid JSON
const handleResponse = async (res: Response) => {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API request failed');
    return data;
  } else {
    // If response is not JSON (likely HTML from 404/500/Proxy error)
    const text = await res.text();
    console.warn("Received non-JSON response:", text.substring(0, 150));
    throw new Error("Server not reachable. Please ensure the backend server is running on port 5000.");
  }
};

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(res);
    
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
    const data = await handleResponse(res);
    
    localStorage.setItem('authToken', data.token);
    return data;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(`${API_URL}/products`);
    return handleResponse(res);
  },

  // Orders
  createOrder: async (userId: string | null, items: any[], total: number, guestEmail?: string): Promise<Order> => {
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
    return handleResponse(res);
  },

  getOrders: async (userId: string, userEmail?: string): Promise<Order[]> => {
    let url = `${API_URL}/orders?userId=${userId}`;
    if (userEmail) url += `&email=${userEmail}`;
    
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },

  // Chat
  sendChatMessage: async (message: string, history: { role: string; content: string }[]) => {
      const res = await fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history })
      });
      return handleResponse(res);
  },

  // Admin
  adminLogin: async (password: string) => {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return handleResponse(res);
  },

  getAllOrders: async (): Promise<Order[]> => {
    const res = await fetch(`${API_URL}/admin/orders`);
    return handleResponse(res);
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const res = await fetch(`${API_URL}/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  }
};
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

// ENVIRONMENT CONFIGURATION
// Use safe access pattern. Remove trailing slash if present to avoid //api/products.
const getBaseUrl = () => {
  let url = (import.meta as any).env?.VITE_API_URL || '/api';
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
};

const BASE_URL = getBaseUrl();

const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper to handle responses safely
const handleResponse = async (res: Response, url: string) => {
  const text = await res.text();
  
  try {
    const data = JSON.parse(text);
    if (!res.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }
    return data;
  } catch (e) {
    // If we get an HTML response (starts with <), it's usually a 404/500 from the proxy or web server
    // indicating the API endpoint is not hit correctly.
    if (text.trim().startsWith('<')) {
      console.error(`API Error: Received HTML instead of JSON from ${url}`);
      console.error("Preview of response:", text.substring(0, 100));
      throw new Error(`Server connection failed. Ensure the backend is running. (Got HTML response from ${url})`);
    }
    throw e;
  }
};

// Wrapper to catch Network Errors
const fetchWithCheck = async (endpoint: string, options: RequestInit = {}) => {
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${cleanEndpoint}`;

    try {
        const res = await fetch(url, options);
        return await handleResponse(res, url);
    } catch (error: any) {
        console.error(`API Call Failed [${url}]:`, error.message);
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error("Backend server unreachable. Please run 'npm run dev:server' or check your connection.");
        }
        throw error;
    }
};

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const data = await fetchWithCheck(`/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    const data = await fetchWithCheck(`/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    return fetchWithCheck(`/products`);
  },

  // Orders
  createOrder: async (userId: string | null, items: any[], total: number, guestEmail?: string): Promise<Order> => {
    const orderItems = items.map(i => ({
        productId: i.id,
        title: i.title,
        quantity: i.quantity,
        price: i.price
    }));

    return fetchWithCheck(`/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, guestEmail, items: orderItems, total })
    });
  },

  getOrders: async (userId: string, userEmail?: string): Promise<Order[]> => {
    let query = `?userId=${userId}`;
    if (userEmail) query += `&email=${userEmail}`;
    
    return fetchWithCheck(`/orders${query}`, { headers: getHeaders() });
  },

  // Chat
  sendChatMessage: async (message: string, history: { role: string; content: string }[]) => {
      return fetchWithCheck(`/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history })
      });
  },

  // Admin
  adminLogin: async (password: string) => {
    return fetchWithCheck(`/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
  },

  getAllOrders: async (): Promise<Order[]> => {
    return fetchWithCheck(`/admin/orders`, { headers: getHeaders() });
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    return fetchWithCheck(`/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getHeaders() as any },
      body: JSON.stringify({ status })
    });
  }
};
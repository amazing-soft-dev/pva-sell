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
// If VITE_API_URL is set (in .env), use it. 
// Otherwise, in Dev use '/api' (proxy).
// Use safe access pattern (import.meta as any).env? to prevent "Cannot read properties of undefined"
const BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper to handle responses safely
const handleResponse = async (res: Response) => {
  // We get the text first to avoid "Unexpected token <" if JSON.parse fails on streams directly
  const text = await res.text();
  
  try {
    // Try to parse the text as JSON
    const data = JSON.parse(text);
    
    // Check for API-level errors
    if (!res.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }
    
    return data;
  } catch (e) {
    // If it's not JSON, it's likely HTML (404/500/Proxy Error)
    if (e instanceof SyntaxError) {
      console.warn("API returned non-JSON response:", text.substring(0, 150));
      throw new Error(`Server connection failed. The server returned HTML instead of data. Check VITE_API_URL.`);
    }
    // Re-throw other errors (like the API error thrown in the try block)
    throw e;
  }
};

// Wrapper to catch Network Errors
const fetchWithCheck = async (endpoint: string, options: RequestInit = {}) => {
    // Ensure we don't double slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Handle potential double /api if user put it in ENV and we also have it in path
    // But simplistic approach: join BASE + endpoint
    const url = `${BASE_URL}${cleanEndpoint}`;

    try {
        const res = await fetch(url, options);
        return await handleResponse(res);
    } catch (error: any) {
        console.error(`API Call Failed [${url}]:`, error);
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error("Backend server unreachable. Please check your internet or server status.");
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
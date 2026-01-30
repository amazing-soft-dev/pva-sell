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
    throw new Error("Server response invalid. Please check if backend is running.");
  }
};

// Wrapper to catch Network Errors (Server down)
const fetchWithCheck = async (url: string, options: RequestInit = {}) => {
    try {
        const res = await fetch(url, options);
        return handleResponse(res);
    } catch (error: any) {
        console.error("API Error:", error);
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error("Backend server unreachable. Run 'npm run server' in a separate terminal.");
        }
        throw error;
    }
};

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    return fetchWithCheck(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    // Response handled by wrapper
    const data = await fetchWithCheck(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    localStorage.setItem('authToken', data.token);
    return data;
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    const data = await fetchWithCheck(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    localStorage.setItem('authToken', data.token);
    return data;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    return fetchWithCheck(`${API_URL}/products`);
  },

  // Orders
  createOrder: async (userId: string | null, items: any[], total: number, guestEmail?: string): Promise<Order> => {
    const orderItems = items.map(i => ({
        productId: i.id,
        title: i.title,
        quantity: i.quantity,
        price: i.price
    }));

    return fetchWithCheck(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, guestEmail, items: orderItems, total })
    });
  },

  getOrders: async (userId: string, userEmail?: string): Promise<Order[]> => {
    let url = `${API_URL}/orders?userId=${userId}`;
    if (userEmail) url += `&email=${userEmail}`;
    
    return fetchWithCheck(url, { headers: getHeaders() });
  },

  // Chat
  sendChatMessage: async (message: string, history: { role: string; content: string }[]) => {
      return fetchWithCheck(`${API_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history })
      });
  },

  // Admin
  adminLogin: async (password: string) => {
    return fetchWithCheck(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
  },

  getAllOrders: async (): Promise<Order[]> => {
    return fetchWithCheck(`${API_URL}/admin/orders`);
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    return fetchWithCheck(`${API_URL}/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  }
};
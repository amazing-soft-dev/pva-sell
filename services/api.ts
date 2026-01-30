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
const getBaseUrl = () => {
  // 1. Check if VITE_API_URL is set.
  // We check import.meta.env (standard Vite) AND process.env (injected via vite.config.ts define)
  // This ensures that even if one method fails during the GH Actions build, the other might catch it.
  let url = import.meta.env.VITE_API_URL || (process.env.VITE_API_URL as string);

  // 2. Fallback for local development (uses Vite proxy pointing to localhost:5000)
  if (!url) {
    // If we are in production (e.g. GitHub Pages) and url is missing, this is critical.
    if (import.meta.env.PROD) {
      console.error("CRITICAL: VITE_API_URL is missing in production build. API calls will fail (404).");
    }
    url = '/api';
  }

  // Remove trailing slash if present to avoid double slashes (e.g. //api/products)
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
    // Attempt to parse JSON
    const data = JSON.parse(text);
    
    // If it's a JSON response but has an API-level error status code (e.g. 400, 401, 500)
    // The backend should return { message: "..." } or { error: "..." }
    if (!res.ok) {
        throw new Error(data.message || data.error || `API Error: ${res.status} ${res.statusText}`);
    }
    return data;
  } catch (e: any) {
    // If the error was thrown by our check above, re-throw it
    if (e.message && e.message.startsWith('API Error')) {
      throw e;
    }

    // Otherwise, it's likely a JSON SyntaxError (parsing failed)
    // This happens when the server (or proxy) returns plain text (e.g. "504 Gateway Timeout", "404 Not Found")
    // instead of JSON.
    const isJsonError = e instanceof SyntaxError || e.message.includes('Unexpected token') || e.message.includes('Unexpected non-whitespace');
    
    if (isJsonError) {
        console.error(`API Parse Error [${url}]: Response was not JSON.`);
        console.error(`Status: ${res.status} ${res.statusText}`);
        
        // Truncate long HTML/text for cleaner logs
        const preview = text.length > 200 ? text.substring(0, 200) + '...' : text;
        console.error(`Body Preview: "${preview}"`);
        
        // Provide a user-friendly error based on status code
        if (res.status === 404) {
             throw new Error(`Endpoint not found (${url}). The frontend is trying to reach a missing URL.`);
        }
        if (res.status === 502 || res.status === 503 || res.status === 504) {
             throw new Error(`Server unreachable (${res.status}). The backend might be starting up or down.`);
        }
        if (!res.ok) {
            throw new Error(`Server Error (${res.status}): ${text.substring(0, 100)}`);
        }
        
        // If status was 200 but content wasn't JSON (very rare)
        throw new Error(`Invalid API Response: Expected JSON but got text.`);
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
        
        // Enhance network error messages
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
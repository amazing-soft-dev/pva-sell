// Types
export interface ContactDetails {
  telegram: string;
  discord?: string;
  whatsapp?: string;
  other?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  contacts?: ContactDetails;
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
  contactDetails?: ContactDetails; // Replaces guestEmail as primary contact info
  guestEmail?: string; // Added for backward compatibility/admin view display
  items: { productId: string; title: string; quantity: number; price: number }[];
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed';
}

// ENVIRONMENT CONFIGURATION
const getBaseUrl = () => {
  // 1. Try safe access to import.meta.env
  let url = import.meta.env?.VITE_API_URL;

  // 2. Fallback to global constant injected by Vite define
  if (!url && typeof __API_URL__ !== 'undefined') {
    url = __API_URL__;
  }

  // 3. Fallback for local development (uses Vite proxy pointing to localhost:5000)
  if (!url) {
    url = '/api';
  }

  // Remove trailing slash if present to avoid double slashes (e.g. //api/products)
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  
  // Debug log to verify URL in production
  console.log('[API] Base URL configured as:', url);
  
  return url;
};

let BASE_URL = getBaseUrl();

export const apiConfig = {
  getUrl: () => BASE_URL,
  setUrl: (url: string) => {
    BASE_URL = url.endsWith('/') ? url.slice(0, -1) : url;
    console.log('[API] URL updated to:', BASE_URL);
  },
  resetUrl: () => {
    BASE_URL = getBaseUrl();
    console.log('[API] URL reset to:', BASE_URL);
  }
};

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
    // Use dynamic BASE_URL
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

  register: async (name: string, email: string, password: string, contacts: ContactDetails): Promise<{ user: User; token: string }> => {
    const data = await fetchWithCheck(`/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, contacts })
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
  createOrder: async (userId: string | null, items: any[], total: number, contactDetails?: ContactDetails): Promise<Order> => {
    const orderItems = items.map(i => ({
        productId: i.id,
        title: i.title,
        quantity: i.quantity,
        price: i.price
    }));

    return fetchWithCheck(`/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, contactDetails, items: orderItems, total })
    });
  },

  getOrders: async (userId: string): Promise<Order[]> => {
    let query = `?userId=${userId}`;
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
import { v4 as uuidv4 } from 'uuid';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // In a real app, this is hashed on server
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
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  date: string;
  status: 'pending' | 'completed';
}

// Mock Data
const INITIAL_PRODUCTS: Product[] = [
  // Social Media
  {
    id: '1',
    title: 'Facebook Accounts (Aged)',
    category: 'Social Media',
    price: 3.50,
    stock: 200,
    icon: 'fa-brands fa-facebook',
    description: 'Marketplace enabled Facebook accounts with friends.',
    features: ['Marketplace Active', 'Profile Picture', '2FA Enabled']
  },
  {
    id: '2',
    title: 'Instagram Accounts',
    category: 'Social Media',
    price: 2.00,
    stock: 350,
    icon: 'fa-brands fa-instagram',
    description: 'High quality Instagram accounts ready for posting.',
    features: ['Email Verified', 'Phone Verified', 'Unique IP']
  },
  {
    id: '3',
    title: 'Twitter/X Accounts',
    category: 'Social Media',
    price: 1.80,
    stock: 150,
    icon: 'fa-brands fa-twitter',
    description: 'Token verified X accounts for marketing.',
    features: ['Token Login', 'Email Included', 'No Shadowban']
  },
  {
    id: '4',
    title: 'LinkedIn Accounts',
    category: 'Social Media',
    price: 8.00,
    stock: 50,
    icon: 'fa-brands fa-linkedin',
    description: 'Professional LinkedIn profiles with connections.',
    features: ['50+ Connections', 'Complete Profile', 'Aged']
  },
  {
    id: '5',
    title: 'TikTok Accounts',
    category: 'Social Media',
    price: 2.50,
    stock: 500,
    icon: 'fa-brands fa-tiktok',
    description: 'TikTok accounts eligible for creator fund.',
    features: ['US Region', 'Email Verified', 'Phone Verified']
  },
  {
    id: '6',
    title: 'Reddit Accounts (High Karma)',
    category: 'Social Media',
    price: 12.00,
    stock: 30,
    icon: 'fa-brands fa-reddit',
    description: 'Aged Reddit accounts with post karma.',
    features: ['1000+ Karma', 'Aged 1 Year+', 'Email Verified']
  },
  
  // Payment
  {
    id: '20',
    title: 'PayPal Accounts (Verified)',
    category: 'Payment',
    price: 15.00,
    stock: 20,
    icon: 'fa-brands fa-paypal',
    description: 'Verified PayPal accounts with transaction history.',
    features: ['SSN Verified', 'Bank Attached', 'Cookies Included']
  },
  {
    id: '21',
    title: 'CashApp Accounts',
    category: 'Payment',
    price: 25.00,
    stock: 15,
    icon: 'fa-solid fa-dollar-sign',
    description: 'BTC enabled CashApp accounts.',
    features: ['BTC Enabled', 'Email Access', 'Full Info']
  },
  {
    id: '22',
    title: 'Stripe Accounts',
    category: 'Payment',
    price: 45.00,
    stock: 5,
    icon: 'fa-brands fa-stripe',
    description: 'Fully verified Stripe dashboards.',
    features: ['Business Verified', 'Payouts Ready', 'Docs Included']
  },
  {
    id: '23',
    title: 'Wise Accounts',
    category: 'Payment',
    price: 35.00,
    stock: 10,
    icon: 'fa-solid fa-money-bill-transfer',
    description: 'Verified Wise (TransferWise) accounts.',
    features: ['Multi-currency', 'Card Enabled', 'Docs Included']
  },

  // Email
  {
    id: '10',
    title: 'Gmail Accounts (Old)',
    category: 'Email',
    price: 1.50,
    stock: 500,
    icon: 'fa-brands fa-google',
    description: 'Aged Gmail accounts, guaranteed login.',
    features: ['Phone Verified', 'Recovery Added', '7+ Days Aged']
  },
  {
    id: '11',
    title: 'Outlook Accounts',
    category: 'Email',
    price: 0.80,
    stock: 1000,
    icon: 'fa-brands fa-microsoft',
    description: 'Fresh Outlook/Hotmail accounts.',
    features: ['SMTP Enabled', 'Phone Verified', 'High Limit']
  },
  {
    id: '12',
    title: 'Yahoo Mail Accounts',
    category: 'Email',
    price: 0.60,
    stock: 800,
    icon: 'fa-brands fa-yahoo',
    description: 'Verified Yahoo accounts for bulk mailing.',
    features: ['Phone Verified', 'Less Secure Apps', 'POP3 Enabled']
  },

  // Games & Streaming
  {
    id: '30',
    title: 'Discord Tokens (Aged)',
    category: 'Games & Streaming',
    price: 0.50,
    stock: 1000,
    icon: 'fa-brands fa-discord',
    description: 'Fully verified Discord tokens for developers.',
    features: ['Phone Verified', 'Email Verified', 'Instant Delivery']
  },
  {
    id: '31',
    title: 'Netflix Premium',
    category: 'Games & Streaming',
    price: 3.00,
    stock: 100,
    icon: 'fa-solid fa-play',
    description: 'Private Netflix UHD profiles.',
    features: ['4K UHD', 'Private Profile', '1 Month Warranty']
  },
  {
    id: '32',
    title: 'Steam Accounts',
    category: 'Games & Streaming',
    price: 5.00,
    stock: 40,
    icon: 'fa-brands fa-steam',
    description: 'Steam accounts with unlocked market.',
    features: ['Market Unlocked', 'No VAC Ban', 'Original Email']
  },
  {
    id: '33',
    title: 'Spotify Premium',
    category: 'Games & Streaming',
    price: 2.00,
    stock: 150,
    icon: 'fa-brands fa-spotify',
    description: 'Individual Spotify Premium upgrades.',
    features: ['On Your Email', 'Lifetime Warranty', 'Legal Upgrade']
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Database Service
export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === email && u.passwordHash === btoa(password));
    
    if (!user) throw new Error('Invalid credentials');
    
    return {
      user: { id: user.id, email: user.email, name: user.name, passwordHash: 'HIDDEN' },
      token: 'mock-jwt-token-' + Date.now()
    };
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    await delay(1000);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: User) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      passwordHash: btoa(password) // Simple mock hashing
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return {
      user: { ...newUser, passwordHash: 'HIDDEN' },
      token: 'mock-jwt-token-' + Date.now()
    };
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    await delay(500);
    return INITIAL_PRODUCTS;
  },

  // Orders
  createOrder: async (userId: string, items: any[], total: number): Promise<Order> => {
    await delay(2000); // Simulate payment processing time
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const newOrder: Order = {
      id: 'ORD-' + Math.floor(Math.random() * 100000),
      userId,
      items,
      total,
      date: new Date().toISOString(),
      status: 'completed'
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    return newOrder;
  },

  getOrders: async (userId: string): Promise<Order[]> => {
    await delay(600);
    const orders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};
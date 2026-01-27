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
  // Social Media - LinkedIn
  {
    id: 'li-1',
    title: 'LinkedIn (10+ Year, ID Verified)',
    category: 'Social Media',
    price: 300,
    stock: 10,
    icon: 'fa-brands fa-linkedin',
    description: '10+ year old account, ID Verified with 500+ connections.',
    features: ['10+ Years Old', 'ID Verified', '500+ Connections', 'US/EU/Canada']
  },
  {
    id: 'li-2',
    title: 'LinkedIn (10+ Year, Non-ID)',
    category: 'Social Media',
    price: 200,
    stock: 15,
    icon: 'fa-brands fa-linkedin',
    description: '10+ year old account, 500+ connections, not ID verified.',
    features: ['10+ Years Old', '500+ Connections', 'US/EU/Canada']
  },
  {
    id: 'li-3',
    title: 'LinkedIn Account (Standard)',
    category: 'Social Media',
    price: 150,
    stock: 50,
    icon: 'fa-brands fa-linkedin',
    description: 'Standard verified LinkedIn account.',
    features: ['Phone Verified', 'Email Access']
  },

  // Freelance - Upwork
  {
    id: 'up-1',
    title: 'Upwork Account',
    category: 'Freelance',
    price: 300,
    stock: 5,
    icon: 'fa-brands fa-upwork',
    description: 'Fully approved Upwork account ready for work. ($100/mo fee separately).',
    features: ['Profile Approved', 'Ready to Apply', '10% off for 5+ orders']
  },

  // Verification
  {
    id: 'doc-1',
    title: 'Custom Document (1 Day)',
    category: 'Verification',
    price: 70,
    stock: 999,
    icon: 'fa-solid fa-file-contract',
    description: 'Custom verification document creation in 24 hours.',
    features: ['High Quality', '1 Day Turnaround', 'Printable']
  },
  {
    id: 'doc-2',
    title: 'Custom Document (3 Days)',
    category: 'Verification',
    price: 50,
    stock: 999,
    icon: 'fa-solid fa-file-contract',
    description: 'Custom verification document creation in 3 days.',
    features: ['High Quality', '3 Day Turnaround', 'Printable']
  },

  // Payment Accounts - Custom
  { id: 'pay-1', title: 'Custom Payoneer', category: 'Payment', price: 200, stock: 20, icon: 'fa-solid fa-money-check-dollar', description: 'Custom created Payoneer account.', features: ['Fully Verified', 'Custom Details'] },
  { id: 'pay-2', title: 'Custom Company Payoneer', category: 'Payment', price: 300, stock: 10, icon: 'fa-solid fa-briefcase', description: 'Business Payoneer account.', features: ['Business Verified', 'Custom Details'] },
  { id: 'pay-3', title: 'Custom Airtm', category: 'Payment', price: 150, stock: 20, icon: 'fa-solid fa-wallet', description: 'Verified Airtm account.', features: ['Fully Verified'] },
  { id: 'pay-4', title: 'Custom Hurupay', category: 'Payment', price: 150, stock: 20, icon: 'fa-solid fa-wallet', description: 'Verified Hurupay account.', features: ['Fully Verified'] },
  { id: 'pay-5', title: 'Custom Fluidkey', category: 'Payment', price: 150, stock: 20, icon: 'fa-solid fa-key', description: 'Verified Fluidkey account.', features: ['Fully Verified'] },
  
  // Payment Accounts - Standard
  { id: 'pay-6', title: 'PayPal (Personal)', category: 'Payment', price: 100, stock: 50, icon: 'fa-brands fa-paypal', description: 'Verified Personal PayPal account.', features: ['Phone Verified', 'Email Verified'] },
  { id: 'pay-7', title: 'Payoneer (Ready)', category: 'Payment', price: 120, stock: 40, icon: 'fa-solid fa-money-check', description: 'Ready to use Payoneer account.', features: ['Verified'] },
  { id: 'pay-8', title: 'Nexo', category: 'Payment', price: 120, stock: 30, icon: 'fa-solid fa-coins', description: 'Verified Nexo crypto account.', features: ['KYC Verified'] },
  { id: 'pay-9', title: 'Paxful', category: 'Payment', price: 80, stock: 30, icon: 'fa-solid fa-hand-holding-dollar', description: 'Verified Paxful account.', features: ['Level 2 Verified'] },
  
  // Crypto Exchanges / Wallets
  { id: 'ex-1', title: 'Cwallet', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-wallet', description: 'Verified Cwallet.', features: ['Verified'] },
  { id: 'ex-2', title: 'Bybit', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-chart-line', description: 'Verified Bybit account.', features: ['KYC Verified'] },
  { id: 'ex-3', title: 'Kucoin', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-chart-simple', description: 'Verified Kucoin account.', features: ['KYC Verified'] },
  { id: 'ex-4', title: 'Mexc', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-chart-pie', description: 'Verified Mexc account.', features: ['KYC Verified'] },
  { id: 'ex-5', title: 'OKX', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-o', description: 'Verified OKX account.', features: ['KYC Verified'] },
  { id: 'ex-6', title: 'Gate.io', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-door-open', description: 'Verified Gate.io account.', features: ['KYC Verified'] },

  // Card Services
  { id: 'card-1', title: 'Capitalist', category: 'Payment', price: 80, stock: 25, icon: 'fa-solid fa-credit-card', description: 'Verified Capitalist account.', features: ['Card Enabled'] },
  { id: 'card-2', title: 'Kauri', category: 'Payment', price: 80, stock: 25, icon: 'fa-solid fa-credit-card', description: 'Verified Kauri account.', features: ['Verified'] },
  { id: 'card-3', title: 'Noones', category: 'Payment', price: 50, stock: 25, icon: 'fa-solid fa-credit-card', description: 'Verified Noones account.', features: ['Verified'] },

  // Discord
  { id: 'disc-1', title: 'Discord 2015', category: 'Social Media', price: 54.99, stock: 5, icon: 'fa-brands fa-discord', description: 'Rare 2015 Creation Date Discord Account.', features: ['Aged 2015', 'Early Supporter Potential'] },
  { id: 'disc-2', title: 'Discord 2016', category: 'Social Media', price: 17.99, stock: 10, icon: 'fa-brands fa-discord', description: 'Aged 2016 Discord Account.', features: ['Aged 2016'] },
  { id: 'disc-3', title: 'Discord 2017', category: 'Social Media', price: 14.99, stock: 15, icon: 'fa-brands fa-discord', description: 'Aged 2017 Discord Account.', features: ['Aged 2017'] },
  { id: 'disc-4', title: 'Discord 2018', category: 'Social Media', price: 10.99, stock: 20, icon: 'fa-brands fa-discord', description: 'Aged 2018 Discord Account.', features: ['Aged 2018'] },
  { id: 'disc-5', title: 'Discord 2019', category: 'Social Media', price: 7.99, stock: 30, icon: 'fa-brands fa-discord', description: 'Aged 2019 Discord Account.', features: ['Aged 2019'] },
  { id: 'disc-6', title: 'Discord 2020', category: 'Social Media', price: 4.99, stock: 50, icon: 'fa-brands fa-discord', description: 'Aged 2020 Discord Account.', features: ['Aged 2020'] },

  // Github
  { id: 'git-1', title: 'Github (2009-2013)', category: 'Developer Tools', price: 30, stock: 10, icon: 'fa-brands fa-github', description: 'Very old Github account.', features: ['Aged 2009-2013'] },
  { id: 'git-2', title: 'Github (2014-2019)', category: 'Developer Tools', price: 25, stock: 20, icon: 'fa-brands fa-github', description: 'Aged Github account.', features: ['Aged 2014-2019'] },
  { id: 'git-3', title: 'Github (2020+)', category: 'Developer Tools', price: 20, stock: 50, icon: 'fa-brands fa-github', description: 'Established Github account.', features: ['Aged 2020+'] },
  { id: 'git-4', title: 'Github Arctic Badge', category: 'Developer Tools', price: 60, stock: 5, icon: 'fa-brands fa-github', description: 'Github account with Arctic Code Vault badge.', features: ['Arctic Badge'] },
  { id: 'git-5', title: 'Github Pull Shark', category: 'Developer Tools', price: 40, stock: 8, icon: 'fa-brands fa-github', description: 'Github account with Pull Shark badge.', features: ['Pull Shark Badge'] },
  { id: 'git-6', title: 'Github 100 Stars/Followers', category: 'Developer Tools', price: 60, stock: 5, icon: 'fa-brands fa-github', description: 'High rep Github account.', features: ['100+ Stars', '100+ Followers'] },

  // Twitter
  { id: 'tw-1', title: 'Old Twitter (Not Verified)', category: 'Social Media', price: 20, stock: 100, icon: 'fa-brands fa-twitter', description: 'Aged Twitter account, email verified.', features: ['Aged', 'Email Verified'] },

  // Facebook
  { id: 'fb-1', title: 'Facebook (4-5 Years Old)', category: 'Social Media', price: 25, stock: 80, icon: 'fa-brands fa-facebook', description: 'Aged Facebook account with history.', features: ['4-5 Years Old', 'Marketplace Access'] },

  // Telegram
  { id: 'tg-1', title: 'Telegram Premium (3 Months)', category: 'Social Media', price: 25, stock: 100, icon: 'fa-brands fa-telegram', description: 'Gift link for 3 months premium.', features: ['Instant Delivery', 'Gift Link'] },
  { id: 'tg-2', title: 'Telegram Premium (6 Months)', category: 'Social Media', price: 35, stock: 100, icon: 'fa-brands fa-telegram', description: 'Gift link for 6 months premium.', features: ['Instant Delivery', 'Gift Link'] },
  { id: 'tg-3', title: 'Telegram Premium (1 Year)', category: 'Social Media', price: 40, stock: 100, icon: 'fa-brands fa-telegram', description: 'Gift link for 1 year premium.', features: ['Instant Delivery', 'Gift Link'] },

  // Virtual Phone
  { id: 'vp-1', title: 'Google Voice', category: 'Verification', price: 15, stock: 50, icon: 'fa-solid fa-phone', description: 'Google Voice US number.', features: ['US Number', 'Voice & SMS'] },
  { id: 'vp-2', title: 'Hushed (1 Year)', category: 'Verification', price: 50, stock: 20, icon: 'fa-solid fa-mobile-screen', description: 'Hushed app number 1 year subscription.', features: ['1 Year', 'Private Number'] },

  // VPN
  { id: 'vpn-1', title: 'Nord VPN (1 Year)', category: 'VPN & Security', price: 30, stock: 40, icon: 'fa-solid fa-shield-halved', description: 'NordVPN Premium 1 Year Account.', features: ['Premium', '1 Year Warranty'] },
  { id: 'vpn-2', title: 'ExpressVPN (1 Month)', category: 'VPN & Security', price: 8, stock: 60, icon: 'fa-solid fa-shield-halved', description: 'ExpressVPN Premium 1 Month Account.', features: ['Premium', 'Mobile/PC'] },

  // Freelance - Other
  { id: 'oth-1', title: 'Deel Account', category: 'Freelance', price: 80, stock: 10, icon: 'fa-solid fa-briefcase', description: 'Verified Deel account.', features: ['Fully Verified'] },
  { id: 'oth-2', title: 'Iployal Account', category: 'Freelance', price: 30, stock: 10, icon: 'fa-solid fa-briefcase', description: 'Verified Iployal account.', features: ['Verified'] },
  { id: 'oth-3', title: 'Ruul Account', category: 'Freelance', price: 80, stock: 10, icon: 'fa-solid fa-briefcase', description: 'Verified Ruul account.', features: ['Verified'] },
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

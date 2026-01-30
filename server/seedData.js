
export const INITIAL_PRODUCTS = [
  // Social Media - LinkedIn
  {
    title: 'LinkedIn (10+ Year, ID Verified)',
    category: 'Social Media',
    price: 300,
    stock: 10,
    icon: 'fa-brands fa-linkedin',
    description: '10+ year old account, ID Verified with 500+ connections.',
    features: ['10+ Years Old', 'ID Verified', '500+ Connections', 'US/EU/Canada']
  },
  {
    title: 'LinkedIn (10+ Year, Non-ID)',
    category: 'Social Media',
    price: 200,
    stock: 15,
    icon: 'fa-brands fa-linkedin',
    description: '10+ year old account, 500+ connections, not ID verified.',
    features: ['10+ Years Old', '500+ Connections', 'US/EU/Canada']
  },
  {
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
    title: 'Custom Document (1 Day)',
    category: 'Verification',
    price: 70,
    stock: 999,
    icon: 'fa-solid fa-file-contract',
    description: 'Custom verification document creation in 24 hours.',
    features: ['High Quality', '1 Day Turnaround', 'Printable']
  },
  {
    title: 'Custom Document (3 Days)',
    category: 'Verification',
    price: 50,
    stock: 999,
    icon: 'fa-solid fa-file-contract',
    description: 'Custom verification document creation in 3 days.',
    features: ['High Quality', '3 Day Turnaround', 'Printable']
  },

  // Payment Accounts - Custom
  { title: 'Custom Payoneer', category: 'Payment', price: 200, stock: 20, icon: 'fa-solid fa-money-check-dollar', description: 'Custom created Payoneer account.', features: ['Fully Verified', 'Custom Details'] },
  { title: 'Custom Company Payoneer', category: 'Payment', price: 300, stock: 10, icon: 'fa-solid fa-briefcase', description: 'Business Payoneer account.', features: ['Business Verified', 'Custom Details'] },
  { title: 'Custom Airtm', category: 'Payment', price: 150, stock: 20, icon: 'fa-solid fa-paper-plane', description: 'Verified Airtm account.', features: ['Fully Verified'] },
  { title: 'Custom Hurupay', category: 'Payment', price: 150, stock: 20, icon: 'fa-solid fa-wallet', description: 'Verified Hurupay account.', features: ['Fully Verified'] },
  { title: 'Custom Fluidkey', category: 'Payment', price: 150, stock: 20, icon: 'fa-solid fa-fingerprint', description: 'Verified Fluidkey account.', features: ['Fully Verified'] },
  
  // Payment Accounts - Standard
  { title: 'PayPal (Personal)', category: 'Payment', price: 100, stock: 50, icon: 'fa-brands fa-paypal', description: 'Verified Personal PayPal account.', features: ['Phone Verified', 'Email Verified'] },
  { title: 'Payoneer (Ready)', category: 'Payment', price: 120, stock: 40, icon: 'fa-solid fa-money-check', description: 'Ready to use Payoneer account.', features: ['Verified'] },
  { title: 'Nexo', category: 'Payment', price: 120, stock: 30, icon: 'fa-solid fa-coins', description: 'Verified Nexo crypto account.', features: ['KYC Verified'] },
  { title: 'Paxful', category: 'Payment', price: 80, stock: 30, icon: 'fa-solid fa-hand-holding-dollar', description: 'Verified Paxful account.', features: ['Level 2 Verified'] },
  
  // Crypto Exchanges / Wallets
  { title: 'Cwallet', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-wallet', description: 'Verified Cwallet.', features: ['Verified'] },
  { title: 'Bybit', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-chart-line', description: 'Verified Bybit account.', features: ['KYC Verified'] },
  { title: 'Kucoin', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-chart-simple', description: 'Verified Kucoin account.', features: ['KYC Verified'] },
  { title: 'Mexc', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-chart-pie', description: 'Verified Mexc account.', features: ['KYC Verified'] },
  { title: 'OKX', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-layer-group', description: 'Verified OKX account.', features: ['KYC Verified'] },
  { title: 'Gate.io', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-arrow-trend-up', description: 'Verified Gate.io account.', features: ['KYC Verified'] },

  // Card Services
  { title: 'Capitalist', category: 'Payment', price: 80, stock: 25, icon: 'fa-solid fa-credit-card', description: 'Verified Capitalist account.', features: ['Card Enabled'] },
  { title: 'Kauri', category: 'Payment', price: 80, stock: 25, icon: 'fa-solid fa-credit-card', description: 'Verified Kauri account.', features: ['Verified'] },
  { title: 'Noones', category: 'Payment', price: 50, stock: 25, icon: 'fa-solid fa-credit-card', description: 'Verified Noones account.', features: ['Verified'] },

  // Discord
  { title: 'Discord 2015', category: 'Social Media', price: 54.99, stock: 5, icon: 'fa-brands fa-discord', description: 'Rare 2015 Creation Date Discord Account.', features: ['Aged 2015', 'Early Supporter Potential'] },
  { title: 'Discord 2016', category: 'Social Media', price: 17.99, stock: 10, icon: 'fa-brands fa-discord', description: 'Aged 2016 Discord Account.', features: ['Aged 2016'] },
  { title: 'Discord 2017', category: 'Social Media', price: 14.99, stock: 15, icon: 'fa-brands fa-discord', description: 'Aged 2017 Discord Account.', features: ['Aged 2017'] },
  { title: 'Discord 2018', category: 'Social Media', price: 10.99, stock: 20, icon: 'fa-brands fa-discord', description: 'Aged 2018 Discord Account.', features: ['Aged 2018'] },
  { title: 'Discord 2019', category: 'Social Media', price: 7.99, stock: 30, icon: 'fa-brands fa-discord', description: 'Aged 2019 Discord Account.', features: ['Aged 2019'] },
  { title: 'Discord 2020', category: 'Social Media', price: 4.99, stock: 50, icon: 'fa-brands fa-discord', description: 'Aged 2020 Discord Account.', features: ['Aged 2020'] },

  // Github
  { title: 'Github (2009-2013)', category: 'Developer Tools', price: 30, stock: 10, icon: 'fa-brands fa-github', description: 'Very old Github account.', features: ['Aged 2009-2013'] },
  { title: 'Github (2014-2019)', category: 'Developer Tools', price: 25, stock: 20, icon: 'fa-brands fa-github', description: 'Aged Github account.', features: ['Aged 2014-2019'] },
  { title: 'Github (2020+)', category: 'Developer Tools', price: 20, stock: 50, icon: 'fa-brands fa-github', description: 'Established Github account.', features: ['Aged 2020+'] },
  { title: 'Github Arctic Badge', category: 'Developer Tools', price: 60, stock: 5, icon: 'fa-brands fa-github', description: 'Github account with Arctic Code Vault badge.', features: ['Arctic Badge'] },
  { title: 'Github Pull Shark', category: 'Developer Tools', price: 40, stock: 8, icon: 'fa-brands fa-github', description: 'Github account with Pull Shark badge.', features: ['Pull Shark Badge'] },
  { title: 'Github 100 Stars/Followers', category: 'Developer Tools', price: 60, stock: 5, icon: 'fa-brands fa-github', description: 'High rep Github account.', features: ['100+ Stars', '100+ Followers'] },

  // Twitter
  { title: 'Old Twitter (Not Verified)', category: 'Social Media', price: 20, stock: 100, icon: 'fa-brands fa-twitter', description: 'Aged Twitter account, email verified.', features: ['Aged', 'Email Verified'] },

  // Facebook
  { title: 'Facebook (4-5 Years Old)', category: 'Social Media', price: 25, stock: 80, icon: 'fa-brands fa-facebook', description: 'Aged Facebook account with history.', features: ['4-5 Years Old', 'Marketplace Access'] },

  // Telegram
  { title: 'Telegram Premium (3 Months)', category: 'Social Media', price: 25, stock: 100, icon: 'fa-brands fa-telegram', description: 'Gift link for 3 months premium.', features: ['Instant Delivery', 'Gift Link'] },
  { title: 'Telegram Premium (6 Months)', category: 'Social Media', price: 35, stock: 100, icon: 'fa-brands fa-telegram', description: 'Gift link for 6 months premium.', features: ['Instant Delivery', 'Gift Link'] },
  { title: 'Telegram Premium (1 Year)', category: 'Social Media', price: 40, stock: 100, icon: 'fa-brands fa-telegram', description: 'Gift link for 1 year premium.', features: ['Instant Delivery', 'Gift Link'] },

  // Virtual Phone
  { title: 'Google Voice', category: 'Verification', price: 15, stock: 50, icon: 'fa-brands fa-google', description: 'Google Voice US number.', features: ['US Number', 'Voice & SMS'] },
  { title: 'Hushed (1 Year)', category: 'Verification', price: 50, stock: 20, icon: 'fa-solid fa-user-secret', description: 'Hushed app number 1 year subscription.', features: ['1 Year', 'Private Number'] },

  // VPN
  { title: 'Nord VPN (1 Year)', category: 'VPN & Security', price: 30, stock: 40, icon: 'fa-solid fa-lock', description: 'NordVPN Premium 1 Year Account.', features: ['Premium', '1 Year Warranty'] },
  { title: 'ExpressVPN (1 Month)', category: 'VPN & Security', price: 8, stock: 60, icon: 'fa-solid fa-shield-halved', description: 'ExpressVPN Premium 1 Month Account.', features: ['Premium', 'Mobile/PC'] },

  // Freelance - Other
  { title: 'Deel Account', category: 'Freelance', price: 80, stock: 10, icon: 'fa-solid fa-handshake', description: 'Verified Deel account.', features: ['Fully Verified'] },
  { title: 'Iployal Account', category: 'Freelance', price: 30, stock: 10, icon: 'fa-solid fa-user-tie', description: 'Verified Iployal account.', features: ['Verified'] },
  { title: 'Ruul Account', category: 'Freelance', price: 80, stock: 10, icon: 'fa-solid fa-file-invoice-dollar', description: 'Verified Ruul account.', features: ['Verified'] }
];

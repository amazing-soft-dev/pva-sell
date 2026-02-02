
export const INITIAL_PRODUCTS = [
  // Social Media - LinkedIn
  {
    title: 'Buy Aged LinkedIn Account (10+ Years, ID Verified)',
    category: 'Social Media',
    price: 300,
    stock: 10,
    icon: 'fa-brands fa-linkedin',
    description: 'Premium aged LinkedIn account (10+ years old) with ID verification green check. Includes 500+ connections. Perfect for sales navigator and networking.',
    features: ['10+ Years Aged', 'ID Verified Badge', '500+ Connections', 'US/EU/Canada IPs']
  },
  {
    title: 'Buy Aged LinkedIn Account (10+ Years, Non-ID)',
    category: 'Social Media',
    price: 200,
    stock: 15,
    icon: 'fa-brands fa-linkedin',
    description: 'Establish instant credibility with a 10+ year old LinkedIn account. Comes with 500+ real connections. Safe for outreach.',
    features: ['10+ Years Aged', '500+ Connections', 'US/EU/Canada IPs', 'Replacement Guarantee']
  },
  {
    title: 'Verified LinkedIn Account (Phone Verified)',
    category: 'Social Media',
    price: 150,
    stock: 50,
    icon: 'fa-brands fa-linkedin',
    description: 'Standard phone verified LinkedIn account (PVA). Created with residential IP. Ready for immediate use.',
    features: ['Phone Verified (PVA)', 'Email Access Included', 'Profile Picture', 'Bio Set']
  },

  // Freelance - Upwork
  {
    title: 'Buy Verified Upwork Account (Ready to Work)',
    category: 'Freelance',
    price: 300,
    stock: 5,
    icon: 'fa-brands fa-upwork',
    description: 'Fully approved and verified Upwork freelancer account. Video verification passed. Ready to apply for jobs immediately.',
    features: ['Identity Verified', 'Video Verified', 'Ready to Apply', 'Clean History']
  },

  // Verification
  {
    title: 'Custom KYC Verification Document (1 Day)',
    category: 'Verification',
    price: 70,
    stock: 999,
    icon: 'fa-solid fa-file-contract',
    description: 'Professional custom verification document creation. High-quality editing for KYC compliance. Delivered in 24 hours.',
    features: ['High Resolution', '1 Day Turnaround', 'Passes KYC', 'Printable Format']
  },
  {
    title: 'Custom KYC Document (3 Days)',
    category: 'Verification',
    price: 50,
    stock: 999,
    icon: 'fa-solid fa-file-contract',
    description: 'Custom document creation service for verification purposes. Standard 3-day delivery.',
    features: ['High Quality', '3 Day Turnaround', 'Correct Metadata', 'Printable']
  },

  // Payment Accounts - Custom
  { title: 'Buy Verified Payoneer Account (Custom)', category: 'Payment', price: 200, stock: 20, icon: 'fa-solid fa-money-check-dollar', description: 'Fully verified Payoneer account created with your custom details. Includes documents.', features: ['Fully Verified', 'Custom Name', 'Documents Included'] },
  { title: 'Buy Business Payoneer Account', category: 'Payment', price: 300, stock: 10, icon: 'fa-solid fa-briefcase', description: 'Verified Business Payoneer account for e-commerce and receiving global payments.', features: ['Business Verified', 'Global Payment Service', 'High Limits'] },
  { title: 'Verified Airtm Account', category: 'Payment', price: 150, stock: 20, icon: 'fa-solid fa-paper-plane', description: 'Fully verified Airtm account for peer-to-peer payments and currency exchange.', features: ['ID Verified', 'Phone Verified'] },
  { title: 'Verified Hurupay Account', category: 'Payment', price: 150, stock: 20, icon: 'fa-solid fa-wallet', description: 'Get a verified Hurupay wallet for secure crypto off-ramping.', features: ['KYC Verified', 'Instant Access'] },
  { title: 'Verified Fluidkey Account', category: 'Payment', price: 150, stock: 20, icon: 'fa-solid fa-fingerprint', description: 'Privacy-focused Fluidkey account, fully verified.', features: ['Fully Verified', 'Secure'] },
  
  // Payment Accounts - Standard
  { title: 'Buy Verified PayPal Account (Personal)', category: 'Payment', price: 100, stock: 50, icon: 'fa-brands fa-paypal', description: 'US/UK/EU Personal PayPal account. Phone and ID verified. Ready to send/receive money.', features: ['Phone Verified (PVA)', 'ID Verified', 'Email Access', 'Cookies Included'] },
  { title: 'Buy Payoneer Account (Ready Made)', category: 'Payment', price: 120, stock: 40, icon: 'fa-solid fa-money-check', description: 'Pre-verified Payoneer account. Ready for immediate handover.', features: ['Card Enabled', 'Global Service', 'ID Verified'] },
  { title: 'Verified Nexo Account', category: 'Payment', price: 120, stock: 30, icon: 'fa-solid fa-coins', description: 'Fully KYC verified Nexo account for crypto lending and borrowing.', features: ['Level 2 Verified', 'Selfie Verified'] },
  { title: 'Verified Paxful Account', category: 'Payment', price: 80, stock: 30, icon: 'fa-solid fa-hand-holding-dollar', description: 'Paxful account with Tier 2 verification. Trade Bitcoin securely.', features: ['Phone Verified', 'ID Verified', 'Tier 2'] },
  
  // Crypto Exchanges / Wallets
  { title: 'Verified Cwallet Account', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-wallet', description: 'Verified Cwallet for crypto storage and tips.', features: ['Email Verified', 'Phone Verified'] },
  { title: 'Buy Verified Bybit Account', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-chart-line', description: 'KYC Verified Bybit account for crypto trading. Level 1 Verified.', features: ['KYC Level 1', 'Trading Enabled'] },
  { title: 'Buy Verified Kucoin Account', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-chart-simple', description: 'Verified Kucoin account ready for trading.', features: ['KYC Verified', 'Withdrawals Enabled'] },
  { title: 'Buy Verified Mexc Account', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-chart-pie', description: 'Mexc Exchange account with KYC completion.', features: ['KYC Verified', 'Spot/Futures Ready'] },
  { title: 'Buy Verified OKX Account', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-layer-group', description: 'OKX account with identity verification complete.', features: ['Level 2 Verified', 'P2P Enabled'] },
  { title: 'Buy Verified Gate.io Account', category: 'Payment', price: 40, stock: 50, icon: 'fa-solid fa-arrow-trend-up', description: 'Gate.io verified account for accessing altcoins.', features: ['KYC Verified', 'Security Set'] },

  // Card Services
  { title: 'Verified Capitalist.net Account', category: 'Payment', price: 80, stock: 25, icon: 'fa-solid fa-credit-card', description: 'Capitalist payment system account. Verified and ready.', features: ['Card Issuance Ready', 'Verified'] },
  { title: 'Verified Kauri Account', category: 'Payment', price: 80, stock: 25, icon: 'fa-solid fa-credit-card', description: 'Kauri finance account, fully verified.', features: ['KYC Passed'] },
  { title: 'Verified Noones Account', category: 'Payment', price: 50, stock: 25, icon: 'fa-solid fa-credit-card', description: 'Noones P2P marketplace account verified.', features: ['Phone + ID', 'Trade Ready'] },

  // Discord
  { title: 'Buy Aged Discord Account (2015)', category: 'Social Media', price: 54.99, stock: 5, icon: 'fa-brands fa-discord', description: 'Ultra rare 2015 creation date Discord account. Does not include badge unless stated.', features: ['Aged 2015', 'High Trust', 'Rare'] },
  { title: 'Buy Aged Discord Account (2016)', category: 'Social Media', price: 17.99, stock: 10, icon: 'fa-brands fa-discord', description: 'Aged 2016 Discord account. Perfect for looking legitimate.', features: ['Aged 2016', 'Email Verified'] },
  { title: 'Aged Discord Account (2017)', category: 'Social Media', price: 14.99, stock: 15, icon: 'fa-brands fa-discord', description: '2017 Creation date Discord account.', features: ['Aged 2017', 'Stable'] },
  { title: 'Aged Discord Account (2018)', category: 'Social Media', price: 10.99, stock: 20, icon: 'fa-brands fa-discord', description: '2018 Creation date Discord account.', features: ['Aged 2018', 'Phone Verified'] },
  { title: 'Aged Discord Account (2019)', category: 'Social Media', price: 7.99, stock: 30, icon: 'fa-brands fa-discord', description: '2019 Creation date Discord account.', features: ['Aged 2019', 'Safe'] },
  { title: 'Aged Discord Account (2020)', category: 'Social Media', price: 4.99, stock: 50, icon: 'fa-brands fa-discord', description: '2020 Creation date Discord account.', features: ['Aged 2020', 'Bulk Available'] },

  // Github
  { title: 'Buy Aged GitHub Account (2009-2013)', category: 'Developer Tools', price: 30, stock: 10, icon: 'fa-brands fa-github', description: 'Premium vintage GitHub account created between 2009 and 2013.', features: ['10+ Years Old', 'Green History Potential'] },
  { title: 'Buy Aged GitHub Account (2014-2019)', category: 'Developer Tools', price: 25, stock: 20, icon: 'fa-brands fa-github', description: 'Established GitHub account created between 2014 and 2019.', features: ['5+ Years Old', 'Repo History'] },
  { title: 'Buy GitHub Account (2020+)', category: 'Developer Tools', price: 20, stock: 50, icon: 'fa-brands fa-github', description: 'Verified GitHub account created 2020 or later.', features: ['Phone Verified', 'Ready to Push'] },
  { title: 'GitHub Account with Arctic Code Vault Badge', category: 'Developer Tools', price: 60, stock: 5, icon: 'fa-brands fa-github', description: 'Rare GitHub account featuring the 2020 Arctic Code Vault Contributor badge.', features: ['Arctic Badge', 'Aged 2020'] },
  { title: 'GitHub Account with Pull Shark Badge', category: 'Developer Tools', price: 40, stock: 8, icon: 'fa-brands fa-github', description: 'GitHub account featuring the Pull Shark achievement badge.', features: ['Pull Shark Badge', 'Active History'] },
  { title: 'High Rep GitHub (100+ Stars)', category: 'Developer Tools', price: 60, stock: 5, icon: 'fa-brands fa-github', description: 'GitHub account with 100+ stars or followers. Instant authority.', features: ['100+ Stars', '100+ Followers', 'Organic Growth'] },

  // Twitter
  { title: 'Buy Aged Twitter Account (Email Verified)', category: 'Social Media', price: 20, stock: 100, icon: 'fa-brands fa-twitter', description: 'Aged Twitter/X account. Comes with original email. Good for marketing.', features: ['Aged Profile', 'Email Verified', 'Token Access'] },

  // Facebook
  { title: 'Buy Aged Facebook Account (Marketplace Enabled)', category: 'Social Media', price: 25, stock: 80, icon: 'fa-brands fa-facebook', description: '4-5 year old Facebook account. Marketplace access enabled. Real profiles.', features: ['4-5 Years Old', 'Marketplace Access', 'Cookies Included'] },

  // Telegram
  { title: 'Telegram Premium Subscription (3 Months)', category: 'Social Media', price: 25, stock: 100, icon: 'fa-brands fa-telegram', description: 'Official Telegram Premium 3-month gift link. Apply to any account.', features: ['No Login Needed', 'Instant Gift Link'] },
  { title: 'Telegram Premium Subscription (6 Months)', category: 'Social Media', price: 35, stock: 100, icon: 'fa-brands fa-telegram', description: 'Official Telegram Premium 6-month gift link.', features: ['No Login Needed', 'Instant Gift Link'] },
  { title: 'Telegram Premium Subscription (1 Year)', category: 'Social Media', price: 40, stock: 100, icon: 'fa-brands fa-telegram', description: 'Official Telegram Premium 1-year gift link. Best value.', features: ['No Login Needed', 'Instant Gift Link'] },

  // Virtual Phone
  { title: 'Buy Google Voice Account (US Number)', category: 'Verification', price: 15, stock: 50, icon: 'fa-brands fa-google', description: 'Aged Google Voice account with US number. Permanent number for SMS verification.', features: ['US +1 Number', 'SMS & Calls', 'Email Included'] },
  { title: 'Hushed Private Number (1 Year)', category: 'Verification', price: 50, stock: 20, icon: 'fa-solid fa-user-secret', description: 'Hushed app account with 1-year paid subscription for private numbers.', features: ['1 Year Prepaid', 'Burner Numbers'] },

  // VPN
  { title: 'NordVPN Premium Account (1 Year)', category: 'VPN & Security', price: 30, stock: 40, icon: 'fa-solid fa-lock', description: 'NordVPN Premium account with 1-year validity warranty.', features: ['Premium Access', '5+ Devices', 'Warranty'] },
  { title: 'ExpressVPN Mobile (1 Month)', category: 'VPN & Security', price: 8, stock: 60, icon: 'fa-solid fa-shield-halved', description: 'ExpressVPN 1 month key/account for mobile devices.', features: ['High Speed', 'Mobile Only'] },

  // Freelance - Other
  { title: 'Buy Verified Deel Account', category: 'Freelance', price: 80, stock: 10, icon: 'fa-solid fa-handshake', description: 'Fully verified Deel contractor account for receiving global payments.', features: ['KYC Verified', 'Contract Ready'] },
  { title: 'Verified Iployal Account', category: 'Freelance', price: 30, stock: 10, icon: 'fa-solid fa-user-tie', description: 'Verified Iployal account for freelancers.', features: ['ID Verified'] },
  { title: 'Verified Ruul.io Account', category: 'Freelance', price: 80, stock: 10, icon: 'fa-solid fa-file-invoice-dollar', description: 'Verified Ruul account for invoicing clients worldwide.', features: ['KYC Verified', 'Invoice Ready'] }
];

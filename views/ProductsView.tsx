import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';

export const ProductsView = () => {
  const { products } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Social Media', 'Payment', 'Freelance', 'Developer Tools', 'Verification', 'VPN & Security'];

  useEffect(() => {
    const handleCategoryChange = () => {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get('category');
      if (categoryParam) {
        // Simple mapping for close matches or direct matches
        const matchedCategory = categories.find(c => c.toLowerCase() === categoryParam.toLowerCase()) 
                             || categories.find(c => c.toLowerCase().includes(categoryParam.toLowerCase()));
        
        if (matchedCategory) {
          setSelectedCategory(matchedCategory);
        }
      }
    };

    // Initial check
    handleCategoryChange();

    // Listen for custom navigation events
    window.addEventListener('categoryChange', handleCategoryChange);
    window.addEventListener('popstate', handleCategoryChange);

    return () => {
      window.removeEventListener('categoryChange', handleCategoryChange);
      window.removeEventListener('popstate', handleCategoryChange);
    };
  }, []);

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = product.title.toLowerCase().includes(query) ||
                          product.description.toLowerCase().includes(query) ||
                          product.category.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const marketplaceSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Credexus Accounts Marketplace",
    "description": "Browse our extensive catalog of verified accounts for social media, payments, and freelancing.",
    "url": "https://amazing-soft-dev.github.io/pva-sell/products",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products.slice(0, 15).map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Product",
          "name": p.title,
          "description": p.description,
          "offers": {
            "@type": "Offer",
            "price": p.price,
            "priceCurrency": "USD"
          }
        }
      }))
    }
  };

  const handleCategoryClick = (category: string) => {
      setSelectedCategory(category);
      // Update URL for shareability
      const url = new URL(window.location.href);
      if (category === 'All') {
          url.searchParams.delete('category');
      } else {
          url.searchParams.set('category', category);
      }
      window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SEO 
        title="Marketplace - Buy Phone Verified Accounts (PVA) | Credexus"
        description="Browse our catalog of verified LinkedIn, Upwork, PayPal, CashApp, and other PVAs. Secure transactions and instant delivery guaranteed."
        keywords="buy social media accounts, buy payment accounts, buy freelance accounts, verified accounts marketplace, buy linkedin pva, buy upwork account"
        canonicalUrl="/products"
        schema={marketplaceSchema}
      />
      
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
          Phone Verified Accounts <span className="text-brand-600">Marketplace</span>
        </h1>
        <p className="text-sm sm:text-lg text-gray-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
          Discover high-trust accounts optimized for stability. Instant delivery and 72-hour protection on every purchase.
        </p>
      </header>

      {/* Responsive Search Bar */}
      <div className="max-w-xl mx-auto mb-6 sm:mb-10 px-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-brand-500 transition-colors" aria-hidden="true"></i>
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 sm:py-4 border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm transition-all text-sm sm:text-base"
            placeholder="Search accounts (e.g., 'LinkedIn ID Verified')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search the marketplace for accounts"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
              aria-label="Clear search terms"
            >
              <i className="fa-solid fa-circle-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {/* Mobile-Friendly Horizontal Scroll Categories */}
      <div className="relative mb-8 sm:mb-12">
        <div 
          className="flex overflow-x-auto pb-4 hide-scrollbar snap-x touch-pan-x gap-2 justify-start sm:justify-center px-2"
          role="tablist" 
          aria-label="Account Categories"
        >
          {categories.map(category => (
            <button
                key={category}
                role="tab"
                aria-selected={selectedCategory === category}
                onClick={() => handleCategoryClick(category)}
                className={`flex-shrink-0 snap-start px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-200 border ${
                  selectedCategory === category
                      ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/25 scale-105'
                      : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 border-gray-100 dark:border-slate-700'
                }`}
            >
                {category}
            </button>
          ))}
        </div>
      </div>
      
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 dark:bg-slate-800 mb-6 shadow-inner">
                <i className="fa-solid fa-search-minus text-gray-300 dark:text-slate-600 text-3xl"></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No matching results</h3>
              <p className="text-gray-500 dark:text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
                We couldn't find any accounts matching "{searchQuery}". Try different keywords or browse all categories.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-6 text-brand-600 dark:text-brand-400 font-bold hover:underline underline-offset-4"
              >
                Clear all filters
              </button>
          </div>
        )}
      </main>
      
      {/* Bottom SEO Content */}
      <section className="mt-20 py-12 border-t border-gray-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-center sm:text-left">Buying Guide</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none text-gray-500 dark:text-slate-400 leading-relaxed font-medium">
                <p>When purchasing verified accounts (PVA), it's crucial to choose a provider that uses residential IPs and physical SIM cards. At Credexus, we ensure every LinkedIn, Upwork, and PayPal account is "aged" to prevent immediate flags. For best results, we recommend using a clean browser profile or high-quality proxy when first logging into your new account.</p>
            </div>
        </div>
      </section>
    </div>
  );
};
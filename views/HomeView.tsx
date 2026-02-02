import React from 'react';
import { ViewState } from '../utils/router';
import { useApp } from '../contexts/AppContext';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { FeaturesSection } from '../components/FeaturesSection';
import { SEO } from '../components/SEO';

export const HomeView = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
  const { products } = useApp();
  // Featured: First 3
  const featuredProducts = products.slice(0, 3);

  return (
    <article className="animate-fade-in">
      <SEO 
        title="Buy Verified PVA Accounts | LinkedIn, Upwork, PayPal"
        description="Credexus Market is the #1 platform to buy aged and verified accounts (PVA) for LinkedIn, Upwork, PayPal, and more. Instant delivery and 100% replacement guarantee."
        keywords="buy pva accounts, verified linkedin account for sale, aged upwork account, verified paypal account, buy discord pva, buy aged telegram accounts, us pva accounts"
      />
      
      {/* Hero Section - Semantic Header */}
      <header>
        <Hero onNavigate={onNavigate} />
      </header>
      
      {/* Featured Products Preview */}
      <section className="bg-white dark:bg-slate-900 py-12 sm:py-20 transition-colors duration-200" aria-labelledby="featured-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-4">
            <div>
              <h2 id="featured-heading" className="text-3xl font-black text-gray-900 dark:text-white tracking-tight sm:text-4xl">
                Featured <span className="text-brand-600">Verified Accounts</span>
              </h2>
              <p className="mt-2 text-gray-500 dark:text-slate-400 font-medium">Top-rated accounts for professionals and businesses.</p>
            </div>
            <button 
              onClick={() => onNavigate('products')}
              className="text-brand-600 dark:text-brand-400 font-bold hover:translate-x-1 transition-transform flex items-center group w-fit"
            >
              Browse Full Marketplace <i className="fa-solid fa-arrow-right-long ml-2 transition-transform group-hover:translate-x-1"></i>
            </button>
          </header>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="bg-white dark:bg-slate-900 py-16 sm:py-24 transition-colors duration-200" aria-labelledby="why-us-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="why-us-heading" className="text-3xl font-black text-gray-900 dark:text-white tracking-tight sm:text-4xl mb-4">
              Why Buy Phone Verified Accounts From Us?
            </h2>
            <div className="w-20 h-1.5 bg-brand-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">
              We focus on quality, longevity, and security. Our accounts are created using residential IPs and real SIM cards.
            </p>
          </div>
          
          <FeaturesSection />
          
          <div className="text-center mt-16">
            <button 
              onClick={() => onNavigate('whyus')} 
              className="px-8 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-2xl font-bold shadow-sm hover:shadow-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              Read Our Security Protocols
            </button>
          </div>
        </div>
      </section>

      {/* Quick FAQ / SEO Content Section */}
      <section className="bg-gray-50 dark:bg-slate-950 py-16 sm:py-24 border-t border-gray-100 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 text-center uppercase tracking-widest">PVA Insights</h2>
              <article className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-gray-600 dark:text-slate-400 font-medium">
                  <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">What is a Phone Verified Account (PVA)?</h3>
                      <p>PVA stands for Phone Verified Account. These accounts are verified using a unique, real SIM card number. This makes them significantly more stable and resistant to security bans compared to email-only accounts on platforms like LinkedIn, Upwork, and PayPal.</p>
                  </div>
                  <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Why buy aged accounts?</h3>
                      <p>Aged accounts have a history of activity. Algorithms trust aged profiles more than new ones. Buying an aged LinkedIn or GitHub account from Credexus allows you to bypass the "sandbox" period and start networking or working immediately with higher trust scores.</p>
                  </div>
              </article>
          </div>
      </section>
    </article>
  );
};
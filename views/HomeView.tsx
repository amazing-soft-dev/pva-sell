import React from 'react';
import { ViewState } from '../utils/router';
import { useApp } from '../contexts/AppContext';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { FeaturesSection } from '../components/FeaturesSection';
import { SEO } from '../components/SEO';

export const HomeView = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
  const { products } = useApp();
  const featuredProducts = products.slice(0, 3);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Credexus Market",
    "url": "https://credexus.com",
    "logo": "https://credexus.com/assets/logo.png",
    "sameAs": [
      "https://twitter.com/credexus",
      "https://facebook.com/credexus"
    ],
    "description": "The #1 marketplace for verified accounts. Secure, fast, and reliable delivery for all your social and business needs."
  };

  return (
    <>
      <SEO 
        title="Credexus Market | Buy Verified PVA Accounts Instantly"
        description="Buy phone verified accounts (PVA) for LinkedIn, Upwork, PayPal, and more. Instant delivery, 24/7 support, and 3-day replacement warranty. Secure & Anonymous."
        keywords="buy pva accounts, verified linkedin accounts, upwork accounts for sale, buy paypal business account, verified social media accounts"
        canonicalUrl="/"
        schema={organizationSchema}
      />
      <Hero onNavigate={onNavigate} />
      
      {/* Featured Products Preview */}
      <div className="bg-white dark:bg-slate-900 py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Featured Accounts</h2>
              <p className="mt-2 text-gray-500 dark:text-slate-400">Our most popular verified accounts.</p>
            </div>
            <button 
              onClick={() => onNavigate('products')}
              className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 dark:hover:text-brand-300 flex items-center"
            >
              View Marketplace <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Why Us Preview */}
      <div className="bg-gray-50 dark:bg-slate-950 py-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Why Choose Credexus Market?</h2>
          </div>
          <FeaturesSection />
          <div className="text-center mt-10">
            <button 
              onClick={() => onNavigate('whyus')} 
              className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >
              Learn More About Us
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
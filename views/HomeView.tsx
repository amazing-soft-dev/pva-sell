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
    "logo": "https://credexus.com/logo.png",
    "sameAs": [
      "https://twitter.com/credexus",
      "https://facebook.com/credexus"
    ],
    "description": "The #1 marketplace to buy verified accounts. Secure, fast, and reliable delivery for all your social and business needs."
  };

  return (
    <>
      <SEO 
        title="Buy Verified PVA Accounts | LinkedIn, Upwork, PayPal | Credexus Market"
        description="The trusted marketplace to buy verified accounts (PVA) for LinkedIn, Upwork, PayPal, and more. Instant secure delivery, 100% replacement guarantee."
        keywords="buy pva accounts, buy verified linkedin account, buy upwork account, buy paypal business account, verified social media accounts for sale, buy aged discord accounts"
        canonicalUrl="/"
        schema={organizationSchema}
      />
      <Hero onNavigate={onNavigate} />
      
      {/* Featured Products Preview */}
      <section className="bg-white dark:bg-slate-900 py-16 transition-colors duration-200" aria-labelledby="featured-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 id="featured-heading" className="text-3xl font-extrabold text-gray-900 dark:text-white">Featured Verified Accounts</h2>
              <p className="mt-2 text-gray-500 dark:text-slate-400">Our most popular verified PVA accounts for sale.</p>
            </div>
            <button 
              onClick={() => onNavigate('products')}
              className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 dark:hover:text-brand-300 flex items-center"
            >
              View Full Marketplace <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Preview */}
      <section className="bg-gray-50 dark:bg-slate-950 py-16 transition-colors duration-200" aria-labelledby="why-us-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="why-us-heading" className="text-3xl font-extrabold text-gray-900 dark:text-white">Why Choose Credexus Market?</h2>
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
      </section>
    </>
  );
};
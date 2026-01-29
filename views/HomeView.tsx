import React from 'react';
import { ViewState } from '../utils/router';
import { useApp } from '../contexts/AppContext';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { FeaturesSection } from '../components/FeaturesSection';

export const HomeView = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
  const { products } = useApp();
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      <Hero onNavigate={onNavigate} />
      
      {/* Featured Products Preview */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Accounts</h2>
              <p className="mt-2 text-gray-500">Our most popular verified accounts.</p>
            </div>
            <button 
              onClick={() => onNavigate('products')}
              className="text-brand-600 font-medium hover:text-brand-700 flex items-center"
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
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Credexus Market?</h2>
          </div>
          <FeaturesSection />
          <div className="text-center mt-10">
            <button 
              onClick={() => onNavigate('whyus')} 
              className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Learn More About Us
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
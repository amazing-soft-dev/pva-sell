import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { ProductCard } from '../components/ProductCard';

export const ProductsView = () => {
  const { products } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Social Media', 'Payment', 'Freelance', 'Developer Tools', 'Verification', 'VPN & Security'];

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = product.title.toLowerCase().includes(query) ||
                          product.description.toLowerCase().includes(query) ||
                          product.category.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Marketplace</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Browse our extensive catalog of verified accounts. Filter by category or search for specific platforms.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-brand-500 transition-colors"></i>
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm transition-all duration-200 ease-in-out"
            placeholder="Search for accounts (e.g., 'Gmail', 'old', 'verified')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
            >
                {category}
            </button>
          ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <i className="fa-solid fa-magnifying-glass text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search terms or category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../services/api';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useApp();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 flex flex-col overflow-hidden group">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-brand-50 dark:bg-slate-700 rounded-lg group-hover:bg-brand-100 dark:group-hover:bg-slate-600 transition-colors">
            <i className={`${product.icon} text-3xl text-brand-600 dark:text-brand-400`}></i>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            In Stock: {product.stock}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{product.title}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2">{product.description}</p>
        <ul className="space-y-2 mb-6">
          {product.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-slate-400">
              <i className="fa-solid fa-check text-green-500 mr-2 shrink-0"></i>
              <span className="truncate">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 dark:border-slate-700 gap-4 sm:gap-0">
        <div className="text-center sm:text-left">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 dark:text-slate-500 ml-1">/ each</span>
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="w-full sm:w-auto bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition active:scale-95 shadow-lg shadow-brand-500/30 whitespace-nowrap"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
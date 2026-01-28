import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../services/api';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useApp();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-brand-50 rounded-lg group-hover:bg-brand-100 transition-colors">
            <i className={`${product.icon} text-3xl text-brand-600`}></i>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            In Stock: {product.stock}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-4">{product.description}</p>
        <ul className="space-y-2 mb-6">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm text-gray-600">
              <i className="fa-solid fa-check text-green-500 mr-2"></i>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
        <div>
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 ml-1">/ each</span>
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition active:scale-95 shadow-lg shadow-brand-500/30"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../services/api';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useApp();
  const [isFlying, setIsFlying] = useState(false);
  const [flyStyle, setFlyStyle] = useState<React.CSSProperties>({});

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Get coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    
    // 2. Set initial state for the flying icon
    setFlyStyle({
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: '40px',
      height: '40px',
      zIndex: 9999,
      opacity: 1,
      transform: 'scale(1)',
      transition: 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)',
      pointerEvents: 'none',
      color: '#0ea5e9', // brand-500
      fontSize: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    });
    
    setIsFlying(true);
    addToCart(product);

    // 3. Trigger animation to cart (approximate position of cart in Navbar)
    // Note: In a real app we might use a Ref from the Cart button, but fixed coords work for this responsiveness
    requestAnimationFrame(() => {
      setFlyStyle(prev => ({
        ...prev,
        top: '20px',
        left: 'calc(100% - 80px)', // Approximate cart position on desktop
        opacity: 0,
        transform: 'scale(0.2)'
      }));
    });

    // 4. Cleanup
    setTimeout(() => {
      setIsFlying(false);
    }, 800);
  };

  return (
    <article 
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 flex flex-col overflow-hidden group"
      itemScope 
      itemType="http://schema.org/Product"
    >
      {/* Hidden SEO Metadata for Google Search */}
      <meta itemProp="name" content={product.title} />
      <meta itemProp="description" content={product.description} />
      <meta itemProp="sku" content={product.id} />
      <meta itemProp="brand" content="Credexus" />
      
      <div className="p-5 sm:p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div 
            className="p-3 bg-brand-50 dark:bg-slate-700 rounded-xl group-hover:bg-brand-100 dark:group-hover:bg-slate-600 transition-colors"
            aria-hidden="true"
          >
            <i className={`${product.icon} text-3xl text-brand-600 dark:text-brand-400`}></i>
          </div>
          <div 
            className="flex flex-col items-end"
            itemProp="offers" itemScope itemType="http://schema.org/Offer"
          >
            <link itemProp="availability" href={product.stock > 0 ? "http://schema.org/InStock" : "http://schema.org/OutOfStock"} />
            <meta itemProp="price" content={product.price.toString()} />
            <meta itemProp="priceCurrency" content="USD" />
            <span 
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                product.stock > 10 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
              }`}
              aria-label={`Availability: ${product.stock > 0 ? product.stock + ' in stock' : 'Out of stock'}`}
            >
              {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 leading-tight" itemProp="name">
          {product.title}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-5 line-clamp-2 leading-relaxed" itemProp="description">
          {product.description}
        </p>

        <ul className="space-y-2.5 mb-2" aria-label={`Features of ${product.title}`}>
          {product.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-center text-xs font-medium text-gray-600 dark:text-slate-400">
              <i className="fa-solid fa-circle-check text-green-500 mr-2 shrink-0" aria-hidden="true"></i>
              <span className="truncate">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 dark:bg-slate-900/50 px-5 sm:px-6 py-4 flex items-center justify-between border-t border-gray-100 dark:border-slate-700 mt-auto">
        <div className="flex flex-col">
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            <span className="sr-only">Price: </span>${product.price.toFixed(2)}
          </span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">One-time payment</span>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="bg-brand-600 text-white px-5 py-2.5 rounded-xl font-black text-sm hover:bg-brand-700 transition transform active:scale-95 shadow-lg shadow-brand-500/25 flex items-center gap-2 relative overflow-hidden"
          aria-label={`Add ${product.title} to your cart for $${product.price.toFixed(2)}`}
        >
          <i className="fa-solid fa-cart-plus relative z-10" aria-hidden="true"></i>
          <span className="relative z-10">Add</span>
        </button>
      </div>

      {/* Flying Icon Portal */}
      {isFlying && (
        <div style={flyStyle}>
           <i className={product.icon}></i>
        </div>
      )}
    </article>
  );
};
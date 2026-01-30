import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

export const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, checkout, user, isLoading } = useApp();
  const [guestEmail, setGuestEmail] = useState('');
  
  if (!isOpen) return null;
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!user && !guestEmail) {
      alert('Please enter your email for guest checkout or login.');
      return;
    }
    
    try {
      await checkout(guestEmail);
      alert(user 
        ? 'Order placed successfully! Check your dashboard.' 
        : `Order placed! Please check ${guestEmail} for your products. Create an account with this email to track order status.`
      );
      setGuestEmail('');
      onClose();
    } catch (e) {
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white dark:bg-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <i className="fa-solid fa-cart-shopping mr-3 text-brand-600 dark:text-brand-400"></i> Your Cart
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"><i className="fa-solid fa-xmark text-xl"></i></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-slate-400 space-y-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-basket-shopping text-3xl text-gray-300 dark:text-slate-500"></i>
                </div>
                <p>Your cart is currently empty.</p>
                <button onClick={onClose} className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Start Shopping</button>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex justify-between items-start pb-4 border-b border-gray-50 dark:border-slate-700 last:border-0">
              <div className="flex-1 pr-4">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-slate-400">
                    <span>{item.quantity}</span>
                    <span className="mx-2">×</span>
                    <span>${item.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-bold text-brand-600 dark:text-brand-400">${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-xs flex items-center">
                    <i className="fa-solid fa-trash mr-1"></i> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-500 dark:text-slate-400 text-sm">Subtotal</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
          </div>

          {!user && cart.length > 0 && (
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                 Guest Checkout Email
               </label>
               <input 
                 type="email" 
                 placeholder="Enter your email to receive order"
                 value={guestEmail}
                 onChange={(e) => setGuestEmail(e.target.value)}
                 className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
               />
               <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                 <i className="fa-solid fa-circle-info mr-1"></i>
                 Create an account later to track status.
               </p>
             </div>
          )}

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isLoading || (!user && !guestEmail)}
            className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-brand-500/20 flex items-center justify-center"
          >
            {isLoading ? <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> : null}
            {user ? 'Checkout Securely' : 'Guest Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};
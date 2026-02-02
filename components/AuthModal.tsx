import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { login, register, showAlert } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Contact Fields
  const [telegram, setTelegram] = useState('');
  const [discord, setDiscord] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!telegram.trim()) {
            showAlert('Telegram username is required for delivery.', 'error');
            setIsLoading(false);
            return;
        }
        await register(name, email, password, { telegram, discord, whatsapp });
      }
      onClose();
    } catch (err: any) {
      const message = err.message || 'Authentication failed';
      showAlert(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
       {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md w-full relative border border-gray-100 dark:border-slate-700 transition-colors duration-200 z-10 transform transition-transform max-h-[90vh] overflow-y-auto hide-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Registration Fields */}
          {!isLogin && (
            <>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input 
                    type="text" placeholder="John Doe" className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white" 
                    value={name} onChange={e => setName(e.target.value)} required 
                    />
                </div>
                
                {/* Contact Section */}
                <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">Contact Details</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">Telegram (Required) <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400"><i className="fa-brands fa-telegram"></i></span>
                                <input 
                                    type="text" placeholder="@username" 
                                    className="w-full pl-9 p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm" 
                                    value={telegram} onChange={e => setTelegram(e.target.value)} required 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">Discord (Optional)</label>
                                <input 
                                    type="text" placeholder="user#1234" 
                                    className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm" 
                                    value={discord} onChange={e => setDiscord(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">WhatsApp (Optional)</label>
                                <input 
                                    type="text" placeholder="+123..." 
                                    className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm" 
                                    value={whatsapp} onChange={e => setWhatsapp(e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
          )}

          {/* Credentials */}
          <div className={`${!isLogin ? 'pt-2 border-t border-gray-100 dark:border-slate-700' : ''}`}>
            {!isLogin && <h3 className="text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3">Login Credentials</h3>}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input 
                        type="email" placeholder="you@example.com" className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white" 
                        value={email} onChange={e => setEmail(e.target.value)} required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Password</label>
                    <input 
                        type="password" placeholder="••••••••" className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white dark:bg-slate-700 text-gray-900 dark:text-white" 
                        value={password} onChange={e => setPassword(e.target.value)} required 
                    />
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/30 flex items-center justify-center mt-6"
          >
            {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium">
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
        </div>
      </div>
    </div>
  );
};
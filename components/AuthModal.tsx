import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full relative border border-gray-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" placeholder="John Doe" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                  value={name} onChange={e => setName(e.target.value)} required 
                />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
                type="email" placeholder="you@example.com" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                value={email} onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
                type="password" placeholder="••••••••" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" 
                value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/30">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-brand-600 hover:text-brand-800 font-medium">
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
        </div>
      </div>
    </div>
  );
};
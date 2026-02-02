import React, { useEffect } from 'react';

interface CustomAlertProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ isOpen, type, message, onClose }) => {
  if (!isOpen) return null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full relative z-10 overflow-hidden transform transition-all scale-100 p-6 text-center border border-gray-100 dark:border-slate-700">
        
        {/* Icon */}
        <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 shadow-sm ${
          type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
          type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
          'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        }`}>
          <i className={`text-3xl fa-solid ${
            type === 'success' ? 'fa-check' :
            type === 'error' ? 'fa-xmark' :
            'fa-info'
          }`}></i>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {type === 'success' ? 'Success!' : type === 'error' ? 'Error' : 'Notice'}
        </h3>
        <p className="text-gray-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">
          {message}
        </p>

        {/* Button */}
        <button 
          onClick={onClose}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
            type === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30 focus:ring-green-500' :
            type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 focus:ring-red-500' :
            'bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/30 focus:ring-brand-500'
          }`}
        >
          OK
        </button>
      </div>
    </div>
  );
};
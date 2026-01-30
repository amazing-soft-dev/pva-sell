import React from 'react';
import { ViewState } from '../utils/router';

export const Hero: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => {
  return (
    <div className="relative bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-slate-900 sm:pb-16 md:pb-20 xl:max-w-2xl xl:w-full xl:pb-28 2xl:pb-32 transition-colors duration-200">
          <svg
            className="hidden xl:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-slate-900 transform translate-x-1/2 transition-colors duration-200"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-8 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 xl:mt-20 xl:px-8 2xl:mt-28">
            <div className="sm:text-center xl:text-left">
              <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Buy Premium Verified</span>{' '}
                <span className="block text-brand-600 dark:text-brand-400 xl:inline">PVA Accounts</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-slate-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl xl:mx-0">
                The #1 marketplace for verified accounts. Instant access to high-quality, phone-verified accounts for LinkedIn, Upwork, PayPal and more. Secure & Anonymous.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center xl:justify-start gap-3">
                <div className="rounded-md shadow">
                  <button
                    onClick={() => onNavigate('products')}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Browse Marketplace
                  </button>
                </div>
                <div className="mt-3 sm:mt-0">
                  <button
                    onClick={() => onNavigate('whyus')}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/40 hover:bg-brand-200 dark:hover:bg-brand-900/60 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Why Choose Us
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="xl:absolute xl:inset-y-0 xl:right-0 xl:w-1/2 bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="w-full h-full flex items-center justify-center p-6 sm:p-10 py-12">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300">
                    <i className="fa-brands fa-linkedin text-5xl text-[#0077b5] mb-4"></i>
                    <span className="font-bold text-gray-800 dark:text-white">LinkedIn</span>
                    <span className="text-xs text-green-500 font-medium">ID Verified</span>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300 sm:translate-y-8">
                    <i className="fa-brands fa-upwork text-5xl text-[#14a800] mb-4"></i>
                    <span className="font-bold text-gray-800 dark:text-white">Upwork</span>
                    <span className="text-xs text-green-500 font-medium">Ready to work</span>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300">
                    <i className="fa-brands fa-discord text-5xl text-[#5865F2] mb-4"></i>
                    <span className="font-bold text-gray-800 dark:text-white">Discord</span>
                    <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">2015 - 2020</span>
                 </div>
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300 sm:translate-y-8">
                    <i className="fa-solid fa-money-check-dollar text-5xl text-gray-700 dark:text-slate-300 mb-4"></i>
                    <span className="font-bold text-gray-800 dark:text-white">Payment</span>
                    <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Verified Accounts</span>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};
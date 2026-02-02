import React from 'react';
import { ViewState } from '../utils/router';

export const Hero: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => {
  return (
    <section className="relative bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-200 border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white dark:bg-slate-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 transition-colors duration-200">
          {/* Decorative SVG - Hidden on mobile, visible on LG+ */}
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-slate-900 transform translate-x-1/2 transition-colors duration-200"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Phone Verified</span>{' '}
                <span className="block text-brand-600 dark:text-brand-400 xl:inline">Accounts Market</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-slate-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                The industry's most trusted marketplace for verified accounts. Instant access to high-quality, phone-verified accounts for LinkedIn, Upwork, PayPal and more. 
                <span className="hidden sm:inline"> Secure, anonymous, and backed by our 72-hour replacement guarantee.</span>
              </p>
              <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                <div className="rounded-md shadow">
                  <button
                    onClick={() => onNavigate('products')}
                    className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 md:text-lg transition-all transform active:scale-95 shadow-lg shadow-brand-500/25"
                  >
                    Browse Marketplace
                  </button>
                </div>
                <div className="mt-3 sm:mt-0">
                  <button
                    onClick={() => onNavigate('whyus')}
                    className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 md:text-lg transition-all"
                  >
                    Why Choose Us?
                  </button>
                </div>
              </div>
              
              {/* Trust Indicators for mobile */}
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <i className="fa-solid fa-shield-check text-brand-500"></i> SSL SECURE
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                      <i className="fa-solid fa-bolt text-brand-500"></i> INSTANT DELIVERY
                  </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Right Side Visual - Responsive adjustments */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 dark:bg-slate-950 transition-colors duration-200 py-12 lg:py-0">
        <div className="w-full h-full flex items-center xl:justify-center lg:justify-end justify-center p-6 sm:p-10">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 xl:w-full lg:w-3/5 w-full max-w-lg">
            {/* LinkedIn Card */}
            <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:translate-y-[-8px] transition duration-300 border border-gray-100 dark:border-slate-700">
              <i className="fa-brands fa-linkedin text-4xl sm:text-5xl text-[#0077b5] mb-4"></i>
              <span className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">LinkedIn</span>
              <span className="text-[10px] sm:text-xs text-green-500 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full mt-1">ID Verified</span>
            </div>
            
            {/* Upwork Card - Removed scale, kept vertical lift */}
            <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform transition-all duration-500 sm:translate-y-8 border border-gray-100 dark:border-slate-700 hover:sm:translate-y-6 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-[#14a800]/20">
              <i className="fa-brands fa-upwork text-4xl sm:text-5xl text-[#14a800] mb-4"></i>
              <span className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">Upwork</span>
              <span className="text-[10px] sm:text-xs text-brand-500 font-bold bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-full mt-1">Ready to apply</span>
            </div>
            
            {/* Discord Card */}
            <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform hover:translate-y-[-8px] transition duration-300 border border-gray-100 dark:border-slate-700">
              <i className="fa-brands fa-discord text-4xl sm:text-5xl text-[#5865F2] mb-4"></i>
              <span className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">Discord</span>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 font-bold bg-gray-50 dark:bg-slate-900/40 px-2 py-0.5 rounded-full mt-1">Aged 2015+</span>
            </div>
            
            {/* Payment Card - Removed scale, kept vertical lift */}
            <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center transform transition-all duration-500 sm:translate-y-8 border border-gray-100 dark:border-slate-700 hover:sm:translate-y-6 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-brand-500/20">
              <i className="fa-solid fa-money-check-dollar text-4xl sm:text-5xl text-slate-700 dark:text-slate-300 mb-4"></i>
              <span className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">Payment</span>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 font-bold bg-gray-50 dark:bg-slate-900/40 px-2 py-0.5 rounded-full mt-1">Business Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
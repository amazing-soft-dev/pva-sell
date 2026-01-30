import React from 'react';
import { FeaturesSection } from '../components/FeaturesSection';
import { SEO } from '../components/SEO';

export const WhyUsView = () => {
  return (
    <div className="bg-white dark:bg-slate-900 animate-fade-in transition-colors duration-200">
      <SEO 
        title="Why Choose Credexus | Trusted Account Provider"
        description="We are the industry leader in verified accounts. With over 50,000 accounts sold and a 99.8% success rate, learn why marketers trust us."
        keywords="credexus reviews, legitimate pva seller, trusted account vendor, verified accounts guarantee"
        canonicalUrl="/whyus"
      />
      {/* Hero Header - Enhanced with gradient and pattern */}
      <div className="relative bg-brand-900 py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-transparent to-black/30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 drop-shadow-lg">
            Why Leading Marketers<br/>Trust <span className="text-brand-400">Credexus Market</span>
          </h1>
          <p className="mt-6 text-xl text-brand-100 max-w-3xl mx-auto font-light leading-relaxed">
            In an industry full of low-quality bots and scams, we stand apart. 
            We provide legitimate, phone-verified accounts that actually last, 
            backed by ironclad guarantees and 24/7 expert support.
          </p>
        </div>
      </div>

      {/* Trust Stats Bar */}
      <div className="bg-white dark:bg-slate-800 border-y border-gray-100 dark:border-slate-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">50,000+</div>
              <div className="text-gray-600 dark:text-slate-400 text-sm uppercase tracking-wider">Accounts Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">99.8%</div>
              <div className="text-gray-600 dark:text-slate-400 text-sm uppercase tracking-wider">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">15 min</div>
              <div className="text-gray-600 dark:text-slate-400 text-sm uppercase tracking-wider">Avg. Support Response</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">3 Days</div>
              <div className="text-gray-600 dark:text-slate-400 text-sm uppercase tracking-wider">Replacement Warranty</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="py-24 bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <div className="inline-flex items-center justify-center p-3 bg-brand-100 dark:bg-slate-800 rounded-xl mb-6">
                <i className="fa-solid fa-shield-halved text-2xl text-brand-600 dark:text-brand-400"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Bank-Grade Security & Privacy</h2>
              <p className="text-lg text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                We understand that privacy is paramount in this business. Our infrastructure is built to protect your identity and data at every step.
              </p>
              <ul className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      <i className="fa-solid fa-lock"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Encrypted Transactions</h4>
                    <p className="mt-1 text-gray-500 dark:text-slate-400">We utilize 256-bit SSL encryption. We never store your credit card details; payments are handled by secure processors like Stripe and Coinbase Commerce.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      <i className="fa-solid fa-user-secret"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Anonymous Delivery</h4>
                    <p className="mt-1 text-gray-500 dark:text-slate-400">Accounts are delivered directly to your private dashboard. No email logs, no public ledgers.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-50 dark:bg-slate-800 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-2xl rounded-3xl p-8">
                 <div className="flex flex-col items-center justify-center py-12 text-center">
                    <i className="fa-solid fa-fingerprint text-8xl text-brand-100 dark:text-slate-700 mb-6"></i>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Zero-Trace Policy</h3>
                    <p className="text-gray-500 dark:text-slate-400 max-w-xs">We minimize data retention. Once your order is completed and warranty expires, unnecessary data is purged.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reliability Section */}
      <div className="py-24 bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Our Accounts Last Longer</h2>
            <p className="text-lg text-gray-600 dark:text-slate-400">
              Most vendors sell bot-created accounts that get banned in 24 hours. We do things differently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition duration-300 border border-gray-100 dark:border-slate-700">
               <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl mb-6">
                 <i className="fa-solid fa-sim-card"></i>
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Real SIM Verification</h3>
               <p className="text-gray-500 dark:text-slate-400 leading-relaxed">
                 We use physical SIM cards for verification, not cheap VoIP numbers that are flagged by major platforms.
               </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition duration-300 border border-gray-100 dark:border-slate-700">
               <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl mb-6">
                 <i className="fa-solid fa-network-wired"></i>
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Residential IPs</h3>
               <p className="text-gray-500 dark:text-slate-400 leading-relaxed">
                 Every account is created and managed using high-quality residential proxies, mimicking real user behavior to avoid detection.
               </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition duration-300 border border-gray-100 dark:border-slate-700">
               <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 text-2xl mb-6">
                 <i className="fa-solid fa-hourglass-half"></i>
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Proper Aging</h3>
               <p className="text-gray-500 dark:text-slate-400 leading-relaxed">
                 We let accounts "season" (age) before listing them. Aged accounts have significantly higher trust scores and lower ban rates.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Support Section */}
      <div className="py-24 bg-white dark:bg-slate-900 transition-colors duration-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center bg-brand-600 dark:bg-brand-800 rounded-3xl overflow-hidden shadow-2xl">
               <div className="lg:col-span-7 p-10 sm:p-16">
                  <h2 className="text-3xl font-bold text-white mb-6">We're Here When You Need Us</h2>
                  <p className="text-brand-100 text-lg mb-8 leading-relaxed">
                    Have a specific requirement? Need help with a bulk order? Or facing an issue with a purchase? Our dedicated support team is available 24/7.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="flex items-center text-white">
                        <i className="fa-solid fa-check-circle text-brand-300 mr-3 text-xl"></i>
                        <span>Live Chat Support</span>
                     </div>
                     <div className="flex items-center text-white">
                        <i className="fa-solid fa-check-circle text-brand-300 mr-3 text-xl"></i>
                        <span>Email Ticket System</span>
                     </div>
                     <div className="flex items-center text-white">
                        <i className="fa-solid fa-check-circle text-brand-300 mr-3 text-xl"></i>
                        <span>Active Telegram Channel</span>
                     </div>
                     <div className="flex items-center text-white">
                        <i className="fa-solid fa-check-circle text-brand-300 mr-3 text-xl"></i>
                        <span>Detailed FAQ & Guides</span>
                     </div>
                  </div>
               </div>
               <div className="lg:col-span-5 bg-brand-700 dark:bg-brand-900 p-10 sm:p-16 h-full flex flex-col justify-center items-center text-center">
                   <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-brand-600 text-4xl mb-6 shadow-lg">
                      <i className="fa-solid fa-headset"></i>
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">Need Help?</h3>
                   <p className="text-brand-200 mb-6">Contact us anytime.</p>
                   <button className="bg-white text-brand-700 px-8 py-3 rounded-full font-bold hover:bg-brand-50 transition shadow-lg">
                     Open Support Ticket
                   </button>
               </div>
            </div>
         </div>
      </div>
      
      {/* FAQ Summary */}
      <div className="bg-gray-50 dark:bg-slate-950 py-20 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Common Questions</h2>
           <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-2">Are these accounts hacked?</h3>
                 <p className="text-gray-600 dark:text-slate-400">Absolutely not. All accounts are created by our team or our trusted partners using legitimate methods.</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-2">How fast is delivery?</h3>
                 <p className="text-gray-600 dark:text-slate-400">Delivery is instant for 95% of our inventory. Custom orders take 1-3 days.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
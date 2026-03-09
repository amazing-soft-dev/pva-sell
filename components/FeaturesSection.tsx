import React from 'react';

export const FeaturesSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
    <div className="p-6">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shrink-0">
        <i className="fa-solid fa-bolt"></i>
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Instant Delivery</h3>
      <p className="text-gray-500 dark:text-slate-400">Get your accounts delivered to your dashboard and email immediately after payment.</p>
    </div>
    <div className="p-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shrink-0">
        <i className="fa-solid fa-rotate"></i>
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">3-Day Replacement</h3>
      <p className="text-gray-500 dark:text-slate-400">If any account doesn't work, we replace it instantly within 3 days of purchase.</p>
    </div>
    <div className="p-6">
      <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shrink-0">
        <i className="fa-solid fa-headset"></i>
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">24/7 Support</h3>
      <p className="text-gray-500 dark:text-slate-400">Our team is available round the clock to assist you with any issues.</p>
    </div>
  </div>
);
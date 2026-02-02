import React, { useState, useEffect, useRef } from 'react';
import { api, Order, apiConfig } from '../services/api';
import { useApp } from '../contexts/AppContext';

export const AdminView = () => {
  const { showAlert } = useApp();
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState(apiConfig.getUrl());
  
  // Ref to track if component is mounted to prevent state updates on unmount
  const isMounted = useRef(true);

  // Check for existing session
  useEffect(() => {
    isMounted.current = true;
    const adminSession = sessionStorage.getItem('adminToken');
    if (adminSession) {
      setIsAdmin(true);
    }
    return () => { isMounted.current = false; };
  }, []);

  // Polling Effect
  useEffect(() => {
    let intervalId: any;

    if (isAdmin) {
      // Initial load
      fetchOrders(false);

      // Start polling every 5 seconds
      intervalId = setInterval(() => {
        fetchOrders(true);
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.adminLogin(password);
      if (res.success) {
        sessionStorage.setItem('adminToken', res.token);
        setIsAdmin(true);
        // Fetch will be triggered by the useEffect
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('CONNECTION_ERROR')) {
        setError("Frontend cannot connect to Backend. Click 'Server Config' to fix.");
        setShowConfig(true);
      } else {
        setError(err.message || "Invalid password");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const saveConfig = (e: React.FormEvent) => {
      e.preventDefault();
      if (!customUrl) return;
      apiConfig.setUrl(customUrl);
  };

  const fetchOrders = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const data = await api.getAllOrders();
      if (isMounted.current) {
        // Only update state if the data is different? 
        // For now, React's diffing is fast enough to just set it.
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!isBackground && isMounted.current) setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
      
      const updatedOrder = await api.updateOrderStatus(id, newStatus);
      
      // Reconcile with server response
      setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
      showAlert(`Order updated to ${newStatus}`, 'success');
    } catch (err) {
      // Revert on failure (needs a more complex fetchOrders call to revert perfectly, but this prompts a refresh)
      showAlert('Failed to update status', 'error');
      fetchOrders(true); 
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Stats Calculation
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors duration-200 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner rotate-3">
              <i className="fa-solid fa-user-shield text-brand-600 dark:text-brand-400 text-3xl"></i>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Admin Portal</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">Verify credentials to continue</p>
          </div>

          {!showConfig ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-4 border border-gray-200 dark:border-slate-600 rounded-2xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all font-mono"
                    required
                  />
                </div>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm text-center border border-red-100 dark:border-red-800 animate-shake">
                    <i className="fa-solid fa-circle-exclamation mr-2"></i>
                    {error}
                  </div>
                )}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 dark:bg-brand-600 text-white py-4 rounded-2xl font-black hover:opacity-90 transition shadow-xl flex items-center justify-center active:scale-95"
                >
                  {loading ? (
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                  ) : (
                    <span>Unlock Dashboard</span>
                  )}
                </button>
                
                <div className="text-center">
                   <button 
                    type="button" 
                    onClick={() => setShowConfig(true)}
                    className="text-xs text-gray-400 hover:text-brand-500 font-bold uppercase tracking-widest"
                   >
                     Connection Settings
                   </button>
                </div>
              </form>
          ) : (
              <form onSubmit={saveConfig} className="space-y-4">
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                    <p className="font-bold mb-2 flex items-center gap-2"><i className="fa-solid fa-circle-info"></i> API RELAY</p>
                    <p className="leading-relaxed opacity-80">Manual override for backend connectivity. Use this if the automatic proxy fails.</p>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Server Endpoint</label>
                    <input
                        type="url"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="https://pva-sell.onrender.com"
                        className="w-full p-4 border border-gray-200 dark:border-slate-600 rounded-2xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                        required
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                     <button 
                        type="button" 
                        onClick={() => setShowConfig(false)}
                        className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-3 rounded-2xl font-bold hover:bg-gray-300 transition"
                     >
                        Cancel
                     </button>
                     <button 
                        type="submit" 
                        className="bg-brand-600 text-white py-3 rounded-2xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/20"
                     >
                        Apply & Reset
                     </button>
                 </div>
              </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200 pb-20">
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-slate-900 dark:bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <i className="fa-solid fa-gear text-sm"></i>
             </div>
             <h1 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Admin Command Center</h1>
          </div>
          <div className="flex items-center gap-4">
             {/* Live Indicator */}
             <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">Live Updates</span>
             </div>

             <div className="h-6 w-px bg-gray-200 dark:bg-slate-800"></div>

             <button 
               onClick={() => fetchOrders(false)} 
               className="p-2 text-gray-400 hover:text-brand-600 transition"
               title="Force Sync Data"
             >
               <i className={`fa-solid fa-arrows-rotate ${loading ? 'fa-spin' : ''}`}></i>
             </button>
             <button 
               onClick={() => { setIsAdmin(false); sessionStorage.removeItem('adminToken'); }}
               className="px-3 py-1.5 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-lg font-bold text-xs hover:bg-red-100 dark:hover:bg-red-900/20 transition"
             >
               LOGOUT
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Cards - Fluid grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Revenue', val: `$${totalRevenue.toFixed(0)}`, icon: 'fa-dollar-sign', color: 'green' },
            { label: 'Total Sales', val: orders.length, icon: 'fa-shopping-cart', color: 'blue' },
            { label: 'Pending', val: pendingCount, icon: 'fa-clock', color: 'yellow' },
            { label: 'Working', val: processingCount, icon: 'fa-rotate', color: 'purple' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{stat.val}</h3>
                </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4">ID / Customer</th>
                  <th className="px-6 py-4">Ordered Date</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/20 transition duration-150">
                    <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 dark:text-white">{order.guestEmail || 'Member'}</p>
                        <p className="font-mono text-[10px] text-gray-400 mt-1">{order.id.slice(0, 8)}...</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                        {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex justify-center gap-1.5">
                          {['processing', 'shipped', 'completed'].map((st) => (
                             order.status !== st && (
                                <button 
                                    key={st}
                                    onClick={() => updateStatus(order.id, st)}
                                    className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-500 hover:text-brand-600 transition text-[10px] font-black uppercase"
                                >
                                    {st}
                                </button>
                             )
                          ))}
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile List View - Cards for small screens */}
        <div className="sm:hidden space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</p>
                        <p className="font-mono text-xs text-gray-900 dark:text-white">{order.id.slice(0, 12)}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>
                <div className="mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</p>
                    <p className="font-bold text-gray-900 dark:text-white">{order.guestEmail || 'Registered User'}</p>
                </div>
                <div className="flex justify-between items-end border-t border-gray-50 dark:border-slate-700 pt-3">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</p>
                        <p className="text-lg font-black text-brand-600 dark:text-brand-400">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                        <select 
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            value={order.status}
                            className="bg-gray-100 dark:bg-slate-700 border-none rounded-lg text-xs font-bold p-2 outline-none"
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && !loading && (
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-inbox text-2xl text-gray-300"></i>
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No records found</p>
            </div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { api, Order } from '../services/api';

export const AdminView = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for existing session
  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminToken');
    if (adminSession) {
      setIsAdmin(true);
      fetchOrders();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.adminLogin(password);
      if (res.success) {
        sessionStorage.setItem('adminToken', res.token);
        setIsAdmin(true);
        fetchOrders();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const updatedOrder = await api.updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
    } catch (err) {
      alert('Failed to update status');
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
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <i className="fa-solid fa-user-shield text-brand-600 dark:text-brand-400 text-3xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Access</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Secure dashboard login</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Admin Password"
                className="w-full p-4 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center border border-red-100 dark:border-red-800">
                <i className="fa-solid fa-circle-exclamation mr-2"></i>
                {error}
              </div>
            )}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/30 flex items-center justify-center"
            >
              {loading ? (
                <span><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Verifying...</span>
              ) : (
                <span><i className="fa-solid fa-lock-open mr-2"></i> Access Dashboard</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200 pb-12">
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <i className="fa-solid fa-chart-line"></i>
             </div>
             <h1 className="text-xl font-bold text-gray-900 dark:text-white">Credexus Admin</h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={fetchOrders} 
               className="text-gray-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition"
               title="Refresh Data"
             >
               <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
             </button>
             <div className="h-6 w-px bg-gray-200 dark:bg-slate-700"></div>
             <button 
               onClick={() => { setIsAdmin(false); sessionStorage.removeItem('adminToken'); }}
               className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-2"
             >
               <i className="fa-solid fa-right-from-bracket"></i> Logout
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xl mr-4">
              <i className="fa-solid fa-dollar-sign"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toFixed(2)}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xl mr-4">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center text-xl mr-4">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Pending</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
             <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-xl mr-4">
               <i className="fa-solid fa-spinner"></i>
             </div>
             <div>
               <p className="text-sm text-gray-500 dark:text-slate-400">Processing</p>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{processingCount}</h3>
             </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
             <h3 className="font-bold text-gray-900 dark:text-white">Recent Orders</h3>
             <span className="text-xs text-gray-500 dark:text-slate-400">Showing all records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-slate-400">
              <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-white font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {loading && orders.length === 0 ? (
                   <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading orders...</td></tr>
                ) : orders.length === 0 ? (
                   <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found.</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition duration-150">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{order.id}</td>
                      <td className="px-6 py-4">
                        <div>{new Date(order.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{new Date(order.date).toLocaleTimeString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={order.guestEmail || order.userId}>
                          {order.guestEmail || 'Registered User'}
                        </div>
                        {order.userId && <div className="text-xs text-brand-600">Verified Member</div>}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {order.status !== 'processing' && (
                            <button 
                              onClick={() => updateStatus(order.id, 'processing')}
                              className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 transition flex items-center justify-center" 
                              title="Mark Processing"
                            >
                              <i className="fa-solid fa-spinner"></i>
                            </button>
                          )}
                          {order.status !== 'completed' && (
                            <button 
                              onClick={() => updateStatus(order.id, 'completed')}
                              className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 transition flex items-center justify-center"
                              title="Mark Completed"
                            >
                              <i className="fa-solid fa-check"></i>
                            </button>
                          )}
                          {order.status !== 'shipped' && (
                            <button 
                              onClick={() => updateStatus(order.id, 'shipped')}
                              className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 transition flex items-center justify-center"
                              title="Mark Shipped"
                            >
                              <i className="fa-solid fa-truck-fast"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
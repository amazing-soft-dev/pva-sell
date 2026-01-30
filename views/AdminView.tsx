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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-lock text-red-500 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access</h2>
            <p className="text-gray-500 dark:text-slate-400">Enter password to manage orders</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
            >
              {loading ? 'Verifying...' : 'Unlock Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
           <p className="text-gray-500 dark:text-slate-400">Manage orders and view notifications.</p>
        </div>
        <button 
          onClick={() => { setIsAdmin(false); sessionStorage.removeItem('adminToken'); }}
          className="text-red-500 hover:text-red-700 font-medium"
        >
          Logout
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-slate-400">
            <thead className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-bold uppercase text-xs">
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
              {loading ? (
                 <tr><td colSpan={6} className="px-6 py-8 text-center">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                 <tr><td colSpan={6} className="px-6 py-8 text-center">No orders found.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                    <td className="px-6 py-4 font-mono">{order.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={order.guestEmail || order.userId}>
                      {order.guestEmail || 'Registered User'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button 
                        onClick={() => updateStatus(order.id, 'processing')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded" 
                        title="Mark Processing"
                      >
                        <i className="fa-solid fa-spinner"></i>
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'completed')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Mark Completed"
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'shipped')}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                        title="Mark Shipped"
                      >
                        <i className="fa-solid fa-truck"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
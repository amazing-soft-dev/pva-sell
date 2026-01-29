import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useApp } from '../contexts/AppContext';
import { api, Order } from '../services/api';

export const ProfileView = () => {
  const { user, products } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const data = await api.getOrders(user.id);
          setOrders(data);
        } catch (e) {
          console.error("Failed to fetch orders", e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [user]);

  const handleDownloadInvoice = (order: Order) => {
    if (!user) return;
    
    const doc = new jsPDF();
    
    // Header Branding
    doc.setTextColor(14, 165, 233); // Brand color #0ea5e9
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Credexus Market', 14, 20);
    
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Verified Accounts', 14, 26);
    doc.text('https://credexus.com', 14, 31);
    
    // Invoice Info Box
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 140, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${order.id}`, 140, 28);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 140, 33);
    doc.text(`Status: ${order.status.toUpperCase()}`, 140, 38);

    // Bill To
    doc.text('Bill To:', 14, 50);
    doc.setFont('helvetica', 'bold');
    doc.text(user.name, 14, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(user.email, 14, 60);

    // Table
    const tableColumn = ["Item Description", "Qty", "Unit Price", "Amount"];
    const tableRows = order.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return [
        product?.title || "Unknown Product",
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${(item.price * item.quantity).toFixed(2)}`
      ];
    });

    autoTable(doc, {
      startY: 70,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { 
        fillColor: [14, 165, 233], 
        textColor: 255, 
        fontStyle: 'bold',
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 30, halign: 'right' }
      },
      foot: [['', '', 'Total Amount:', `$${order.total.toFixed(2)}`]],
      footStyles: { 
        fillColor: [245, 245, 245], 
        textColor: 0, 
        fontStyle: 'bold',
        halign: 'right'
      }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setDrawColor(220);
    doc.line(14, finalY, 196, finalY);
    
    doc.setFontSize(9);
    doc.setTextColor(128);
    doc.text('Thank you for your business!', 14, finalY + 10);
    doc.text('If you have any questions about this invoice, please contact support@credexus.com', 14, finalY + 15);
    doc.text('This is a computer-generated document. No signature is required.', 14, finalY + 20);

    doc.save(`invoice-${order.id}.pdf`);
  };

  if (!user) return <div className="p-12 text-center text-gray-500">Please log in to view your dashboard.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-20 w-20 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-3xl font-bold border-4 border-white shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-500 text-sm break-all">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Account Status</div>
                <div className="flex items-center text-green-600 font-medium">
                  <i className="fa-solid fa-check-circle mr-2"></i> Verified Member
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500">Member ID</span>
                  <span className="font-mono text-gray-900">{user.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500">Total Orders</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center">
                <i className="fa-solid fa-clock-rotate-left mr-2 text-brand-500"></i>
                Order History
              </h3>
            </div>
            
            {loading ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-4 text-brand-400"></i>
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-box-open text-4xl text-gray-400"></i>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">When you purchase accounts, they will appear here with all details.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-brand-600 hover:text-brand-700 font-medium"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map(order => (
                  <div key={order.id} className="p-6 hover:bg-gray-50/50 transition duration-150">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-bold text-gray-900">Order #{order.id}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {order.status === 'completed' && <i className="fa-solid fa-check mr-1"></i>}
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(order.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(order.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-brand-600">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="space-y-3">
                        {order.items.map((item, idx) => {
                          const product = products.find(p => p.id === item.productId);
                          return (
                            <div key={idx} className="flex justify-between items-center text-sm group">
                               <div className="flex items-center">
                                 <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center mr-3 text-brand-500">
                                   <i className={product?.icon || 'fa-solid fa-box'}></i>
                                 </div>
                                 <span className="text-gray-700 font-medium">{product?.title || 'Unknown Product'}</span>
                                 <span className="text-gray-400 mx-2">×</span>
                                 <span className="text-gray-600">{item.quantity}</span>
                               </div>
                               <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                       <button 
                         onClick={() => handleDownloadInvoice(order)}
                         className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center"
                       >
                         <i className="fa-regular fa-file-pdf mr-2"></i> Download Invoice
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
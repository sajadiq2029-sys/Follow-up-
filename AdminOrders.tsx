
import React from 'react';
import { Order, OrderStatus } from '../types';
import { Check, X, Clock, ExternalLink } from 'lucide-react';

const AdminOrders: React.FC<{ orders: Order[]; setOrders: React.Dispatch<React.SetStateAction<Order[]>> }> = ({ orders, setOrders }) => {
  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <h2 className="text-3xl font-bold">إدارة الطلبات</h2>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
                <th className="px-6 py-5 font-bold">الخدمة</th>
                <th className="px-6 py-5 font-bold">المستهدف</th>
                <th className="px-6 py-5 font-bold">الكمية</th>
                <th className="px-6 py-5 font-bold">الحالة</th>
                <th className="px-6 py-5 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">لا توجد طلبات معلقة حالياً.</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-5 font-bold">{order.serviceName}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                        {order.targetUsername}
                        <ExternalLink size={12} />
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black">{order.amount}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        order.status === OrderStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600' :
                        order.status === OrderStatus.PROCESSING ? 'bg-blue-100 text-blue-600' :
                        order.status === OrderStatus.REJECTED ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {order.status === OrderStatus.COMPLETED ? 'مكتمل' : 
                         order.status === OrderStatus.PROCESSING ? 'قيد التنفيذ' : 
                         order.status === OrderStatus.REJECTED ? 'مرفوض' : 'معلق'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {order.status !== OrderStatus.COMPLETED && (
                          <button 
                            onClick={() => updateStatus(order.id, OrderStatus.COMPLETED)}
                            className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"
                            title="إكمال"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        {order.status === OrderStatus.PROCESSING && (
                          <button 
                            onClick={() => updateStatus(order.id, OrderStatus.REJECTED)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            title="رفض"
                          >
                            <X size={18} />
                          </button>
                        )}
                        <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                          <Clock size={18} />
                        </button>
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
  );
};

export default AdminOrders;

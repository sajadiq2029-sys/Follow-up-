
import React from 'react';
import { Order, OrderStatus } from '../types';
import { History, Package, Search } from 'lucide-react';

const OrderHistory: React.FC<{ orders: Order[] }> = ({ orders }) => {
  return (
    <div className="max-w-4xl mx-auto pb-24 lg:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold">سجل الطلبات</h2>
          <p className="text-slate-500">تتبع حالة طلباتك وعملياتك السابقة.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="البحث في الطلبات..." 
            className="w-full md:w-64 bg-white dark:bg-slate-900 border-none rounded-2xl pr-12 pl-4 py-3 focus:ring-2 focus:ring-emerald-600 outline-none shadow-sm"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[50px] border border-slate-100 dark:border-slate-800">
          <Package size={64} className="mx-auto text-slate-200 dark:text-slate-800 mb-6" />
          <p className="text-slate-500 text-lg">لم تقم بأي طلبات بعد.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl">
                  {order.serviceName.includes('متابعين إنستغرام') ? '📸' : 
                   order.serviceName.includes('لايكات إنستغرام') ? '❤️' : 
                   order.serviceName.includes('ريلز') ? '🎬' : 
                   order.serviceName.includes('تيك توك') ? '🎵' : 
                   order.serviceName.includes('فيسبوك') ? '👥' : '📺'}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{order.serviceName}</h4>
                  <p className="text-sm text-slate-500">المستهدف: <span className="text-emerald-600 font-semibold">{order.targetUsername}</span></p>
                  <p className="text-[10px] text-slate-400 mt-1">{new Date(order.createdAt).toLocaleString('ar-IQ')}</p>
                </div>
              </div>
              
              <div className="w-full md:w-auto flex items-center justify-between md:flex-col md:items-end gap-2">
                <div className="text-right">
                  <p className="font-black text-xl">{order.amount}</p>
                  <p className="text-[10px] text-slate-500">الكمية</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  order.status === OrderStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600' :
                  order.status === OrderStatus.PROCESSING ? 'bg-blue-100 text-blue-600' :
                  order.status === OrderStatus.PENDING ? 'bg-amber-100 text-amber-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {order.status === OrderStatus.COMPLETED ? 'مكتمل' : 
                   order.status === OrderStatus.PROCESSING ? 'قيد التنفيذ' : 
                   order.status === OrderStatus.PENDING ? 'بانتظار المراجعة' : 'مرفوض'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;


import React from 'react';
import { User, Order, OrderStatus } from '../types';
import { 
  Users, 
  BarChart3, 
  PieChart, 
  Activity, 
  ArrowUpRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminHome: React.FC<{ users: User[]; orders: Order[] }> = ({ users, orders }) => {
  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
  const totalPoints = users.reduce((acc, curr) => acc + curr.points, 0);
  const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED).length;

  const data = [
    { name: 'السبت', total: 400 },
    { name: 'الأحد', total: 700 },
    { name: 'الأثنين', total: 900 },
    { name: 'الثلاثاء', total: 1200 },
    { name: 'الأربعاء', total: 1100 },
    { name: 'الخميس', total: 1500 },
    { name: 'الجمعة', total: 1800 },
  ];

  const stats = [
    { label: 'إجمالي المستخدمين', value: users.length, icon: Users, color: 'text-blue-500' },
    { label: 'المستخدمين النشطين', value: activeUsers, icon: Activity, color: 'text-emerald-500' },
    { label: 'إجمالي الطلبات', value: orders.length, icon: Package, color: 'text-indigo-500' },
    { label: 'مجموع النقاط المتداولة', value: totalPoints, icon: BarChart3, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8 pb-24 lg:pb-0">
      <div className="flex items-center gap-3">
        <ShieldCheck size={32} className="text-emerald-600" />
        <div>
          <h2 className="text-3xl font-bold">لوحة تحكم المطور</h2>
          <p className="text-slate-500">إحصائيات المنصة الشاملة وإدارة النظام.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={24} className={stat.color} />
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center">
                +12% <ArrowUpRight size={10} />
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-8">نمو الطلبات الأسبوعي</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="total" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-6">توزيع الخدمات</h3>
          <div className="space-y-6">
            {[
              { label: 'إنستغرام (متابعين)', value: 45, color: 'bg-pink-500' },
              { label: 'إنستغرام (لايكات)', value: 25, color: 'bg-red-500' },
              { label: 'إنستغرام (ريلز)', value: 20, color: 'bg-indigo-500' },
              { label: 'يوتيوب', value: 10, color: 'bg-red-600' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold">{item.label}</span>
                  <span className="text-sm text-slate-500">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full`} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

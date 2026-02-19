
import React from 'react';
import { User, Order, OrderStatus, Role } from '../types';
import { TrendingUp, Clock, CheckCircle, Zap, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translations, Language } from '../translations';

const UserDashboard: React.FC<{ user: User; orders: Order[]; language: Language }> = ({ user, orders, language }) => {
  const t = translations[language];

  const stats = [
    { label: t.total_orders, value: orders.length, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: t.processing, value: orders.filter(o => o.status === OrderStatus.PROCESSING).length, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: t.completed, value: orders.filter(o => o.status === OrderStatus.COMPLETED).length, icon: CheckCircle, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: t.points_balance, value: user.role === Role.ADMIN ? '∞' : user.points, icon: Zap, color: 'text-indigo-700', bg: 'bg-indigo-100' },
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-xl border border-indigo-50 dark:border-indigo-950 relative overflow-hidden group">
            <div className={`${stat.bg} dark:bg-indigo-900/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div className="glass-text mb-1">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className="text-2xl font-black">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl border border-indigo-50 dark:border-indigo-950">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black">{t.last_ops}</h3>
            <Link to="/history" className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
              {t.full_history} <ArrowRight size={16} className={language === 'en' ? '' : 'rotate-180'} />
            </Link>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-indigo-50 dark:bg-indigo-900/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={40} className="text-indigo-300" />
              </div>
              <p className="text-slate-500 font-bold">{language === 'ar' ? 'ابدأ رحلتك اليوم واطلب خدمتك الأولى!' : (language === 'fa' ? 'امروز سفر خود را شروع کنید!' : 'Start your journey today and place your first order!')}</p>
              <Link to="/order" className="mt-6 inline-block bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black shadow-lg shadow-indigo-600/20">{t.order}</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-indigo-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-indigo-50">📸</div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{order.serviceName}</p>
                      <div className="glass-text mt-1"><p className="text-[10px] text-indigo-500 font-bold">@{order.targetUsername}</p></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase ${
                      order.status === OrderStatus.COMPLETED ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {order.status === OrderStatus.COMPLETED ? t.completed : t.processing}
                    </span>
                    <p className="text-sm font-black mt-1 text-indigo-600">-{order.totalCost} {t.points}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-3">{language === 'ar' ? 'اربح أكثر! 💸' : (language === 'fa' ? 'بیشتر برنده شو! 💸' : 'Win More! 💸')}</h3>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 mb-6">
                <p className="text-sm leading-relaxed">{language === 'ar' ? 'شارك كود الإحالة واحصل على مكافآت فورية عند كل تسجيل جديد.' : (language === 'fa' ? 'کد معرف خود را به اشتراک بگذارید و جوایز فوری بگیرید.' : 'Share your referral code and get instant rewards for every new registration.')}</p>
              </div>
              <Link to="/referral" className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm inline-block shadow-xl hover:scale-105 transition-transform">{language === 'ar' ? 'اكتشف المكافآت' : (language === 'fa' ? 'کشف پاداش‌ها' : 'Discover Rewards')}</Link>
            </div>
            <Gift className="absolute -bottom-6 -left-6 w-32 h-32 opacity-20 rotate-12 transition-transform group-hover:scale-110" />
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl border border-indigo-50 dark:border-indigo-950">
             <h3 className="font-black text-lg mb-6 flex items-center gap-3 text-indigo-600">
               {language === 'ar' ? 'نظام الحماية الذكي' : (language === 'fa' ? 'سیستم امنیتی هوشمند' : 'Smart Security System')}
             </h3>
             <ul className="space-y-4">
               {[
                 language === 'ar' ? 'تشفير كامل لكافة البيانات' : 'Full data encryption',
                 language === 'ar' ? 'أنظمة دفع وتجميع آمنة' : 'Secure payment systems',
                 language === 'ar' ? 'دعم فني عراقي متواصل' : 'Continuous technical support',
                 language === 'ar' ? 'لا نطلب كلمات مرور اجتماعية' : 'No social passwords required'
               ].map((tip, i) => (
                 <li key={i} className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                   <div className="glass-text flex-1">
                     <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">{tip}</p>
                   </div>
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

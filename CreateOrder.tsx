
import React, { useState } from 'react';
import { User, Order, OrderStatus, Service, Role } from '../types';
import { SERVICES } from '../constants';
import { ShoppingCart, User as UserIcon, ListOrdered, CheckCircle2, MessageCircle } from 'lucide-react';

const CreateOrder: React.FC<{ user: User; onOrderPlaced: (order: Order) => void }> = ({ user, onOrderPlaced }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // رقم الواتساب المقترح (يمكنك تغييره لاحقاً)
  const WHATSAPP_NUMBER = "+9647700000000"; 

  const isSupportService = selectedService?.id === 's4';
  const totalCost = selectedService ? Math.ceil(amount * selectedService.pricePerUnit) : 0;
  
  // السماح بالطلب إذا كان السعر 0 (خدمة دعم) أو إذا كان الرصيد كافياً
  const canAfford = isSupportService || user.role === Role.ADMIN || (user.points >= totalCost && totalCost > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    if (isSupportService) {
      window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`, '_blank');
      return;
    }

    if (!canAfford) return;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      targetUsername: username,
      amount: amount,
      totalCost: totalCost,
      status: OrderStatus.PROCESSING,
      createdAt: new Date().toISOString()
    };

    onOrderPlaced(newOrder);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000); // زيادة مدة عرض رسالة النجاح قليلاً
    setUsername('');
    setAmount(0);
    setSelectedService(null);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">تم استلام طلبك بنجاح!</h2>
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 p-6 rounded-[32px] max-w-sm mt-4">
          <p className="text-slate-600 dark:text-slate-400 font-bold mb-3 leading-relaxed">
            فريقنا يعمل الآن على تنفيذ طلبك بأعلى جودة.
          </p>
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-tighter">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            وقت التسليم المتوقع: خلال 2 - 24 ساعة
          </div>
        </div>
        <p className="text-slate-400 text-xs mt-6">يمكنك متابعة تحديثات الحالة لحظة بلحظة من سجل الطلبات.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 pb-24 lg:pb-0">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">طلب خدمة</h2>
        <p className="text-slate-500">اختر الخدمة المطلوبة وسنقوم بالتنفيذ فوراً.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map(service => (
            <button
              key={service.id}
              onClick={() => {
                setSelectedService(service);
                if (service.id === 's4') {
                  setAmount(0);
                  setUsername('طلب دعم');
                }
              }}
              className={`p-5 rounded-3xl border transition-all text-right relative overflow-hidden ${
                selectedService?.id === service.id 
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 shadow-md ring-2 ring-emerald-600' 
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <span className="text-3xl mb-3 block">{service.icon}</span>
              <h4 className="font-bold">{service.name}</h4>
              <p className="text-xs text-slate-500">
                {service.pricePerUnit > 0 ? `${service.pricePerUnit} نقطة / وحدة` : 'مجاني / تواصل مباشر'}
              </p>
              {selectedService?.id === service.id && (
                <div className="absolute top-2 left-2 text-emerald-600">
                  <CheckCircle2 size={16} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isSupportService ? (
            <>
              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-indigo-600">
                  <UserIcon size={16} /> اسم المستخدم / الرابط
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: @ahmed_iq"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-indigo-600">
                  <ListOrdered size={16} /> الكمية المطلوبة
                </label>
                <input
                  type="number"
                  required
                  min={selectedService?.minAmount || 0}
                  value={amount || ''}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  placeholder={`الحد الأدنى: ${selectedService?.minAmount || 0}`}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                />
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500">سعر الخدمة:</span>
                  <span className="font-bold">{selectedService?.pricePerUnit || 0} نقطة</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-500">الكمية:</span>
                  <span className="font-bold">{amount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">المجموع الكلي:</span>
                  <span className="text-2xl font-black text-emerald-600">{totalCost} <span className="text-xs font-normal">نقطة</span></span>
                </div>
              </div>

              {!canAfford && amount > 0 && (
                <p className="text-red-500 text-sm font-bold text-center">رصيدك لا يكفي لإتمام هذا الطلب!</p>
              )}

              <button
                type="submit"
                disabled={!canAfford || !selectedService || !username}
                className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:shadow-none flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} /> تأكيد الطلب
              </button>
            </>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={40} />
              </div>
              <h3 className="text-xl font-bold">تواصل مباشرة مع الدعم</h3>
              <p className="text-slate-500 text-sm">هذه الخدمة تتيح لك التواصل المباشر مع فريقنا عبر الواتساب للاستفسارات والطلبات الخاصة.</p>
              
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                <p className="text-xs text-slate-500 mb-1">رقم التواصل</p>
                <p className="text-lg font-bold text-emerald-600" dir="ltr">{WHATSAPP_NUMBER}</p>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} /> مراسلة عبر واتساب
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;

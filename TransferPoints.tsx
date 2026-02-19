
import React, { useState } from 'react';
import { User } from '../types';
import { SendHorizontal, User as UserIcon, Coins, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface TransferPointsProps {
  user: User;
  onTransfer: (targetUsername: string, amount: number) => { success: boolean, message: string };
}

const TransferPoints: React.FC<TransferPointsProps> = ({ user, onTransfer }) => {
  const [targetUsername, setTargetUsername] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUsername.trim() || amount <= 0) return;

    setIsLoading(true);
    setStatus({ type: null, message: '' });

    // محاكاة تأخير بسيط للعملية
    setTimeout(() => {
      const result = onTransfer(targetUsername.trim(), amount);
      setStatus({ type: result.success ? 'success' : 'error', message: result.message });
      setIsLoading(false);
      
      if (result.success) {
        setTargetUsername('');
        setAmount(0);
      }
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-24 lg:pb-0">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-4">تحويل النقاط</h2>
          <p className="text-indigo-100 opacity-80 leading-relaxed max-w-md">
            شارك نقاطك مع أصدقائك أو ادعم حسابات أخرى بسهولة. يتم تنفيذ التحويل بشكل فوري وآمن.
          </p>
        </div>
        <SendHorizontal size={120} className="absolute -bottom-4 -left-4 text-white/5 -rotate-12" />
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl border border-indigo-50 dark:border-indigo-950">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-indigo-600">
                <UserIcon size={16} /> اسم المستخدم المستلم
              </label>
              <input 
                type="text" 
                required
                placeholder="أدخل اليوزر (بدون @)"
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-indigo-600">
                <Coins size={16} /> كمية النقاط
              </label>
              <input 
                type="number" 
                required
                min="1"
                placeholder="أدخل عدد النقاط"
                value={amount || ''}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-dashed border-indigo-100 dark:border-indigo-900/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-500 font-bold">رسوم التحويل ثابتة:</span>
              <span className="text-xs font-black text-red-500">50 نقطة</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-bold">سيخصم من رصيدك:</span>
              <span className="text-xl font-black text-indigo-600">
                {amount > 0 ? amount + 50 : 0} <span className="text-xs font-normal">نقطة</span>
              </span>
            </div>
          </div>

          {status.type && (
            <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              status.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'
            }`}>
              {status.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
              <div className="glass-text">
                <p className="text-sm font-black">{status.message}</p>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading || !targetUsername || amount <= 0}
            className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <SendHorizontal size={22} /> تنفيذ التحويل
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-6 rounded-3xl flex items-start gap-4">
        <Info className="text-amber-600 shrink-0" size={24} />
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">تنبيه:</span> عمليات التحويل غير قابلة للاسترداد. تأكد دائماً من صحة اسم المستخدم قبل الضغط على تنفيذ التحويل. الرسوم (50 نقطة) تُخصم تلقائياً من المرسل لتغطية تكاليف معالجة البيانات.
        </p>
      </div>
    </div>
  );
};

export default TransferPoints;

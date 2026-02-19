
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, User } from '../types';
import { MOCK_TASKS } from '../constants';
import { 
  CheckCircle, 
  ExternalLink, 
  Timer, 
  Coins, 
  Play, 
  Pause, 
  Zap, 
  Settings2, 
  Gift, 
  Ticket,
  Send,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

interface EarnPointsProps {
  user: User;
  onTaskComplete: (reward: number, taskId: string) => void;
  onRedeemGift: (code: string) => { success: boolean, message: string };
  onSecurityTrigger: (reason: string) => void;
}

const EarnPoints: React.FC<EarnPointsProps> = ({ user, onTaskComplete, onRedeemGift, onSecurityTrigger }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Gift Code State
  const [giftCode, setGiftCode] = useState('');
  const [giftStatus, setGiftStatus] = useState<{message: string, type: 'success' | 'error' | null}>({message: '', type: null});
  const [isGiftLoading, setIsGiftLoading] = useState(false);

  // Auto-collect state
  const [isAutoActive, setIsAutoActive] = useState(false);
  const [intervalTime, setIntervalTime] = useState(10); // Default 10 seconds
  const [autoStatus, setAutoStatus] = useState<'IDLE' | 'WORKING' | 'COOLDOWN'>('IDLE');
  const [nextTaskTime, setNextTaskTime] = useState<number | null>(null);
  
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  useEffect(() => {
    if (intervalTime < 1) {
      onSecurityTrigger("MANIPULATED_INTERVAL_VALUE_LESS_THAN_1");
    }
  }, [intervalTime, onSecurityTrigger]);

  useEffect(() => {
    if (isAutoActive) {
      startAutoCollect();
    } else {
      stopAutoCollect();
    }
    return () => stopAutoCollect();
  }, [isAutoActive, intervalTime]);

  const startAutoCollect = () => {
    setAutoStatus('WORKING');
    processNextAutoTask();
  };

  const stopAutoCollect = () => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    setAutoStatus('IDLE');
    setNextTaskTime(null);
  };

  const processNextAutoTask = () => {
    const nextTask = MOCK_TASKS.find(t => !user.completedTasks?.includes(t.id));
    
    if (!nextTask) {
      setIsAutoActive(false);
      setAutoStatus('IDLE');
      alert("تم إنجاز جميع المهام المتاحة حالياً!");
      return;
    }

    setNextTaskTime(Date.now() + intervalTime * 1000);
    
    autoTimerRef.current = setTimeout(() => {
      setLoadingId(nextTask.id);
      
      setTimeout(() => {
        onTaskComplete(nextTask.reward, nextTask.id);
        setLoadingId(null);
        setAutoStatus('COOLDOWN');
        
        setTimeout(() => {
          if (isAutoActive) processNextAutoTask();
        }, 1000);
      }, 2000);
    }, intervalTime * 1000);
  };

  const handleManualComplete = (task: Task) => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < 500) {
      clickCountRef.current += 1;
      if (clickCountRef.current > 5) {
        onSecurityTrigger("RAPID_MANUAL_VERIFICATION_CLICK_ABUSE");
        return;
      }
    } else {
      clickCountRef.current = 0;
    }
    lastClickTimeRef.current = now;

    if (user.completedTasks?.includes(task.id)) return;
    setLoadingId(task.id);
    setTimeout(() => {
      onTaskComplete(task.reward, task.id);
      setLoadingId(null);
    }, 2500);
  };

  const handleRedeemGift = () => {
    if (!giftCode.trim()) return;
    setIsGiftLoading(true);
    setGiftStatus({message: '', type: null});

    setTimeout(() => {
      const result = onRedeemGift(giftCode.trim());
      setGiftStatus({ message: result.message, type: result.success ? 'success' : 'error' });
      if (result.success) setGiftCode('');
      setIsGiftLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 lg:pb-12 px-4 md:px-0">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">اجمع النقاط</h2>
        <p className="text-slate-500">أكمل المهام أو استخدم التجميع التلقائي أو فعل أكواد الهدايا.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Ticket size={24} />
              </div>
              <h3 className="text-xl font-bold">كود الهدية</h3>
            </div>
            
            <p className="text-white/80 text-sm mb-6 leading-relaxed">أدخل كود الهدية الذي حصلت عليه لتحصل على نقاط فورية في رصيدك.</p>
            
            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="أدخل الكود هنا..."
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-white placeholder:text-white/50 focus:bg-white/20 outline-none transition-all font-bold tracking-widest text-center"
              />
              <button 
                onClick={handleRedeemGift}
                disabled={isGiftLoading || !giftCode.trim()}
                className="w-full bg-white text-orange-600 py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isGiftLoading ? <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div> : 'تفعيل الكود'}
              </button>
            </div>
            
            {giftStatus.type && (
              <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-bottom-2 ${giftStatus.type === 'success' ? 'bg-emerald-400/20 text-emerald-100' : 'bg-red-400/20 text-red-100'}`}>
                {giftStatus.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {giftStatus.message}
              </div>
            )}
          </div>
          <Gift className="absolute -bottom-6 -left-6 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                <Send size={24} />
              </div>
              <h3 className="text-xl font-bold">قناة التليجرام</h3>
            </div>
            
            <div className="space-y-3 mb-8">
              <p className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                يمكنك الحصول على نقاط من هذه القناة على التليجرام:
              </p>
              <ul className="text-sm text-slate-500 space-y-2">
                <li className="flex items-center gap-2">• توزيع أكواد هدايا يومية</li>
                <li className="flex items-center gap-2">• مسابقات وجوائز كبرى</li>
                <li className="flex items-center gap-2">• دعم فني سريع</li>
              </ul>
            </div>
          </div>

          <a 
            href="https://t.me/nemericco" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-[#0088cc] text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <MessageCircle size={20} />
            الانتقال إلى تليجرام
          </a>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl mb-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">التجميع التلقائي</h3>
                <p className="text-slate-500 text-sm">دع النظام يجمع النقاط نيابة عنك.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Settings2 size={16} /> الفاصل الزمني: <span className="text-indigo-600">{intervalTime} ثانية</span>
                  </label>
                  <span className="text-xs text-slate-400">1 - 100 ثانية</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={intervalTime}
                  onChange={(e) => setIntervalTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {isAutoActive && nextTaskTime && (
                <div className="flex items-center gap-2 text-indigo-600 animate-pulse">
                  <Timer size={16} />
                  <span className="text-sm font-bold">المهمة القادمة خلال: {Math.max(0, Math.ceil((nextTaskTime - Date.now()) / 1000))} ثانية</span>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsAutoActive(!isAutoActive)}
            className={`w-full md:w-48 h-16 rounded-3xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl ${
              isAutoActive 
              ? 'bg-red-50 text-red-600 border border-red-200 shadow-red-600/5' 
              : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:scale-105 active:scale-95'
            }`}
          >
            {isAutoActive ? <><Pause fill="currentColor" size={24} /> إيقاف</> : <><Play fill="currentColor" size={24} /> بدء التجميع</>}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg mb-4 px-2">المهام المتاحة</h3>
        {MOCK_TASKS.map(task => {
          const isCompleted = user.completedTasks?.includes(task.id);
          const isLoading = loadingId === task.id;

          return (
            <div key={task.id} className={`bg-white dark:bg-slate-900 p-5 rounded-3xl border transition-all ${
              isCompleted ? 'opacity-60 border-emerald-500/30' : 'border-slate-100 dark:border-slate-800 hover:shadow-md'
            }`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                    task.platform === 'INSTAGRAM' ? 'bg-pink-100 text-pink-600' :
                    task.platform === 'TIKTOK' ? 'bg-black text-white' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {task.platform === 'INSTAGRAM' ? '📸' : task.platform === 'TIKTOK' ? '🎵' : '👥'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">{task.type}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full flex items-center gap-1">
                        <Coins size={10} /> +{task.reward}
                      </span>
                    </div>
                    <h4 className="font-bold">{task.description}</h4>
                  </div>
                </div>

                {isCompleted ? (
                  <div className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                    <CheckCircle size={18} /><span>تمت</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 shrink-0">
                    {!isAutoActive && (
                      <a href={task.link} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                        <ExternalLink size={14} /> تنفيذ
                      </a>
                    )}
                    <button 
                      onClick={() => handleManualComplete(task)}
                      disabled={isLoading || isAutoActive}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : 'تحقق'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EarnPoints;

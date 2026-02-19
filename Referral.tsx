
import React, { useState, useMemo } from 'react';
import { User, Role } from '../types';
import { Share2, Copy, CheckCircle, Trophy, Gift, Star, Link as LinkIcon, Hash, AlertTriangle, TrendingUp, Medal } from 'lucide-react';

const Referral: React.FC<{ user: User }> = ({ user }) => {
  const [copiedType, setCopiedType] = useState<'CODE' | 'LINK' | null>(null);
  
  // نظام حساب الرتبة التخيلي بناءً على نشاط المستخدم
  const userRank = useMemo(() => {
    const baseRank = 10000;
    const boost = user.referralCount * 12 + (user.points / 100);
    return Math.max(1, Math.floor(baseRank - boost));
  }, [user.referralCount, user.points]);

  const referralLink = useMemo(() => {
    const base = window.location.origin + window.location.pathname;
    return `${base}#/login?ref=${user.referralCode}`;
  }, [user.referralCode]);

  const copyToClipboard = (text: string, type: 'CODE' | 'LINK') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'انضم إلي في فالو عراق',
          text: `استخدم كودي ${user.referralCode} وانضم لأقوى منصة لزيادة التفاعل!`,
          url: referralLink,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      copyToClipboard(referralLink, 'LINK');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 lg:pb-0">
      <div className="text-center bg-white dark:bg-slate-900 p-12 rounded-[50px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative">
        <div className="relative z-10">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">نظام الترتيب العالمي</h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-10 leading-relaxed">
            شارك كود الإحالة الخاص بك لتزيد من قوة حسابك وتتقدم في الترتيب العالمي لمستخدمي فالو عراق. 
            كلما زادت إحالاتك، زادت فرصك في الحصول على رتبة "النخبة".
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-right">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 text-slate-400 mb-3 text-xs font-bold uppercase tracking-wider">
                <Hash size={14} /> كود الإحالة الخاص بك
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-2xl font-black text-emerald-600 tracking-widest">{user.referralCode}</span>
                <button 
                  onClick={() => copyToClipboard(user.referralCode, 'CODE')}
                  className={`p-3 rounded-2xl transition-all ${copiedType === 'CODE' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-emerald-600 shadow-sm'}`}
                >
                  {copiedType === 'CODE' ? <CheckCircle size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 text-slate-400 mb-3 text-xs font-bold uppercase tracking-wider">
                <LinkIcon size={14} /> رابط الإحالة المباشر
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate max-w-[150px]" dir="ltr">{referralLink}</span>
                <button 
                  onClick={() => copyToClipboard(referralLink, 'LINK')}
                  className={`p-3 rounded-2xl transition-all ${copiedType === 'LINK' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-indigo-600 shadow-sm'}`}
                >
                  {copiedType === 'LINK' ? <CheckCircle size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={handleShare}
            className="mt-8 w-full md:w-auto px-12 py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20 active:scale-95"
          >
            <Share2 size={24} /> مشاركة الرابط الآن
          </button>
        </div>

        <Star className="absolute -top-10 -right-10 w-40 h-40 text-emerald-100 dark:text-emerald-900/10 opacity-50" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* الترتيب في التجميع */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-2">Global Ranking</p>
              <h3 className="text-3xl font-black mb-1">#{userRank.toLocaleString()}</h3>
              <p className="text-slate-400 text-sm">ترتيبك الحالي في التجميع العالمي</p>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <TrendingUp size={32} className="text-emerald-400" />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase">
              <span>الرتبة القادمة</span>
              <span className="text-emerald-400">نخبة (Elite)</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>

        {/* حالة الحساب التنافسية */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-bold mb-2 uppercase">Account Status</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">حساب موثوق</h3>
            <p className="text-emerald-600 text-xs font-bold mt-1">مؤهل للمسابقات الكبرى</p>
          </div>
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-3xl flex items-center justify-center">
            <Medal size={32} />
          </div>
        </div>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-6 rounded-3xl flex items-start gap-4">
        <AlertTriangle className="text-amber-600 shrink-0" size={24} />
        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">ملاحظة أمنية:</span> نظام الترتيب يعتمد على "قوة الحساب". قوة الحساب تزداد بجمع النقاط ودعوة المستخدمين الحقيقيين. الحسابات التي تستخدم إحالات وهمية ستفقد ترتيبها وتتعرض للحظر الدائم.
        </p>
      </div>
    </div>
  );
};

export default Referral;

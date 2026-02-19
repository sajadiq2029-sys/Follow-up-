
import React, { useState } from 'react';
import { User } from '../types';
import { ShieldCheck, AlertCircle, Loader2, LockKeyhole } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getOrCreateUserProfile } from '../firebaseUser';

interface LoginProps {
  onLogin: (user: User) => void;
  existingUsers: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, existingUsers }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ملاحظة: Firebase Auth يشتغل بالإيميل + كلمة المرور
      const email = (formData.username || '').trim();
      const password = formData.password;

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = cred.user;

      const profile: User = await getOrCreateUserProfile({
        uid: fbUser.uid,
        email: fbUser.email || email
      });

      if (profile.status === 'BANNED') {
        setError('عذراً، هذا الحساب محظور من استخدام المنصة.');
        setLoading(false);
        return;
      }

      if (profile.status === 'COMPROMISED') {
        setError('تم تجميد الوصول لهذا الحساب لدواعي أمنية.');
        setLoading(false);
        return;
      }

      onLogin(profile);
    } catch (err: any) {
      const code = String(err?.code || '');
      if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password')) {
        setError('خطأ في الإيميل أو كلمة المرور.');
      } else if (code.includes('auth/user-not-found')) {
        setError('هذا المستخدم غير موجود. أنشئه من Firebase Authentication أولاً.');
      } else {
        setError('صار خطأ أثناء تسجيل الدخول. تأكد من تفعيل Email/Password في Firebase.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a051d] font-sans relative overflow-hidden">
      {/* Premium Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Orbs */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[100px]"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      </div>

      <div className="w-full max-w-[400px] relative z-10">
        <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-[48px] p-10 mb-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl rotate-12 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20">
              <span className="text-white font-black text-3xl -rotate-12">FI</span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter mb-2 bg-gradient-to-tr from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent">
              Falo Iraq
            </h1>
            <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
               <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Premium Iraq Platform</p>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl flex items-start gap-3 text-xs">
              <AlertCircle size={18} className="shrink-0" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <input 
                type="text" 
                name="username"
                required
                placeholder="اسم المستخدم"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/30"
              />
            </div>

            <div className="space-y-1.5">
              <input 
                type="password" 
                name="password"
                required
                placeholder="كلمة المرور"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 outline-none transition-all placeholder:text-white/30"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-600/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-6 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>

            <div className="text-center pt-4">
              <button type="button" className="text-indigo-300/60 text-xs hover:text-indigo-300 transition-colors font-bold">هل نسيت كلمة المرور؟</button>
            </div>
          </form>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center text-sm mb-8">
          <p className="text-white/60">
            ليس لديك حساب؟ <span className="text-indigo-400 font-black cursor-help hover:text-indigo-300 transition-colors">تواصل مع الإدارة</span>
          </p>
        </div>

        <div className="text-center">
          <p className="text-white/20 text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-2">
            <LockKeyhole size={12} /> SECURE PREMIUM KERNEL 4.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

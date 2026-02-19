
import React, { useState } from 'react';
import { ShieldAlert, Terminal, ArrowRight, Coins, Fingerprint, Ticket, Trash2, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GiftCode } from '../types';

interface DevPortalProps {
  setPointsForUser: (username: string, amount: number, isRelative: boolean) => void;
  giftCodes: GiftCode[];
  setGiftCodes: React.Dispatch<React.SetStateAction<GiftCode[]>>;
}

const DevPortal: React.FC<DevPortalProps> = ({ setPointsForUser, giftCodes, setGiftCodes }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const DEV_USER = "hdehewufhfie7@frgrgfghsyg";
  const DEV_PASS = "plmplmpl0987654321pl@hjfjnfkfs6gdfkf";

  // Action state - Points
  const [targetUsername, setTargetUsername] = useState('');
  const [pointAmount, setPointAmount] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState('');

  // Action state - Gift Codes
  const [newGift, setNewGift] = useState({ code: '', reward: 0, expiresAt: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === DEV_USER && loginForm.pass === DEV_PASS) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('إذن الدخول مرفوض. تم تسجيل محاولة الدخول غير المصرح بها.');
    }
  };

  const handlePointAction = (isRelative: boolean) => {
    if (!targetUsername) return;
    setPointsForUser(targetUsername, pointAmount, isRelative);
    setSuccessMsg(`تم تحديث نقاط المستخدم ${targetUsername} بنجاح.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddGift = () => {
    if (!newGift.code || newGift.reward <= 0 || !newGift.expiresAt) return;
    const gift: GiftCode = {
      id: Math.random().toString(36).substr(2, 9),
      code: newGift.code.toUpperCase(),
      reward: newGift.reward,
      expiresAt: new Date(newGift.expiresAt).toISOString()
    };
    setGiftCodes([...giftCodes, gift]);
    setNewGift({ code: '', reward: 0, expiresAt: '' });
  };

  const removeGift = (id: string) => {
    setGiftCodes(giftCodes.filter(g => g.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-mono">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-2xl">
          <div className="flex flex-col items-center mb-10 text-emerald-500">
            <Fingerprint size={64} className="mb-4 animate-pulse" />
            <h2 className="text-2xl font-black uppercase tracking-tighter">Dev Secure Portal</h2>
            <p className="text-xs opacity-50">Authorized Personnel Only</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="text" 
              placeholder="Developer UID"
              value={loginForm.user}
              onChange={(e) => setLoginForm({...loginForm, user: e.target.value})}
              className="w-full bg-slate-800 border-none rounded-2xl p-4 text-emerald-500 placeholder:text-emerald-900 outline-none"
            />
            <input 
              type="password" 
              placeholder="Secure Token"
              value={loginForm.pass}
              onChange={(e) => setLoginForm({...loginForm, pass: e.target.value})}
              className="w-full bg-slate-800 border-none rounded-2xl p-4 text-emerald-500 placeholder:text-emerald-900 outline-none"
            />
            {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
            <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
              <ShieldAlert size={18} /> Authenticate
            </button>
          </form>
          <button onClick={() => navigate('/')} className="w-full mt-4 text-slate-600 text-xs hover:text-emerald-500">Back to Public View</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-emerald-500 p-8 font-mono overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-b border-emerald-900 pb-8">
          <div className="flex items-center gap-4">
            <Terminal size={32} />
            <div>
              <h1 className="text-2xl font-black">Falo IQ Developer Kernel</h1>
              <p className="text-xs text-emerald-900">SYSTEM STATUS: AUTHORIZED</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs hover:underline"><ArrowRight size={14} /> Exit System</button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Points Management */}
          <div className="bg-slate-900 border border-emerald-900/50 p-8 rounded-[40px]">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Coins size={20} /> Point Manipulation</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
                placeholder="Username / Email"
                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white outline-none"
              />
              <input 
                type="number" 
                value={pointAmount}
                onChange={(e) => setPointAmount(parseInt(e.target.value))}
                placeholder="Point Value"
                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white outline-none"
              />
              {successMsg && <p className="text-xs text-emerald-400">{successMsg}</p>}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handlePointAction(true)} className="bg-emerald-600 text-white py-4 rounded-2xl font-bold">Relative (+/-)</button>
                <button onClick={() => handlePointAction(false)} className="bg-slate-800 text-emerald-500 py-4 rounded-2xl font-bold border border-emerald-500/20">Absolute (=)</button>
              </div>
            </div>
          </div>

          {/* New Gift Code */}
          <div className="bg-slate-900 border border-emerald-900/50 p-8 rounded-[40px]">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Ticket size={20} /> Create New Gift Code</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="GIFT_CODE"
                value={newGift.code}
                onChange={(e) => setNewGift({...newGift, code: e.target.value})}
                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white outline-none"
              />
              <input 
                type="number" 
                placeholder="Reward Points"
                value={newGift.reward || ''}
                onChange={(e) => setNewGift({...newGift, reward: parseInt(e.target.value) || 0})}
                className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white outline-none"
              />
              <div className="relative">
                 <input 
                  type="datetime-local" 
                  value={newGift.expiresAt}
                  onChange={(e) => setNewGift({...newGift, expiresAt: e.target.value})}
                  className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white outline-none"
                />
                <span className="absolute right-4 top-4 text-emerald-900 text-[10px] pointer-events-none uppercase">Expiry Time</span>
              </div>
              <button onClick={handleAddGift} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all">Generate Code</button>
            </div>
          </div>
        </div>

        {/* Existing Gift Codes List */}
        <div className="bg-slate-900 border border-emerald-900/50 p-8 rounded-[40px]">
           <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Clock size={20} /> Active Gift Codes</h3>
           <div className="grid gap-4">
             {giftCodes.length === 0 ? (
               <p className="text-emerald-900 text-sm">No active gift codes found in database.</p>
             ) : (
               giftCodes.map(gift => (
                 <div key={gift.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-emerald-900/20">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-emerald-900 uppercase font-black">Code</p>
                        <p className="font-bold text-white tracking-widest">{gift.code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-900 uppercase font-black">Reward</p>
                        <p className="font-bold text-emerald-500">{gift.reward} Pts</p>
                      </div>
                      <div>
                        <p className="text-xs text-emerald-900 uppercase font-black">Expires At</p>
                        <p className={`text-xs ${new Date(gift.expiresAt) < new Date() ? 'text-red-500' : 'text-slate-400'}`}>
                          {new Date(gift.expiresAt).toLocaleString('ar-IQ')}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => removeGift(gift.id)} className="p-3 bg-red-900/20 text-red-500 rounded-xl hover:bg-red-900/40">
                      <Trash2 size={18} />
                    </button>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DevPortal;

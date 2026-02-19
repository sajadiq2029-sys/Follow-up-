
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Coins, 
  PlusCircle, 
  History, 
  LogOut, 
  Bell, 
  Menu,
  Share2,
  BrainCircuit,
  FileText,
  Lock,
  Download,
  SendHorizontal,
  Settings as SettingsIcon,
  Languages
} from 'lucide-react';
import { User, Order, GiftCode, AppNotification } from './types';
import { INITIAL_USER, ADMIN_USER } from './constants';
import { encrypt, decrypt } from './security';
import { translations, Language } from './translations';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { getOrCreateUserProfile } from './firebaseUser';

import UserDashboard from './pages/UserDashboard';
import EarnPoints from './pages/EarnPoints';
import CreateOrder from './pages/CreateOrder';
import OrderHistory from './pages/OrderHistory';
import Referral from './pages/Referral';
import Login from './pages/Login';
import AISupport from './pages/AISupport';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DevPortal from './pages/DevPortal';
import TransferPoints from './pages/TransferPoints';
import Settings from './pages/Settings';
import NotificationCenter from './components/NotificationCenter';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isCompromised, setIsCompromised] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // إدارة اللغة والوضع الليلي
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('falo_lang') as Language) || 'ar';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('falo_theme');
    return saved === 'dark';
  });

  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    localStorage.setItem('falo_lang', language);
  }, [language]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('falo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('falo_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
    } else {
      alert("لتحميل التطبيق: استخدم خيار 'إضافة إلى الشاشة الرئيسية' من قائمة المتصفح.");
    }
  };

  useEffect(() => {
    const savedUsersEnc = localStorage.getItem('falo_db_users_v5');
    const savedOrdersEnc = localStorage.getItem('falo_db_orders_v5');
    const savedGiftCodesEnc = localStorage.getItem('falo_db_gifts_v5');
    const savedNotifsEnc = localStorage.getItem('falo_db_notifs_v5');
    const activeSessionEnc = localStorage.getItem('falo_session_user_v5');

    if (savedUsersEnc) {
      const users = decrypt(savedUsersEnc);
      const arr = Array.isArray(users) ? users : [];
      // ✅ ضمان وجود حساب أدمن داخل قاعدة البيانات المحلية
      const withAdmin = (() => {
        const hasAdmin = arr.some((u: any) => u?.role === 'ADMIN');
        const replaced = arr.map((u: any) => (u?.id === ADMIN_USER.id ? ADMIN_USER : u));
        return hasAdmin ? replaced : [...replaced, ADMIN_USER];
      })();
      setAllUsers(withAdmin);
      localStorage.setItem('falo_db_users_v5', encrypt(withAdmin));
    } else {
      const initialDb = [INITIAL_USER, ADMIN_USER];
      setAllUsers(initialDb);
      localStorage.setItem('falo_db_users_v5', encrypt(initialDb));
    }

    if (savedOrdersEnc) {
      const orders = decrypt(savedOrdersEnc);
      if (orders) setOrders(orders);
    }

    if (savedGiftCodesEnc) {
      const gifts = decrypt(savedGiftCodesEnc);
      if (gifts) setGiftCodes(gifts);
    }

    if (savedNotifsEnc) {
      const notifs = decrypt(savedNotifsEnc);
      if (notifs) setNotifications(notifs);
    }

    if (activeSessionEnc) {
      const user = decrypt(activeSessionEnc);
      if (user) {
        if (user.status === 'COMPROMISED') setIsCompromised(true);
        else setCurrentUser(user);
      }
    }
  }, []);

  // ✅ جلسة Firebase (تسجيل دخول تلقائي) + جلب role من Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) return;
      try {
        const profile = await getOrCreateUserProfile({
          uid: fbUser.uid,
          email: fbUser.email || ''
        });
        if (profile.status === 'COMPROMISED') setIsCompromised(true);
        else {
          setCurrentUser(profile);
          localStorage.setItem('falo_session_user_v5', encrypt(profile));
        }
      } catch (e) {
        // تجاهل بهدوء
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (allUsers.length > 0) localStorage.setItem('falo_db_users_v5', encrypt(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('falo_db_notifs_v5', encrypt(notifications));
  }, [notifications]);

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'createdAt' | 'read' | 'userId'>) => {
    if (!currentUser) return;
    const newNotif: AppNotification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
    
    // Play sound if possible
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.3;
      audio.play();
    } catch (e) {}
  }, [currentUser]);

  const handleLogin = (user: User) => {
    if (user.status === 'COMPROMISED') {
      setIsCompromised(true);
      return;
    }
    setCurrentUser(user);
    localStorage.setItem('falo_session_user_v5', encrypt(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('falo_session_user_v5');
    try { signOut(auth); } catch (e) {}
  };

  const updatePoints = (amount: number, taskId?: string) => {
    if (!currentUser) return;
    // Admin points are unlimited: never deduct points from ADMIN.
    if (currentUser.role === Role.ADMIN && amount < 0) {
      return;
    }
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updatedCompletedTasks = taskId ? [...(u.completedTasks || []), taskId] : u.completedTasks;
        const updatedUser = { ...u, points: u.points + amount, completedTasks: updatedCompletedTasks };
        setCurrentUser(updatedUser);
        localStorage.setItem('falo_session_user_v5', encrypt(updatedUser));
        return updatedUser;
      }
      return u;
    }));
  };

  const handleTransfer = (targetUsername: string, amount: number): { success: boolean, message: string } => {
    if (!currentUser) return { success: false, message: 'يجب تسجيل الدخول أولاً' };
    const totalDeduction = currentUser.role === Role.ADMIN ? 0 : (amount + 50);
    
    if (currentUser.points < totalDeduction) {
      return { success: false, message: 'عذراً، رصيدك غير كافٍ لتغطية المبلغ والرسوم (50 نقطة).' };
    }

    const recipient = allUsers.find(u => u.username === targetUsername);
    if (!recipient) {
      return { success: false, message: 'اسم المستخدم غير موجود في النظام.' };
    }

    if (recipient.id === currentUser.id) {
      return { success: false, message: 'لا يمكنك تحويل النقاط لنفسك!' };
    }

    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updated = { ...u, points: u.points - totalDeduction };
        setCurrentUser(updated);
        localStorage.setItem('falo_session_user_v5', encrypt(updated));
        
        addNotification({
          title: language === 'ar' ? 'تم التحويل بنجاح' : (language === 'fa' ? 'انتقال موفقیت‌آمیز' : 'Transfer Successful'),
          message: language === 'ar' ? `تم تحويل ${amount} نقطة إلى @${targetUsername}` : `Transferred ${amount} points to @${targetUsername}`,
          type: 'TRANSFER'
        });

        return updated;
      }
      if (u.id === recipient.id) {
        return { ...u, points: u.points + amount };
      }
      return u;
    }));

    return { success: true, message: `تم تحويل ${amount} نقطة بنجاح إلى @${targetUsername}.` };
  };

  const handleRedeemGift = (codeString: string): { success: boolean, message: string } => {
    if (!currentUser) return { success: false, message: 'يجب تسجيل الدخول' };
    const gift = giftCodes.find(g => g.code.toUpperCase() === codeString.toUpperCase());
    if (!gift) return { success: false, message: 'هذا الكود غير موجود.' };
    if (new Date(gift.expiresAt) < new Date()) return { success: false, message: 'عذراً، هذا الكود انتهت صلاحيته.' };
    if (currentUser.usedGiftCodes?.includes(gift.id)) return { success: false, message: 'لقد استخدمت هذا الكود مسبقاً.' };

    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updated = { 
          ...u, 
          points: u.points + gift.reward, 
          usedGiftCodes: [...(u.usedGiftCodes || []), gift.id] 
        };
        setCurrentUser(updated);
        localStorage.setItem('falo_session_user_v5', encrypt(updated));
        
        addNotification({
          title: language === 'ar' ? 'كود هدية مفعل' : (language === 'fa' ? 'کد هدیه فعال شد' : 'Gift Code Redeemed'),
          message: language === 'ar' ? `حصلت على ${gift.reward} نقطة مجانية!` : `Received ${gift.reward} free points!`,
          type: 'GIFT'
        });

        return updated;
      }
      return u;
    }));
    return { success: true, message: `مبروك! تم تفعيل الكود وحصلت على ${gift.reward} نقطة.` };
  };

  const handlePlaceOrder = (o: Order) => {
    setOrders([o, ...orders]);
    updatePoints(-o.totalCost);
    
    addNotification({
      title: language === 'ar' ? 'طلب جديد قيد المعالجة' : (language === 'fa' ? 'سفارش جدید در حال بررسی' : 'New Order Processing'),
      message: language === 'ar' ? `تم استلام طلب ${o.serviceName} بنجاح.` : `Order for ${o.serviceName} received.`,
      type: 'ORDER'
    });
  };

  const setPointsForUser = (username: string, amount: number, isRelative: boolean) => {
    setAllUsers(prev => prev.map(u => {
      if (u.username === username || u.email === username) {
        const newPoints = isRelative ? u.points + amount : amount;
        const updatedUser = { ...u, points: Math.max(0, newPoints) };
        if (currentUser && u.id === currentUser.id) {
          setCurrentUser(updatedUser);
          localStorage.setItem('falo_session_user_v5', encrypt(updatedUser));
          
          addNotification({
            title: language === 'ar' ? 'تعديل الرصيد من الإدارة' : 'Admin Credit Adjustment',
            message: language === 'ar' ? `تم تعديل رصيدك بمقدار ${amount} نقطة.` : `Balance adjusted by ${amount} points.`,
            type: 'ANNOUNCEMENT'
          });
        }
        return updatedUser;
      }
      return u;
    }));
  };

  const handleBreach = (reason: string) => {
    if (currentUser) {
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, status: 'COMPROMISED' } : u));
      setIsCompromised(true);
      setCurrentUser(null);
      localStorage.removeItem('falo_session_user_v5');
    }
  };

  if (isCompromised) {
    return (
      <div className="min-h-screen bg-slate-950 text-indigo-500 flex flex-col items-center justify-center p-8 text-center">
        <Lock size={80} className="mb-6 animate-bounce" />
        <h1 className="text-4xl font-black mb-4 uppercase">Security Lock</h1>
        <p className="text-lg mb-12 max-w-lg text-slate-400">تم تجميد الوصول بسبب نشاط غير قانوني. تواصل مع المطور.</p>
        <a href="https://t.me/c2ccm" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-indigo-600/40">الدعم الفني</a>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Routes>
          <Route path="/login" element={!currentUser ? <Login onLogin={handleLogin} existingUsers={allUsers} /> : <Navigate to="/" />} />
          <Route path="/privacy" element={<PrivacyPolicy standalone={!currentUser} />} />
          <Route path="/hidden-dev-portal" element={<DevPortal setPointsForUser={setPointsForUser} giftCodes={giftCodes} setGiftCodes={setGiftCodes} />} />
          <Route path="/*" element={
            !currentUser ? <Navigate to="/login" /> : (
              <MainLayout 
                user={currentUser} 
                onLogout={handleLogout} 
                onInstall={handleInstallClick} 
                language={language} 
                setLanguage={setLanguage}
                notifications={notifications.filter(n => n.userId === currentUser.id)}
                setNotifications={setNotifications}
              >
                <Routes>
                  <Route path="/" element={<UserDashboard user={currentUser} orders={orders.filter(o => o.userId === currentUser.id)} language={language} />} />
                  <Route path="/earn" element={<EarnPoints user={currentUser} onTaskComplete={updatePoints} onRedeemGift={handleRedeemGift} onSecurityTrigger={handleBreach} />} />
                  <Route path="/transfer" element={<TransferPoints user={currentUser} onTransfer={handleTransfer} />} />
                  <Route path="/order" element={<CreateOrder user={currentUser} onOrderPlaced={handlePlaceOrder} />} />
                  <Route path="/history" element={<OrderHistory orders={orders.filter(o => o.userId === currentUser.id)} />} />
                  <Route path="/referral" element={<Referral user={currentUser} />} />
                  <Route path="/ai" element={<AISupport />} />
                  <Route path="/settings" element={<Settings isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </MainLayout>
            )
          } />
        </Routes>
      </div>
    </Router>
  );
};

const MainLayout: React.FC<{ 
  user: User; 
  onLogout: () => void; 
  onInstall: () => void; 
  language: Language;
  setLanguage: (lang: Language) => void;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  children: React.ReactNode; 
}> = ({ user, onLogout, onInstall, language, setLanguage, notifications, setNotifications, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notifCenterOpen, setNotifCenterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language];

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
    setNotifications(prev => prev.filter(n => n.userId !== user.id));
    setNotifCenterOpen(false);
  };

  const menuItems = [
    { path: '/', label: t.dashboard, icon: LayoutDashboard },
    { path: '/earn', label: t.earn, icon: Coins },
    { path: '/transfer', label: t.transfer, icon: SendHorizontal },
    { path: '/order', label: t.order, icon: PlusCircle },
    { path: '/history', label: t.history, icon: History },
    { path: '/referral', label: t.referral, icon: Share2 },
    { path: '/ai', label: t.ai, icon: BrainCircuit },
    { path: '/settings', label: t.settings, icon: SettingsIcon },
    { path: '/privacy', label: t.privacy, icon: FileText },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed inset-y-0 ${language === 'en' ? 'left-0' : 'right-0'} z-50 w-64 bg-white dark:bg-slate-900 border-x border-indigo-100 dark:border-indigo-950 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : (language === 'en' ? '-translate-x-full' : 'translate-x-full')}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-indigo-50 dark:border-indigo-950">
            <h1 className="text-2xl font-black bg-gradient-to-l from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t.appName}</h1>
            <div className="glass-text mt-1"><p className="text-[10px] text-indigo-500 font-bold uppercase">{t.premium}</p></div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${location.pathname === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-600 dark:text-slate-400'}`}>
                <item.icon size={20} />
                <span className="font-bold">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-indigo-50 dark:border-indigo-950 space-y-2">
            <button onClick={onInstall} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-indigo-600 bg-indigo-50 dark:bg-indigo-900/10 font-bold hover:bg-indigo-100 transition-all"><Download size={20} /> {t.install}</button>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold"><LogOut size={20} /> {t.logout}</button>
          </div>
        </div>
      </aside>
      <main className={`flex-1 ${language === 'en' ? 'lg:ml-64' : 'lg:mr-64'} p-4 lg:p-8 relative`}>
        <header className="flex items-center justify-between mb-8 lg:hidden">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm"><Menu size={24} /></button>
            <button 
              onClick={() => setNotifCenterOpen(!notifCenterOpen)}
              className="p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm relative text-indigo-600"
            >
              <Bell size={24} />
              {unreadNotifs > 0 && <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full"></span>}
            </button>
          </div>
          <h1 className="text-xl font-black italic tracking-tighter bg-gradient-to-tr from-indigo-600 to-purple-600 bg-clip-text text-transparent">Falo Iraq</h1>
          <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm"><Coins size={14} /> {user.points}</div>
        </header>

        <header className="hidden lg:flex items-center justify-between mb-8">
          <div><h2 className="text-2xl font-black">{t.welcome} {user.name} 👑</h2><p className="text-slate-500">{t.system_desc}</p></div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <button 
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="p-3 bg-white dark:bg-slate-900 border border-indigo-50 dark:border-indigo-950 rounded-2xl shadow-md text-indigo-600 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Languages size={20} />
                  <span className="text-xs font-bold uppercase">{language}</span>
                </button>
                {langMenuOpen && (
                  <div className={`absolute top-14 ${language === 'en' ? 'left-0' : 'right-0'} w-32 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-indigo-50 dark:border-indigo-900 z-50 overflow-hidden`}>
                    {(['ar', 'en', 'fa'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setLanguage(lang); setLangMenuOpen(false); }}
                        className={`w-full text-right ${lang === 'en' ? 'text-left' : ''} px-4 py-3 text-sm font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors ${language === lang ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/40' : 'text-slate-600 dark:text-slate-400'}`}
                      >
                        {translations[lang].lang_name}
                      </button>
                    ))}
                  </div>
                )}
             </div>

             <div className="bg-white dark:bg-slate-900 shadow-xl border border-indigo-50 dark:border-indigo-950 px-6 py-3 rounded-[24px] flex items-center gap-3"><Coins className="text-amber-500" size={24} /><span className="font-black text-xl">{user.points}</span></div>
             
             <div className="relative">
               <button 
                 onClick={() => setNotifCenterOpen(!notifCenterOpen)}
                 className="p-3 bg-white dark:bg-slate-900 border border-indigo-50 dark:border-indigo-950 rounded-2xl relative shadow-md text-indigo-600 hover:scale-105 transition-all"
               >
                 <Bell size={24} />
                 {unreadNotifs > 0 && <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>}
               </button>
               {notifCenterOpen && (
                 <NotificationCenter 
                    notifications={notifications} 
                    onClose={() => setNotifCenterOpen(false)}
                    onMarkRead={handleMarkRead}
                    onClearAll={handleClearAll}
                    language={language}
                 />
               )}
             </div>
          </div>
        </header>

        {notifCenterOpen && (
          <div className="lg:hidden absolute top-20 left-4 right-4 z-[60]">
             <NotificationCenter 
                notifications={notifications} 
                onClose={() => setNotifCenterOpen(false)}
                onMarkRead={handleMarkRead}
                onClearAll={handleClearAll}
                language={language}
             />
          </div>
        )}

        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
      {(sidebarOpen || (notifCenterOpen && window.innerWidth < 1024)) && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40" onClick={() => { setSidebarOpen(false); setNotifCenterOpen(false); }} />
      )}
    </div>
  );
};

export default App;

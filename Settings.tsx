
import React from 'react';
// Import Settings as SettingsIcon to fix "Cannot find name 'SettingsIcon'" error
import { Moon, Sun, Monitor, Bell, Shield, Smartphone, Globe, Settings as SettingsIcon } from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-24 lg:pb-0">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">الإعدادات</h2>
        <p className="text-slate-500">تحكم في مظهر وتجربة التطبيق الخاصة بك.</p>
      </div>

      <div className="space-y-6">
        {/* المظهر */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
              <Monitor size={24} />
            </div>
            <h3 className="text-xl font-bold">المظهر</h3>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-indigo-100 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-amber-500 shadow-sm'}`}>
                {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
              </div>
              <div>
                <p className="font-bold">الوضع الليلي</p>
                <p className="text-xs text-slate-500">{isDarkMode ? 'مفعل الآن' : 'غير مفعل'}</p>
              </div>
            </div>

            <button 
              onClick={toggleDarkMode}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isDarkMode ? '-translate-x-1' : '-translate-x-7'}`}
              />
            </button>
          </div>
        </div>

        {/* التفضيلات الأخرى (تخطيط صوري) */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
              <SettingsIcon size={24} />
            </div>
            <h3 className="text-xl font-bold">تفضيلات الحساب</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center">
                  <Bell size={24} />
                </div>
                <div>
                  <p className="font-bold">الإشعارات</p>
                  <p className="text-xs text-slate-500">إدارة تنبيهات النظام والطلبات</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full font-bold">قريباً</span>
            </div>

            <div className="flex items-center justify-between p-4 opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="font-bold">الأمان والخصوصية</p>
                  <p className="text-xs text-slate-500">تغيير كلمة المرور والتحقق</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full font-bold">قريباً</span>
            </div>

            <div className="flex items-center justify-between p-4 opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="font-bold">اللغة</p>
                  <p className="text-xs text-slate-500">العربية (الافتراضية)</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full font-bold">قريباً</span>
            </div>
          </div>
        </div>

        {/* معلومات الإصدار */}
        <div className="text-center py-6">
          <p className="text-[10px] font-black text-slate-300 dark:text-slate-800 uppercase tracking-widest">
            Falo Iraq Premium Edition <br />
            Version 5.0.2 Build 882
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;


import React from 'react';
import { Bell, X, Package, SendHorizontal, Gift, Info, Check } from 'lucide-react';
// Correct import source for Language type
import { AppNotification } from '../types';
import { translations, Language } from '../translations';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  language: Language;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  notifications, 
  onClose, 
  onMarkRead, 
  onClearAll,
  language 
}) => {
  const t = translations[language];
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'ORDER': return <Package size={18} className="text-blue-500" />;
      case 'TRANSFER': return <SendHorizontal size={18} className="text-purple-500" />;
      case 'GIFT': return <Gift size={18} className="text-amber-500" />;
      case 'ANNOUNCEMENT': return <Info size={18} className="text-indigo-500" />;
      default: return <Bell size={18} className="text-slate-500" />;
    }
  };

  return (
    <div className="absolute top-16 left-0 md:left-auto md:right-0 w-[calc(100vw-2rem)] md:w-96 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-indigo-50 dark:border-indigo-900 z-[100] flex flex-col max-h-[500px] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="p-6 border-b border-indigo-50 dark:border-indigo-950 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-lg">{language === 'ar' ? 'الإشعارات' : (language === 'fa' ? 'اعلان‌ها' : 'Notifications')}</h3>
          {unreadCount > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button 
              onClick={onClearAll}
              className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
            >
              {language === 'ar' ? 'مسح الكل' : (language === 'fa' ? 'حذف همه' : 'Clear All')}
            </button>
          )}
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto opacity-50">
              <Bell size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-400 text-sm font-bold">
              {language === 'ar' ? 'لا توجد إشعارات جديدة' : (language === 'fa' ? 'اعلان جدیدی وجود ندارد' : 'No new notifications')}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => onMarkRead(notif.id)}
                className={`group p-4 rounded-[24px] transition-all cursor-pointer relative overflow-hidden ${
                  notif.read ? 'opacity-60 grayscale-[0.5]' : 'bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/50 shadow-sm'
                } hover:bg-indigo-100/50 dark:hover:bg-indigo-900/20`}
              >
                {!notif.read && (
                  <div className="absolute top-0 right-0 w-1 h-full bg-indigo-600"></div>
                )}
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-black mb-0.5 truncate ${notif.read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(notif.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-IQ' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {notif.read && <Check size={12} className="text-emerald-500" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;

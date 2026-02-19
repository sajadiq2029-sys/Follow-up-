
import React, { useState } from 'react';
import { User } from '../types';
import { Search, Ban, Unlock, Edit3, Trash2, Coins } from 'lucide-react';

const AdminUsers: React.FC<{ users: User[]; setUsers: React.Dispatch<React.SetStateAction<User[]>> }> = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const toggleBan = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' };
      }
      return u;
    }));
  };

  const editPoints = (id: string, amount: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, points: u.points + amount };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => 
    u.name.includes(searchTerm) || u.username.includes(searchTerm) || u.email.includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">إدارة المستخدمين</h2>
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ابحث بالاسم أو اليوزر..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-white dark:bg-slate-900 border-none rounded-2xl pr-12 pl-4 py-3 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
                <th className="px-6 py-5 font-bold">المستخدم</th>
                <th className="px-6 py-5 font-bold">الحالة</th>
                <th className="px-6 py-5 font-bold">النقاط</th>
                <th className="px-6 py-5 font-bold">تاريخ الانضمام</th>
                <th className="px-6 py-5 font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-slate-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {user.status === 'ACTIVE' ? 'نشط' : 'محظور'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1 font-bold">
                      <Coins size={14} className="text-amber-500" />
                      {user.points.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500">
                    {new Date(user.joinedAt).toLocaleDateString('ar-IQ')}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleBan(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'
                        }`}
                        title={user.status === 'ACTIVE' ? 'حظر' : 'إلغاء الحظر'}
                      >
                        {user.status === 'ACTIVE' ? <Ban size={18} /> : <Unlock size={18} />}
                      </button>
                      <button 
                        onClick={() => editPoints(user.id, 500)}
                        className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        title="إضافة 500 نقطة"
                      >
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

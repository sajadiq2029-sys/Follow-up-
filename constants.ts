
import { Task, Service, Role, User, OrderStatus } from './types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'أحمد العراقي',
  username: 'ahmed_iq',
  email: 'ahmed@example.com',
  password: '123',
  points: 1250,
  role: Role.USER,
  status: 'ACTIVE',
  referralCode: 'IQ-7788',
  referralCount: 15,
  joinedAt: new Date().toISOString(),
  completedTasks: []
};

export const ADMIN_USER: User = {
  id: 'adm1',
  name: 'المطور الرئيسي',
  // ✳️ عدّل بيانات الأدمن إلى حسابك الرسمي (إيميل/يوزر/باسورد)

  username: 'admin',
  email: 'admin@faloiraq.com',
  password: 'admin',
  points: 999999999, // نقاط الأدمن (عملياً غير نهائية)

  role: Role.ADMIN,
  status: 'ACTIVE',
  referralCode: 'ADMIN',
  referralCount: 0,
  joinedAt: new Date().toISOString(),
  completedTasks: []
};

export const SERVICES: Service[] = [
  { id: 's1', name: 'متابعين إنستغرام', platform: 'Instagram', pricePerUnit: 9, minAmount: 100, icon: '📸' },
  { id: 's2', name: 'لايكات إنستغرام', platform: 'Instagram', pricePerUnit: 5, minAmount: 50, icon: '❤️' },
  { id: 's3', name: 'مشاهدات ريلز إنستغرام', platform: 'Instagram', pricePerUnit: 0.5, minAmount: 500, icon: '🎬' },
  { id: 's4', name: 'دعم وتواصل', platform: 'WhatsApp', pricePerUnit: 0, minAmount: 0, icon: '📞' },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', platform: 'INSTAGRAM', type: 'FOLLOW', reward: 3, description: 'متابعة حساب ahmed_official', link: '#' },
  { id: 't2', platform: 'INSTAGRAM', type: 'LIKE', reward: 1, description: 'إعجاب بآخر منشور على حساب مشهور عراقي', link: '#' },
  { id: 't3', platform: 'INSTAGRAM', type: 'VIEW', reward: 2, description: 'مشاهدة فيديو ريلز لمدة دقيقة', link: '#' },
  { id: 't4', platform: 'INSTAGRAM', type: 'FOLLOW', reward: 3, description: 'متابعة حساب falo_iraq_official', link: '#' },
];

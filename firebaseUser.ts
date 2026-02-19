import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import type { User } from './types';
import { Role } from './types';
import { db } from './firebase';
import { ADMIN_USER } from './constants';

type UserDoc = {
  name?: string;
  username?: string;
  email?: string;
  role?: Role;
  status?: 'ACTIVE' | 'BANNED' | 'COMPROMISED';
  points?: number;
  referralCode?: string;
  referralCount?: number;
  referredBy?: string;
  joinedAt?: string;
  completedTasks?: string[];
  usedGiftCodes?: string[];
};

// يحوّل Firestore doc إلى User داخل التطبيق
function normalizeUser(uid: string, email: string, data?: UserDoc): User {
  const nowIso = new Date().toISOString();
  const defaultName = email.split('@')[0] || 'User';
  const fallbackUsername = (data?.username || email.split('@')[0] || 'user').toLowerCase();
  const isAdminEmail = (email || '').toLowerCase() === (ADMIN_USER.email || '').toLowerCase();

  return {
    id: uid,
    name: data?.name || (isAdminEmail ? ADMIN_USER.name : defaultName),
    username: data?.username || (isAdminEmail ? ADMIN_USER.username : fallbackUsername),
    email,
    points: Number.isFinite(data?.points as any) ? (data?.points as number) : (isAdminEmail ? ADMIN_USER.points : 0),
    role: (data?.role as Role) || (isAdminEmail ? Role.ADMIN : Role.USER),
    status: data?.status || 'ACTIVE',
    referralCode: data?.referralCode || Math.random().toString(36).slice(2, 10).toUpperCase(),
    referralCount: data?.referralCount ?? 0,
    referredBy: data?.referredBy,
    joinedAt: data?.joinedAt || nowIso,
    completedTasks: data?.completedTasks || [],
    usedGiftCodes: data?.usedGiftCodes || []
  };
}

/**
 * يجيب بروفايل المستخدم من Firestore.
 * إذا ما موجود، ينشأه تلقائياً.
 * وإذا كان إيميلك يطابق ADMIN_USER.email راح ينخزن role=ADMIN.
 */
export async function getOrCreateUserProfile(params: {
  uid: string;
  email: string;
}): Promise<User> {
  const { uid, email } = params;
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return normalizeUser(uid, email, snap.data() as UserDoc);
  }

  const isAdminEmail = (email || '').toLowerCase() === (ADMIN_USER.email || '').toLowerCase();
  const initial: UserDoc = {
    name: isAdminEmail ? ADMIN_USER.name : (email.split('@')[0] || 'User'),
    username: isAdminEmail ? ADMIN_USER.username : (email.split('@')[0] || 'user'),
    email,
    role: isAdminEmail ? Role.ADMIN : Role.USER,
    status: 'ACTIVE',
    points: isAdminEmail ? ADMIN_USER.points : 0,
    referralCode: Math.random().toString(36).slice(2, 10).toUpperCase(),
    referralCount: 0,
    joinedAt: new Date().toISOString()
  };

  await setDoc(ref, {
    ...initial,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return normalizeUser(uid, email, initial);
}

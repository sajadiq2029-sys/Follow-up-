
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'TRANSFER' | 'GIFT' | 'ANNOUNCEMENT';
  read: boolean;
  createdAt: string;
}

export interface GiftCode {
  id: string;
  code: string;
  reward: number;
  expiresAt: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  points: number;
  role: Role;
  status: 'ACTIVE' | 'BANNED' | 'COMPROMISED';
  referralCode: string;
  referralCount: number;
  referredBy?: string;
  joinedAt: string;
  completedTasks?: string[];
  usedGiftCodes?: string[];
}

export interface Task {
  id: string;
  platform: 'INSTAGRAM' | 'TIKTOK' | 'FACEBOOK' | 'YOUTUBE';
  type: 'FOLLOW' | 'LIKE' | 'VIEW';
  reward: number;
  description: string;
  link: string;
}

export interface Service {
  id: string;
  name: string;
  platform: string;
  pricePerUnit: number;
  minAmount: number;
  icon: string;
}

export interface Order {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  targetUsername: string;
  amount: number;
  totalCost: number;
  status: OrderStatus;
  createdAt: string;
}

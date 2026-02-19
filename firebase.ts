import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Web config (from Firebase Console)
// ملاحظة: هذا الإعداد عادي يكون “public” للويب.
const firebaseConfig = {
  apiKey: 'AIzaSyB6vyW4ktiYgXdq6h9IIHPdzJ3Xnsqi0Pg',
  authDomain: 'follow-48bde.firebaseapp.com',
  projectId: 'follow-48bde',
  storageBucket: 'follow-48bde.firebasestorage.app',
  messagingSenderId: '141827005248',
  appId: '1:141827005248:web:af7ecb0a58d3999a77b8a5',
  measurementId: 'G-G1567K32YL'
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

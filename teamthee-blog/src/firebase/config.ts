import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAujnfkJ86SqsRWF1XyHF5nbFGGyHKznOw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "teamthee-blog.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "teamthee-blog",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "teamthee-blog.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "221243694155",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:221243694155:web:6e9b09683c90c2d36581ce"
};

let app;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isFirebaseConfigured = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseConfigured = true;
  }
} catch (err) {
  console.warn("Firebase initialization skipped or error:", err);
  isFirebaseConfigured = false;
}

export { db, auth, isFirebaseConfigured, firebaseConfig };


import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAGgVgT56sodcg6WpOEqwTTz2qN1sCSD9Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "teamthee-portal.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "teamthee-portal",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "teamthee-portal.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1087869882052",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1087869882052:web:d31fc9bb21ddd0ed59c391"
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


import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "pro-victor-55xj8",
  appId: "1:41574623467:web:e8fcf4ba582044baa1b6ae",
  apiKey: "AIzaSyAU1ly8mGrXBNg7tAKZFWFwqaWlgxk0uIs",
  authDomain: "pro-victor-55xj8.firebaseapp.com",
  storageBucket: "pro-victor-55xj8.firebasestorage.app",
  messagingSenderId: "41574623467",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

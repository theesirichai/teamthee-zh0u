import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBpMRG60_m2INYojJwSZWt1aEbdcGbMCs8",
  authDomain: "teamthee-todoflow.firebaseapp.com",
  projectId: "teamthee-todoflow",
  storageBucket: "teamthee-todoflow.firebasestorage.app",
  messagingSenderId: "8206784532",
  appId: "1:8206784532:web:0c57cfce047934256b6f01",
  measurementId: "G-SZVKEQKQ24"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

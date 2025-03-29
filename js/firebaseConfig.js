// ✅ firebaseConfig.js (Includes Firestore + Auth)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY1zNPbPtrXbXpOTXjp45xwEv97pqK88I",
  authDomain: "moonbow-1.firebaseapp.com",
  projectId: "moonbow-1",
  storageBucket: "moonbow-1.firebasestorage.app",
  messagingSenderId: "857153315917",
  appId: "1:857153315917:web:91cfab2128c8c16119e804",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app); // 👈 Export  Auth

console.log("🔥 Firebase & Auth initialized.");

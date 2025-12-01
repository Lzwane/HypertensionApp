import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // <--- Simpler import

// ⚠️ REPLACE WITH YOUR KEYS
const firebaseConfig = {
  apiKey: "AIzaSyAeu03l2JkCGwlj06L6dUJFFulXv8Y9OwY",
  authDomain: "hypertensionapp-a4e74.firebaseapp.com",
  projectId: "hypertensionapp-a4e74",
  storageBucket: "hypertensionapp-a4e74.firebasestorage.app",
  messagingSenderId: "660696401748",
  appId: "1:660696401748:web:8de2bf80bcdcf2e79ceac1",
  measurementId: "G-HPDK6LY2YT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth (Simple version that usually auto-detects React Native)
export const auth = getAuth(app);

// Initialize Database
export const db = getFirestore(app);

export default app;
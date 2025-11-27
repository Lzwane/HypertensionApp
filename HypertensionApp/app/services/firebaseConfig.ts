import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Uncomment if you add Login later

// REPLACE THESE WITH YOUR REAL FIREBASE KEYS FROM CONSOLE.FIREBASE.GOOGLE.COM
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const auth = getAuth(app);
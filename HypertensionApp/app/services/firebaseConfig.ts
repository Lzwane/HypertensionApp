// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
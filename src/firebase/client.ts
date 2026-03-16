import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwqUsmOAGuuoF64yZYkCW3b4Maq8zMGY0",
  authDomain: "prepwise-32c9e.firebaseapp.com",
  projectId: "prepwise-32c9e",
  storageBucket: "prepwise-32c9e.firebasestorage.app",
  messagingSenderId: "717345167373",
  appId: "1:717345167373:web:eefc28e04d033e0c4ddd44",
  measurementId: "G-SSPHXQZ8S5",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

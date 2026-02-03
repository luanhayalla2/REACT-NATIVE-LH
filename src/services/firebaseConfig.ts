// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyA8HayUhjEF72jpirSTA5jRYJdyU-hOBW4",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "crud-react-native-168d4.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "crud-react-native-168d4",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "crud-react-native-168d4.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "89323872259",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:89323872259:web:16d44f54e9c58f96c6ae36",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-05CR9VR9L5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services commonly used in React Native
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
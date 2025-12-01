// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF3r3w-SJ-OhM-uKjpNi519aDM6urTnic",
  authDomain: "sih2025-3b28a.firebaseapp.com",
  projectId: "sih2025-3b28a",
  storageBucket: "sih2025-3b28a.firebasestorage.app",
  messagingSenderId: "659600024672",
  appId: "1:659600024672:web:33b645879fc7ca34724f05",
  measurementId: "G-4BGM95TRVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Create Google Auth Provider with proper settings
export const googleProvider = new GoogleAuthProvider();
// Set up Google provider parameters for better user experience
googleProvider.setCustomParameters({
  prompt: 'select_account' // This ensures users can choose which Google account to use
});

export default app;
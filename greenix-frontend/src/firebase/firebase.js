// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLvKbE3xz8iRjV1j4n3t2f9ftfi6IwyhQ",
  authDomain: "greenix-app.firebaseapp.com",
  projectId: "greenix-app",
  storageBucket: "greenix-app.firebasestorage.app",
  messagingSenderId: "1035880235698",
  appId: "1:1035880235698:web:9bbac13ca2d3648ebfbfab",
  measurementId: "G-860G59HSFK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth=getAuth(app);
export const db= new Firestore(app);
export default app;
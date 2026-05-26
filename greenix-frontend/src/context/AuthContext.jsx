import {
  createContext,
  useContext,
  useState
} from "react";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {

  const [error, setError] = useState("");

  const clearError = () => {
    setError("");
  };

  // EMAIL SIGNUP
  const signup = async (
    email,
    password,
    name
  ) => {

    // Create account in Firebase Auth
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "user",
      streak: 0,
      level: 1,
      createdAt: new Date()
    });

    return user;
  };

  // GOOGLE LOGIN
  const signInWithGoogle = async () => {

    const provider = new GoogleAuthProvider();

    const result =
      await signInWithPopup(auth, provider);

    const user = result.user;

    // Save Google user in Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: user.displayName,
        email: user.email,
        role: "user",
        streak: 0,
        level: 1,
        createdAt: new Date()
      },
      { merge: true }
    );

    return user;
  };

  const value = {
    signup,
    signInWithGoogle,
    error,
    setError,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
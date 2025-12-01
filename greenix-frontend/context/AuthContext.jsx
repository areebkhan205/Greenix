// src/contexts/AuthContext.jsx
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes
} from "firebase/storage";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, googleProvider, storage } from "../firebase/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if username is available
  async function checkUsernameAvailability(username) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  }

  // Upload avatar to Firebase Storage
  async function uploadAvatar(file, userId) {
    if (!file) return null;
    
    const avatarRef = ref(storage, `avatars/${userId}/${file.name}`);
    const snapshot = await uploadBytes(avatarRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }

  // Save user profile to Firestore
  async function saveUserProfile(userId, profileData) {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      ...profileData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true });
  }

  // Load user profile from Firestore
  async function loadUserProfile(userId) {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }

  // Simple profile update without avatar complications
  async function updateUserProfile({ displayName, username }) {
    console.log("Simple updateUserProfile called with:", { displayName, username });
    
    if (!currentUser) {
      console.error("No user logged in");
      throw new Error("No user logged in");
    }

    try {
      // Update Firebase Auth profile (just the name)
      console.log("Updating Firebase Auth profile...");
      await updateProfile(currentUser, {
        displayName: displayName
      });
      
      // Create simple profile object for local state
      const profileData = {
        displayName,
        username: username || "",
        email: currentUser.email,
        updatedAt: new Date()
      };
      
      // Update local state
      setUserProfile(profileData);
      console.log("Simple profile setup completed:", profileData);
      
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  }

  // Sign up function
  function signup(email, password, name) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        // Update profile with name
        return updateProfile(result.user, {
          displayName: name
        });
      });
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Google sign in with better error handling
  async function signInWithGoogle() {
    try {
      console.log("Starting Google sign-in...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google sign-in successful:", result.user.email);
      return result;
    } catch (error) {
      console.error("Google sign-in failed:", error);
      
      // Handle specific errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error("Sign-in was cancelled. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error("Pop-up was blocked by browser. Please allow pop-ups and try again.");
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error("This domain is not authorized for Google sign-in. Please contact support.");
      } else {
        throw new Error(`Google sign-in failed: ${error.message}`);
      }
    }
  }

  // Clear error
  function clearError() {
    setError("");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Create a simple profile from Firebase Auth data
        const basicProfile = {
          displayName: user.displayName,
          username: "", // Will be updated if user completes profile setup
          email: user.email,
          updatedAt: new Date()
        };
        
        setUserProfile(basicProfile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfile,
    checkUsernameAvailability,
    error,
    setError,
    clearError,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
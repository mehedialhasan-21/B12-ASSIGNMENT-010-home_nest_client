// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";
import axios from "axios";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register with email/password
  const register = async (name, email, password, photoURL) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name, photoURL });
    // Save user to DB
    await axios.post(`${API_URL}/api/users`, { name, email, photoURL });
    return result;
  };

  // Login with email/password
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Google login
  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL } = result.user;
    await axios.post(`${API_URL}/api/users`, {
      name: displayName,
      email,
      photoURL,
    });
    return result;
  };

  // Update profile
  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) throw new Error("No user logged in.");
    await updateProfile(auth.currentUser, { displayName: name, photoURL });
    setUser({ ...auth.currentUser });
    await axios.post(`${API_URL}/api/users`, {
      name,
      email: auth.currentUser.email,
      photoURL,
    });
  };

  // Logout
  const logout = async () => {
    await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
    return signOut(auth);
  };

  // Issue JWT on login/register
  const issueToken = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      await axios.post(
        `${API_URL}/api/auth/token`,
        {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          uid: firebaseUser.uid,
          picture: firebaseUser.photoURL,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Token issue error:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await issueToken(currentUser);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, googleLogin, logout, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

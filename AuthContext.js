import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {        
        axios
          .get(
            `https://backend-for-trippy.onrender.com/api/users/email/${currentUser.email}`
          )
          .then((response) => {
            const userId = response.data.userId.user_id; 
            setUser({
              email: currentUser.email,
              uid: currentUser.uid,
              userId,
            });
          })
          .catch((error) => {
            console.error("Error fetching user ID:", error);
            setUser({
              email: currentUser.email,
              uid: currentUser.uid,
              userId: null,
            });
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

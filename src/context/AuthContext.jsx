"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("tech-user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return typeof window !== "undefined"
      ? localStorage.getItem("tech-token")
      : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("tech-token", token);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

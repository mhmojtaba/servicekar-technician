"use client";

import { settings_main } from "@/services/authServices";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isSecretary, setIsSecretary] = useState(false);

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
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
      checkIsSecretary();
    }
  }, [token]);

  const checkIsSecretary = async () => {
    try {
      const { data: response } = await settings_main(token);
      setIsSecretary(response?.is_monshi == 1 ? true : false);
    } catch (error) {
      console.error("خطایی در دریافت اطلاعات رخ داده است:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, setToken, isSecretary, setIsSecretary }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

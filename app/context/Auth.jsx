"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false); // Inisialisasi dengan false
  const [isLocalStorageUpdated, setIsLocalStorageUpdated] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") { // pastikan kita di sisi klien
      const checkIsUserLogin = localStorage.getItem("auth") ? true : false;
      setIsAuth(checkIsUserLogin);
    }
  }, []);

  return <AuthContext.Provider value={{ isAuth, setIsAuth, isLocalStorageUpdated, setIsLocalStorageUpdated }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

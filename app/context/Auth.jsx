"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  useEffect(() => {
    const isInClient = () => {
      return typeof window !== "undefined" ? true : false;
    }

    const checkIsUserLogin = isInClient() ? localStorage.getItem("auth") ? true : false : false;

    setIsAuth(checkIsUserLogin)
  },[])


  const [isAuth, setIsAuth] = useState(null);

  // const [isAuth, setIsAuth] = useState(checkIsUserLogin ? true : false);

  const [isLocalStorageUpdated, setIsLocalStorageUpdated] = useState(0);

  return <AuthContext.Provider value={{ isAuth, setIsAuth, isLocalStorageUpdated, setIsLocalStorageUpdated }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

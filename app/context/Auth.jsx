"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  // const checkIsUserLogin = typeof window !== "undefined" ? window.localStorage.getItem('access') : false

  // const checkIsUserLogin = typeof window !== "undefined" ? window.localStorage.getItem('auth') : false;

  // const [isAuth, setIsAuth] = useState(false);

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


  // const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  // const { uid, username, profilePicture, email, store } = JSON.parse(localStorage.getItem("auth"));
  // const [userInfo, setUserInfo] = useState({
  //   uid,username,profilePicture,email,store
  // })

  return <AuthContext.Provider value={{ isAuth, setIsAuth, isLocalStorageUpdated, setIsLocalStorageUpdated }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

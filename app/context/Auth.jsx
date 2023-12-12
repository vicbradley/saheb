"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const checkIsUserLogin = localStorage.getItem("auth") ? true : false;

  const [isAuth, setIsAuth] = useState(checkIsUserLogin);

  const [isLocalStorageUpdated, setIsLocalStorageUpdated] = useState(0);


  // const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  // const { uid, username, profilePicture, email, store } = JSON.parse(localStorage.getItem("auth"));
  // const [userInfo, setUserInfo] = useState({
  //   uid,username,profilePicture,email,store
  // })

  return <AuthContext.Provider value={{ isAuth, setIsAuth, isLocalStorageUpdated, setIsLocalStorageUpdated }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

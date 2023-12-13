"use client";
import { createContext, useContext, useState } from "react";

const MessageContext = createContext({});

export const MessageContextProvider = ({ children }) => {

  const [chatRoomsData, setChatRoomsData] = useState(null);

  const [isChatRoomsDataReady, setIsChatRoomsDataReady] = useState(false);

  const [unreadMsgCount, setUnreadMsgCount] = useState(null);

  const [isChatExpired, setIsChatExpired] = useState(false);



  return <MessageContext.Provider value={{ chatRoomsData, setChatRoomsData, unreadMsgCount, setUnreadMsgCount, isChatRoomsDataReady, setIsChatRoomsDataReady, isChatExpired, setIsChatExpired }}>{children}</MessageContext.Provider>;
};

export const useMessageContext = () => useContext(MessageContext);

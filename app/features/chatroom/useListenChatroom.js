import { getUserInfo } from "@/app/logic/getUserInfo";
import { useState, useEffect } from "react";
import openSocket from "socket.io-client";

const useListenChatroom = (chatroomId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { uid } = getUserInfo();

  const encodedType = encodeURIComponent("chatroom messages");

  useEffect(() => {
    console.log("start");
    const socket = openSocket(`http://localhost:5000?type=${encodedType}&chatroomId=${chatroomId}&mainUserId=${uid}`, { transports: ["websocket"] });

    socket.on("messages", (data) => {
      setMessages(data);
      setIsLoading(false);
    });

    socket.on("error", (error) => {
      setError(error);
      setIsLoading(false);
    });

    console.log("exit");
    // Cleanup function to disconnect on unmount
    return () => socket.disconnect();
  }, []);

  return {
    data: messages,
    isLoading,
    error,
  };
};

export default useListenChatroom;

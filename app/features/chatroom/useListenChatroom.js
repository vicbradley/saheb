import { getUserInfo } from "@/app/logic/getUserInfo";
import { useState, useEffect } from "react";
import {  onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/src/firebase/config";

const useListenChatroom = (chatroomId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chatrooms", chatroomId), async (document) => {
      if (document.data().messages.length < 1) {
        return;
      }

      const messagesFromDb = document.data().messages;

      messagesFromDb.forEach((msg) => {
        if (msg.senderId !== getUserInfo().uid && msg.isRead === false) {
          msg.isRead = true;
        }
      });

      const docRef = doc(db, "chatrooms", chatroomId);
      await updateDoc(docRef, {
        messages: messagesFromDb,
      });

      setMessages(messagesFromDb);
    });

    setIsLoading(false);

    return () => unsub();
  }, []);

  // const encodedType = encodeURIComponent("chatroom messages");

  // useEffect(() => {
  //   console.log("start");
  //   const socket = openSocket(`http://localhost:5000?type=${encodedType}&chatroomId=${chatroomId}&mainUserId=${uid}`, { transports: ["websocket"] });

  //   socket.on("messages", (data) => {
  //     setMessages(data);
  //     setIsLoading(false);
  //   });

  //   socket.on("error", (error) => {
  //     setError(error);
  //     setIsLoading(false);
  //   });

  //   console.log("exit");
  //   // Cleanup function to disconnect on unmount
  //   return () => socket.disconnect();
  // }, []);

  return {
    data: messages,
    isLoading,
    error,
  };
};

export default useListenChatroom;

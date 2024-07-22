// useListenChatroom.js
import { getUserInfo } from "@/app/logic/getUserInfo";
import { useState, useEffect, useRef } from "react";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { decryptMessage } from "@/app/logic/decryptMsg";

const useListenChatroom = (chatroomId, setMessages, setIsMessagesLoading) => {
  
  const prevMessagesRef = useRef([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chatrooms", chatroomId), async (document) => {
      if (!document.exists()) {
        setIsMessagesLoading(false);
        return;
      }

      const messagesFromDb = document.data().messages;

      messagesFromDb.forEach((msg) => {
        if (msg.senderId !== getUserInfo().uid && msg.isRead === false) {
          msg.isRead = true;
        }


        const decryptionStart = performance.now();
        const decryptedText = decryptMessage(process.env.NEXT_PUBLIC_RJ4_KEY, msg.text);
        console.log({decryptedText});
        const decryptionEnd = performance.now();
        const decryptionTime = decryptionEnd - decryptionStart;
        console.log({decryptionTime});

      });

      const docRef = doc(db, "chatrooms", chatroomId);
      await updateDoc(docRef, {
        messages: messagesFromDb,
      });

      if (JSON.stringify(prevMessagesRef.current) !== JSON.stringify(messagesFromDb)) {
        prevMessagesRef.current = messagesFromDb;
      }

      setMessages(messagesFromDb);
      setIsMessagesLoading(false);
    });

    return () => unsub();
  }, []);

  // return {
  //   data: messages,
  //   isLoading,
  //   error,
  // };
};

export default useListenChatroom;

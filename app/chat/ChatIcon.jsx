"use client";
import { getUserInfo } from "../logic/getUserInfo";
import { useEffect } from "react";
import { db } from "@/src/firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuthContext } from "../context/Auth";
import { useMessageContext } from "../context/Message";

const ChatIcon = () => {
  const { setChatRoomsData, setIsChatRoomsDataReady, unreadMsgCount, setUnreadMsgCount } = useMessageContext();

  const { isAuth, isLocalStorageUpdated } = useAuthContext();


  // useEffect(() => {
  //   if (!isAuth) return;
    
  //   console.log("start");
  //   const socket = openSocket(`http://localhost:5000?type=${encodedType}&uid=${uid}`, { transports: ["websocket"] });

  //   socket.on("chatrooms data", (data) => {
  //     setChatRoomsData(data.chatroomsData);
  //     setUnreadMsgCount(data.unreadMessageCount);
  //     setIsChatRoomsDataReady(true);
  //   });

  //   socket.on("error", (error) => {
  //     setError(error);
  //     setIsChatRoomsDataReady(true);
  //   });

  //   console.log("exit");
  //   // Cleanup function to disconnect on unmount
  //   return () => socket.disconnect();
  // }, [isAuth, isLocalStorageUpdated, ]);

  useEffect(() => {
  if (!isAuth) return;

  const { uid, username, profilePicture } = getUserInfo();

  const q = query(collection(db, "chatrooms"), where("participants", "array-contains", { uid, profilePicture, username }));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let chatRoomsDatatemp = [];
    let unreadMsgCountTemp = 0;

    querySnapshot.forEach((doc) => {
      const {participants, messages} = doc.data();

      const participant = participants.filter((participant) => participant.uid !== uid);

      if (messages.length < 1) {
        chatRoomsDatatemp.push({
          id: doc.id,
          username: participant[0].username,
          profilePicture: participant[0].profilePicture,
          unreadMsg: 0,
          latestMsg: "",
        });
      } else {
        const unreadMsg = messages.filter((msg) => {
          return msg.senderId !== getUserInfo().uid && msg.isRead === false;
        }).length;

        const latestMsg = messages[messages.length - 1].text;

        unreadMsgCountTemp += unreadMsg;

        chatRoomsDatatemp.push({
          id: doc.id,
          username: participant[0].username,
          profilePicture: participant[0].profilePicture,
          unreadMsg,
          latestMsg,
        });
      }
    });

    setChatRoomsData(chatRoomsDatatemp);
    setUnreadMsgCount(unreadMsgCountTemp);
    setIsChatRoomsDataReady(true);
  });

  return () => unsubscribe();
  }, [isAuth, isLocalStorageUpdated]);

  return (
    <>
      <label tabIndex={0} className="btn btn-ghost btn-circle mt-1">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-left-dots" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
          <span className="badge badge-sm indicator-item">{isAuth ? unreadMsgCount : 0}</span>
        </div>
      </label>
    </>
  );
};

export default ChatIcon;

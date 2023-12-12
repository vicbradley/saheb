"use client";
import { getUserInfo } from "../logic/getUserInfo";
import { useEffect, useState } from "react";
import { db } from "@/src/firebase/config";
import { collection, getDocs, getDoc, doc, onSnapshot, query, where, collectionGroup } from "firebase/firestore";
import Loading from "../components/Loading";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/Auth";
import { useMessageContext } from "../context/Message";

const ChatIcon = () => {
  const { setChatRoomsData, setIsChatRoomsDataReady, unreadMsgCount, setUnreadMsgCount } = useMessageContext();

  const { uid, username, profilePicture } = getUserInfo();

  const { isAuth, isLocalStorageUpdated } = useAuthContext();

  useEffect(() => {
    if (!isAuth) return;

    const q = query(collection(db, "chatrooms"), where("participants", "array-contains", { uid: uid, profilePicture, username }));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let chatRoomsDatatemp = [];
      let unreadMsgCountTemp = 0;

      querySnapshot.forEach((doc) => {
        const participant = doc.data().participants.filter((participant) => participant.uid !== uid);

        if (doc.data().messages.length < 1) {
          chatRoomsDatatemp.push({
            id: doc.id,
            username: participant[0].username,
            profilePicture: participant[0].profilePicture,
            unreadMsg: 0,
            latestMsg: "",
          });
        } else {
          const unreadMsg = doc.data().messages.filter((msg) => {
            return msg.senderId !== getUserInfo().uid && msg.isRead === false;
          }).length;

          const latestMsg = doc.data().messages[doc.data().messages.length - 1].text;

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

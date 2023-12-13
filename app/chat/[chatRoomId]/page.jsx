"use client";
import { useEffect, useState, useRef } from "react";
import ChatNavbar from "./ChatNavbar";
import { db } from "@/src/firebase/config";
import { doc, updateDoc, arrayUnion, onSnapshot, getDoc } from "firebase/firestore";
import { getUserInfo } from "@/app/logic/getUserInfo";
import Loading from "@/app/components/Loading";
import date from "date-and-time";
import UploadImage from "./UploadImage";
import ConsultBtn from "@/app/consult/ConsultBtn";

const Chatroom = ({ params }) => {
  const chatRoomId = params.chatRoomId;
  const [isDataReady, setIsDataReady] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatExpired, setIsChatExpired] = useState(false);
  const [isOtherUserDataReady, setIsOtherUserDataReady] = useState(false);
  const [otherUserData, setOtherUserData] = useState(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isThereANewMessage, setIsThereANewMessage] = useState(false);

  const messageContainerRef = useRef(null);

  // Mengatur isKeyboardOpen saat input mendapatkan fokus
  const handleInputFocus = () => {
    setIsKeyboardOpen(true);
  };

  // Mengatur isKeyboardOpen saat input kehilangan fokus
  const handleInputBlur = () => {
    setIsKeyboardOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (newMessage === "") return;

    if (isChatExpired) return;

    const now = new Date();

    // Create a copy of the updated messageObject
    const newMessageObj = {
      senderId: getUserInfo().uid,
      senderDisplayName: getUserInfo().username,
      createdAt: date.format(now, "HH:mm:ss"),
      text: newMessage,
      isRead: false,
    };

    const chatRoomRef = doc(db, "chatrooms", params.chatRoomId);

    await updateDoc(chatRoomRef, {
      messages: arrayUnion(newMessageObj),
    });

    setIsThereANewMessage(true);

    setNewMessage("");
  };

  const changeChatExpiredState = () => {
    setIsChatExpired(true);
  };

  const isImageLink = (text) => {
    if (text.startsWith("https://firebasestorage.googleapis.com/")) return true;
  };

  const getConsultantData = async () => {
    const chatRoomRef = doc(db, "chatrooms", chatRoomId);
    const chatRoomSnap = await getDoc(chatRoomRef);

    const chatExpired = chatRoomSnap.data().chatExpired;

    const otherParticipants = chatRoomSnap.data().participants.filter((participant) => getUserInfo().uid !== participant.uid)[0];

    const { uid, username, profilePicture } = otherParticipants;

    const otherUserRef = doc(db, "users", uid);
    const otherUserSnap = await getDoc(otherUserRef);

    setOtherUserData({
      otherUserId: uid,
      otherUsername: username,
      otherUserProfilePicture: profilePicture,
      chatExpired,
      pricing: otherUserSnap.data().isAConsultant ? otherUserSnap.data().consultantData.pricing : null,
    });

    setIsOtherUserDataReady(true);
  };

  const randomKey = (createdAt) => {
    const randomNumber = Math.floor(Math.random() * 98) + 1;
    return randomNumber + createdAt;
  };

  useEffect(() => {
    getConsultantData();

    const unsub = onSnapshot(doc(db, "chatrooms", chatRoomId), async (document) => {
      if (document.data().messages.length < 1) {
        console.log("salah");
        return;
      }

      const messagesFromDb = document.data().messages;

      messagesFromDb.forEach((msg) => {
        if (msg.senderId !== getUserInfo().uid && msg.isRead === false) {
          msg.isRead = true;
        }

        isImageLink(msg.text);
      });

      const docRef = doc(db, "chatrooms", chatRoomId);
      await updateDoc(docRef, {
        messages: messagesFromDb,
      });

      setMessages(messagesFromDb);
    });

    setIsDataReady(true);

    return () => unsub();
  }, []);

  useEffect(() => {
    if ((messageContainerRef.current && !isKeyboardOpen) || (messageContainerRef.current && isThereANewMessage)) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isKeyboardOpen]);

  if (!isDataReady || !isOtherUserDataReady) return <Loading />;

  return (
    <>
      <ChatNavbar otherUserData={otherUserData} changeChatExpiredState={changeChatExpiredState} />

      <div className="flex-1 px-2 border h-[78vh] lg:h-[75vh] overflow-y-auto" ref={messageContainerRef}>
        {messages.map((message) => (
          <div key={randomKey(message.createdAt)} className={`chat ${message.senderId === getUserInfo().uid ? "chat-end" : "chat-start"}`}>
            <div className="chat-bubble bg-base-300 text-slate-800 font-semibold mt-3 flex flex-col justify-center">
              {isImageLink(message.text) ? (
                <div className="w-[40vw] h-[40vh] lg:h-[65vh] ">
                  <img
                    src={message.text}
                    alt="Chat Image"
                    className="w-[100%] h-[100%] object-cover rounded"
                    // style={{ maxWidth: "100vw", maxHeight: "100vh", objectFit: "fill" }}
                  />
                </div>
              ) : (
                <div className="message-text mr-6" style={{ maxWidth: "40vw", wordBreak: "break-word" }}>
                  {message.text}
                </div>
              )}
              <span className="text-xs text-slate-500 font-thin flex justify-end">{message.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
      {/* 
      className={`p-2 ${isKeyboardOpen ? "translate-y-[-5px]" : ""} ${isThereANewMessage ? "translate-y-[-5px]" : ""} */}

      <form className="p-2 ${isKeyboardOpen ? 'translate-y-[-5px]' : ''} ${isThereANewMessage ? 'translate-y-[-5px]' : ''}  flex items-center justify-between" disabled>
        {/* upload image */}
        <UploadImage chatRoomId={chatRoomId} isChatExpired={isChatExpired} />

        {/* text input */}
        <input
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          type="text"
          placeholder={isChatExpired ? "Beli token untuk melanjutkan konsultasi" : "Type here"}
          className="input input-bordered w-[80%] lg:w-[90%] lg:ml-4"
          disabled={isChatExpired}
        />

        {/* button */}
        {isChatExpired && otherUserData.pricing ? (
          <ConsultBtn isInChatRoom={true} otherUserData={otherUserData} chatRoomId={chatRoomId} />
        ) : (
          <button onClick={onSubmit} className="btn btn-md btn-accent text-base-100 ml-3 lg:ml-5" disabled={isChatExpired}>
            Send
          </button>
        )}
      </form>
    </>
  );
};

export default Chatroom;

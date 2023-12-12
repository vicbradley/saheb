"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/Auth";
import ChatNavbar from "./ChatNavbar";
import { db } from "@/src/firebase/config";
import { doc, updateDoc, arrayUnion, onSnapshot, getDoc } from "firebase/firestore";
import { getUserInfo } from "@/app/logic/getUserInfo";
import Loading from "@/app/components/Loading";
import date from "date-and-time";
import { useMessageContext } from "@/app/context/Message";
import UploadImage from "./UploadImage";
import ConsultBtn from "@/app/consult/ConsultBtn";

const Chatroom = ({ params }) => {
  const chatRoomId = params.chatRoomId;
  // const {isChatRoomExtended, setIsChatRoomExtended, isChatExpired, setIsChatExpired} = useMessageContext();
  const [isDataReady, setIsDataReady] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatExpired, setIsChatExpired] = useState(false);
  const [isOtherUserDataReady, setIsOtherUserDataReady] = useState(false);
  const [consultantData, setConsultantData] = useState(null);
  const [otherUserData, setOtherUserData] = useState(null);
  // const [isAConsultant, setIsAConsultant] = useState(null);

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

    setNewMessage("");
  };

  const changeChatExpiredState = () => {
    setIsChatExpired(true);
    // setIsChatRoomExtended(false);
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

    // console.log(other);

    // console.log("is a consultant : " + otherUserSnap.data().isAConsultant);
    // console.log("pricing : " + otherUserSnap.data().pricing);

    setOtherUserData({
      otherUserId: uid,
      otherUsername: username,
      otherUserProfilePicture: profilePicture,
      chatExpired,
      pricing: otherUserSnap.data().isAConsultant ? otherUserSnap.data().consultantData.pricing : null
    })


    // if (otherUserSnap.data().isAConsultant) {
    //   setOtherUserData({
    //     consultantId: uid,
    //     consultantUsername: username,
    //     consultantProfilePicture: profilePicture,
    //     pricing: otherUserSnap.data().consultantData.pricing,
    //     chatExpired,
    //   });

    //   setIsAnConsultant(true);
    // } else {
    //   setOtherUserData({
    //     uid,
    //     username,
    //     profilePicture,
    //     chatExpired,
    //   });

    //   setIsAnConsultant(false);
    // }

    setIsOtherUserDataReady(true);

    // const consultantRef = doc(db, "users", uid);
    // const consultantSnap = await getDoc(consultantRef);
    // const pricing = consultantSnap.data().consultantData.pricing;

    // setConsultantData({
    //   consultantId: uid,
    //   consultantUsername: username,
    //   consultantProfilePicture: profilePicture,
    //   pricing,
    //   chatExpired
    // });

    // setIsOtherUserDataReady(true);

    // setParticipantData({
    //   username,
    //   profilePicture,
    //   chatExpired: chatRoomSnap.data().chatExpired
    // });
    // setIsDataReady(true);

    // return {uid, username, profilePicture, pricing};
  };

  const test = (e) => {
    e.preventDefault();

    console.log(otherUserData);
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

      // console.log("masuk");

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
      // setIsChatExpired(false);
    });

    setIsDataReady(true);

    return () => unsub();
  }, []);

  // const test = async (e) => {
  //   e.preventDefault();
  //   console.log((await handleConsultBtn()).username);
  // }

  if (!isDataReady || !isOtherUserDataReady) return <Loading />;

  return (
    <>
      {/* <ChatNavbar chatRoomId={params.chatRoomId} changeChatExpiredState={changeChatExpiredState} /> */}
      <ChatNavbar otherUserData={otherUserData} changeChatExpiredState={changeChatExpiredState} />
      {/* <button onClick={() => console.log(consultantData)}>test</button> */}

      <div className="flex-1 px-2 border h-[78vh] lg:h-[75vh] overflow-y-auto">
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

      <form className="p-2 flex items-center justify-between" disabled>
        {/* upload image */}
        <UploadImage chatRoomId={chatRoomId} isChatExpired={isChatExpired} />

        {/* text input */}
        <input
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          type="text"
          placeholder={isChatExpired ? "Beli token untuk melanjutkan konsultasi" : "Type here"}
          className="input input-bordered w-[80%] lg:w-[90%] lg:ml-4"
          disabled={isChatExpired}
        />

        {/* <button onClick={alert(otherUserData.pricing)}>tets</button> */}

        {/* button */}
        {isChatExpired && otherUserData.pricing ? (
          // <ConsultBtn isInChatRoom={true} consultantData={consultantData} chatRoomId={chatRoomId} />
          <ConsultBtn isInChatRoom={true} otherUserData={otherUserData} chatRoomId={chatRoomId} />
        ) : (
          // <button onClick={() => console.log(handleConsultBtn())}>test</button>
          <button onClick={onSubmit} className="btn btn-md btn-accent text-base-100 ml-3 lg:ml-5" disabled={isChatExpired}>
            Send
          </button>
        )}
      </form>
    </>

    // <button onClick={test}>Test</button>
  );
};

export default Chatroom;

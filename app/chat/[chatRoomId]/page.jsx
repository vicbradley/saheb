"use client";
import { useEffect, useState, useRef } from "react";
import ChatNavbar from "./ChatNavbar";
import { getUserInfo } from "@/app/logic/getUserInfo";
import Loading from "@/app/components/Loading";
import date from "date-and-time";
import ChatUploadImage from "./ChatUploadImage";
import ConsultBtn from "@/app/consult/ConsultBtn";
import { useCreateChatroomMessage } from "@/app/features/chatroom/useCreateChatroomMessage";
import { useFetchChatPartnerData } from "@/app/features/chatroom/useFetchChatPartnerData";
import { useFormik } from "formik";
import useListenChatroom from "@/app/features/chatroom/useListenChatroom";

const Chatroom = ({ params }) => {
  const chatroomId = params.chatRoomId;
  const { data: messages, isLoading: isMessagesLoading, error } = useListenChatroom(chatroomId);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isThereANewMessage, setIsThereANewMessage] = useState(false);
  const messageContainerRef = useRef(null);

  const { uid, username } = getUserInfo();

  const formik = useFormik({
    initialValues: {
      newMessage: "",
      messageImage: "",
      fileUpload: "",
      progressValue: 0,
      isChatExpired: false,
    },

    onSubmit: () => {
      const { newMessage, isChatExpired } = formik.values;

      if (newMessage === "") return;

      if (isChatExpired) return;

      const now = new Date();

      const newMessageObj = {
        senderId: uid,
        senderDisplayName: username,
        createdAt: date.format(now, "HH:mm:ss"),
        text: newMessage,
        isRead: false,
      };

      createChatroomMessage(newMessageObj);
    },
  });

  const { data: chatPartnerData, isLoading: chatPartnerDataIsLoading } = useFetchChatPartnerData(chatroomId, uid);

  const { mutate: createChatroomMessage } = useCreateChatroomMessage(chatroomId, {
    onSuccess: () => {
      setIsThereANewMessage(true);

      formik.resetForm();
    },
  });

  const handleInputFocus = () => {
    setIsKeyboardOpen(true);
  };

  const handleInputBlur = () => {
    setIsKeyboardOpen(false);
  };

  const isImageLink = (text) => {
    if (text.startsWith("https://firebasestorage.googleapis.com/")) return true;
  };

  useEffect(() => {
    if ((messageContainerRef.current && !isKeyboardOpen) || (messageContainerRef.current && isThereANewMessage)) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isKeyboardOpen]);

  if (error) return <h1>Error</h1>;

  if (isMessagesLoading || chatPartnerDataIsLoading) return <Loading />;

  return (
    <>
      <ChatNavbar chatPartnerData={chatPartnerData} formik={formik} />

      <div className="flex-1 px-2 border h-[80vh] lg:h-[76vh] overflow-y-auto" ref={messageContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chat ${message.senderId === uid ? "chat-end" : "chat-start"}`}>
            <div className="chat-bubble bg-base-300 text-slate-800 font-semibold mt-3 flex flex-col justify-center">
              {isImageLink(message.text) ? (
                <div className="w-[70vw] h-[50vh] lg:w-[40vw] lg:h-[65vh]">
                  <img src={message.text} alt="Chat Image" className="w-[100%] h-[100%] mx-auto object-contain rounded" />
                </div>
              ) : (
                <div className="message-text mr-6" style={{ maxWidth: "55vw", wordBreak: "break-word" }}>
                  {message.text}
                </div>
              )}
              <span className="text-xs text-slate-500 font-thin flex justify-end">{message.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={formik.handleSubmit} className="p-2 ${isKeyboardOpen ? 'translate-y-[-5px]' : ''} ${isThereANewMessage ? 'translate-y-[-5px]' : ''}  flex items-center justify-between" disabled>
        {/* upload image */}
        <ChatUploadImage chatroomId={chatroomId} formik={formik} />

        {/* text input */}
        <input
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          name="newMessage"
          onChange={formik.handleChange}
          value={formik.values.newMessage}
          type="text"
          placeholder={formik.values.isChatExpired ? "Beli token untuk melanjutkan konsultasi" : "Type here"}
          className="input input-bordered w-[80%] lg:w-[90%] lg:ml-4"
          disabled={formik.values.isChatExpired}
        />

        {/* button */}
        {formik.values.isChatExpired && chatPartnerData.pricing ? (
          <ConsultBtn isInChatRoom={true} chatPartnerData={chatPartnerData} chatroomId={chatroomId} />
        ) : (
          <button type="submit" className="btn btn-md bg-[#001a9d] text-base-100 ml-3 lg:ml-5" disabled={formik.values.isChatExpired}>
            Send
          </button>
        )}
      </form>
    </>
  );
};

export default Chatroom;

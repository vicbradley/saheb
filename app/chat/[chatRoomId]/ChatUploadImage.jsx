import { getUserInfo } from "@/app/logic/getUserInfo";
import { Button } from "@chakra-ui/react";
import { Dialog, Flex } from "@radix-ui/themes";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import date from "date-and-time";
import FileUpload from "@/app/components/FileUpload";

const ChatUploadImage = ({ chatroomId, formik }) => {
  const { uid, username } = getUserInfo();
  const { fileUpload, messageImage, isChatExpired } = formik.values;

  const handleSendImage = async () => {
    if (!fileUpload) return;

    const now = new Date();

    const newMessageObj = {
      senderId: uid,
      senderDisplayName: username,
      createdAt: date.format(now, "HH:mm:ss"),
      text: messageImage,
      isRead: false,
    };

    const chatRoomRef = doc(db, "chatrooms", chatroomId);

    await updateDoc(chatRoomRef, {
      messages: arrayUnion(newMessageObj),
    });

    formik.setFieldValue("newMessage", "");
    formik.setFieldValue("messageImage", "");
    formik.setFieldValue("fileUpload", "");
    formik.setFieldValue("progressValue", 0);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="btn mr-4 lg:mr-0" disabled={isChatExpired ? true : false}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
            <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
          </svg>
        </button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Upload Gambar</Dialog.Title>

        <Flex direction="column" gap="3">
          <FileUpload formik={formik} folderName="messageImage/" labelText="Upload Gambar" />
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <button className={`bg-[#edf2f7] font-semibold px-3 rounded ${messageImage ? "" : "cursor-not-allowed opacity-50"}`} disabled={!messageImage ? true : false} onClick={handleSendImage}>
              Send
            </button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ChatUploadImage;

import { getUserInfo } from "@/app/logic/getUserInfo";
import { Progress, Button } from "@chakra-ui/react";
import { Dialog, Flex, Text } from "@radix-ui/themes";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, storage } from "@/src/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import date from "date-and-time";

const UploadImage = (props) => {
  const [fileUpload, setFileUpload] = useState(null);
  const [messageImage, setMessageImage] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const { uid, username } = getUserInfo();

  const uploadFile = async () => {
    if (!fileUpload) return;

    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = ref(storage, "messageImage/" + fileUpload.name);
    const uploadTask = uploadBytesResumable(storageRef, fileUpload, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressValue(progress);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setMessageImage(downloadURL);
        });
      }
    );
  };

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

    const chatRoomRef = doc(db, "chatrooms", props.chatRoomId);

    await updateDoc(chatRoomRef, {
      messages: arrayUnion(newMessageObj),
    });

    setMessageImage(null);
    setFileUpload(null);
    setProgressValue(0);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="btn mr-4 lg:mr-0" disabled={props.isChatExpired ? true : false}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
            <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
          </svg>
        </button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Upload Gambar</Dialog.Title>

        <Flex direction="column" gap="3">
          {/* Input File */}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Pilih Gambar
            </Text>
            <div className="flex justify-between items-center">
              <input type="file" className="file-input file-input-bordered file-input-sm" onChange={(e) => setFileUpload(e.target.files[0])} />
              <button className={`ml-2 btn btn-sm bg-slate-800 text-base-300  hover:text-slate-800 ${fileUpload ? "" : "cursor-not-allowed opacity-50"}`} onClick={uploadFile}>
                upload
              </button>
            </div>
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              {progressValue == 100 ? "Gambar sukses diupload" : "Upload File dulu"}
            </Text>
            <Progress value={progressValue} />
          </label>
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
            {/* <Button onClick={handleSendImage} disabled={true}>Send</Button> */}
            {/* <Button>Send</Button> */}
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UploadImage;

"use client";
import { Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useToast, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Button, Progress, toast } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useAuthContext } from "@/app/context/Auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db, storage } from "@/src/firebase/config";
import { getUserInfo } from "@/app/logic/getUserInfo";
import isEmpty from "validator/lib/isEmpty";

export default function EditProfile() {
  const { isLocalStorageUpdated, setIsLocalStorageUpdated } = useAuthContext();
  const { uid, username, profilePicture, email, store } = getUserInfo();

  const [newUsername, setNewUsername] = useState(username);
  const [newProfilePicture, setNewProfilePicture] = useState(profilePicture);
  const [fileUpload, setFileUpload] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const toast = useToast();

  const updateParticipantDataInChatRooms = async () => {
    const q = query(collection(db, "chatrooms"), where("participants", "array-contains", { uid: uid, profilePicture, username }));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const chatRoomRef = doc(db, "chatrooms", document.id);

      const participant = document.data().participants.filter((participant) => participant.uid !== uid);

      console.log(participant);

      await updateDoc(chatRoomRef, {
        participants: [
          {
            uid,
            username: newUsername,
            profilePicture: newProfilePicture,
          },
          {
            uid: participant[0].uid,
            username: participant[0].username,
            profilePicture: participant[0].profilePicture,
          },
        ],
      });
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (isEmpty(newUsername)) {
      toast({
        title: "Error",
        description: "Isi form dengan lengkap",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const productDoc = doc(db, "users", getUserInfo().uid);

    await updateDoc(productDoc, {
      username: !newUsername ? username : newUsername,
      profilePicture: !newProfilePicture ? profilePicture : newProfilePicture,
    });

    await updateParticipantDataInChatRooms();

    localStorage.removeItem("auth");

    const updatedLocalStorage = {
      uid,
      username: newUsername,
      profilePicture: !newProfilePicture ? profilePicture : newProfilePicture,
      email,
      store,
    };

    localStorage.setItem("auth", JSON.stringify(updatedLocalStorage));

    toast({
      title: "Success",
      description: "Profile berhasil diupdate",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    setIsLocalStorageUpdated(isLocalStorageUpdated + 1);
  };

  const uploadFile = async () => {
    if (!fileUpload) return;

    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = ref(storage, "usersProfilePicture/" + fileUpload.name);
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
          setNewProfilePicture(downloadURL);
        });
      }
    );
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {/* <Button colorScheme="green">Update Profile</Button> */}
        <button className="text-white bg-[#001a9d] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Update Profile
        </button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Update Profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Isi Form Berikut.
        </Dialog.Description>
        <Flex direction="column" gap="3">
          {/* Input Username */}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Username
            </Text>
            <TextField.Input placeholder="username" defaultValue={username} onChange={(e) => setNewUsername(e.target.value)} />
          </label>

          {/* Input File */}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Foto Profil
            </Text>
            <div className="flex justify-between items-center">
              <input type="file" className="file-input file-input-bordered file-input-sm" onChange={(e) => setFileUpload(e.target.files[0])} />
              <button className="ml-2 btn btn-xs bg-slate-800 text-base-300 hover:text-slate-800" onClick={uploadFile}>
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
              Close
            </Button>
          </Dialog.Close>

          <Dialog.Close>
            <Button onClick={updateProfile}>Update</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

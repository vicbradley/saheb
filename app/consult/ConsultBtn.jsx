import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useAuthContext } from "../context/Auth";
import SignInPopUp from "../components/SignInPopUp";
import { db } from "@/src/firebase/config";
import { collection, query, where, getDocs, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { getUserInfo } from "../logic/getUserInfo";
import { useRouter } from "next/navigation";
import { useMessageContext } from "../context/Message";
import moment from "moment";
moment().format();

const ConsultBtn = (props) => {
  const [inputValue, setInputValue] = useState(null);
  const { setIsChatExpired } = useMessageContext();
  const { isAuth } = useAuthContext();
  const { username, email, uid, profilePicture } = getUserInfo();
  const { otherUserId, otherUsername, otherUserProfilePicture, pricing } = props.otherUserData;
  const toast = useToast();

  const { push } = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const callToast = (title, description, status) => {
    return toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  const getUserData = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    return {
      uid: userSnap.id,
      username: userSnap.data().username,
      profilePicture: userSnap.data().profilePicture,
    };
  };

  const checkToken = async () => {
    const q = query(collection(db, "tokens"), where("token", "==", inputValue));
    const tokenDocs = await getDocs(q);

    if (tokenDocs.docs[0]) {
      if (props.isInChatRoom) {
        const existChatRoomRef = doc(db, "chatrooms", props.chatRoomId);
        await updateDoc(existChatRoomRef, {
          // chatExpired: moment().add(30, "minutes")._d.toString(),
          chatExpired: moment().add(1, 'days')._d.toString(),
        });

        // setIsChatRoomExtended(true);
        setIsChatExpired(false);

        callToast("Success", "Sesi konsultasi diperpanjang", "success");

        setTimeout(() => {
          window.location.reload();
        }, 3000);

        return;
      } else {
        const [currentUserData, participantData] = await Promise.all([getUserData(uid), getUserData(otherUserId)]);

        // chatroom
        const chatRoomRef = await addDoc(collection(db, "chatrooms"), {
          messages: [],
          participants: [currentUserData, participantData],
          chatExpired: moment().add(1, 'days')._d.toString()
          // chatExpired: moment().add(30, "minutes")._d.toString(),
        });

        callToast("Success", "Token yang anda masukkan benar silahkan berkonsultasi dengan dokter", "success");

        push(`chat/${chatRoomRef.id}`);
      }
    } else {
      callToast("Error", "Token yang anda masukkan salah", "error");
    }
  };

  const buyToken = () => {
    const encodedUrlText = encodeURIComponent(
      `Saheb\n=====\nUID: ${uid}\nUsername: ${username}\nEmail:${email}\n=====\nPembelian token senilai Rp.${Intl.NumberFormat("id-ID").format(parseInt(pricing))} untuk berkonsultasi dengan ${otherUsername}`
    );

    const whatsappLink = `https://wa.me/6285656736455?text=${encodedUrlText}`;
    window.open(whatsappLink, "_blank");
  };

  const openModal = async () => {
    try {
      const chatRoomCollection = await getDocs(collection(db, "chatrooms"));

      if (chatRoomCollection.empty) {
        onOpen();
        return;
      }

      const participant1Obj = {
        uid,
        username,
        profilePicture,
      };

      const participant2Obj = {
        uid: otherUserId,
        username: otherUsername,
        profilePicture: otherUserProfilePicture,
      };

      const q1 = query(collection(db, "chatrooms"), where("participants", "array-contains", participant1Obj));

      const q2 = query(collection(db, "chatrooms"), where("participants", "array-contains", participant2Obj));

      const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

      const commonChatrooms = [];

      snapshot1.forEach((doc1) => {
        snapshot2.forEach((doc2) => {
          if (doc1.id === doc2.id) {
            commonChatrooms.push(doc1);
          }
        });
      });

      commonChatrooms[0] ? push(`chat/${commonChatrooms[0].id}`) : onOpen();
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  if (!isAuth) {
    return <SignInPopUp text="Konsultasi" />;
  }

  return (
    <>
      {props.isInChatRoom ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            onOpen();
          }}
          className="btn btn-md bg-[#001a9d] text-base-100 ml-3 lg:ml-5"
        >
          Beli token
        </button>
      ) : (
        <button className="text-white sm:w-[30%] lg:w-auto bg-[#001a9d] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm lg:text-md px-3 lg:px-5 py-2.5 text-center" onClick={otherUserId !== uid ? openModal : () => ""}>
          Konsultasi
        </button>
      )}

      <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Masukkan Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Token (8 Digit Angka)</FormLabel>
              <Input onChange={(e) => setInputValue(e.target.value)} ref={initialRef} placeholder="cth: 12345678" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={buyToken} mr={3}>
              Beli Token
            </Button>

            <Button onClick={checkToken} colorScheme="blue">
              Enter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConsultBtn;

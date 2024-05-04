import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useAuthContext } from "../context/Auth";
import SignInPopUp from "../components/SignInPopUp";
import { getUserInfo } from "../logic/getUserInfo";
import { useRouter } from "next/navigation";
import { useMessageContext } from "../context/Message";
import moment from "moment";
import { useFetchToken } from "../features/consult/useFetchToken";
import { useCreateChatroom } from "../features/chatroom/useCreateChatroom";
import { useFetchChatroomByParticipants } from "../features/chatroom/useFetchChatroomByParticipants";
import { useEditChatroomExpiry } from "../features/chatroom/useEditChatroomExpiry";
import useCallToast from "../features/helper/useCallToast";
moment().format();

const ConsultBtn = ({ chatPartnerData, isInChatRoom, chatroomId }) => {
  const [inputValue, setInputValue] = useState(null);

  const { setIsChatExpired } = useMessageContext();
  const { isAuth } = useAuthContext();

  const { username, email, uid, profilePicture } = getUserInfo();

  const { chatPartnerId, chatPartnerUsername, chatPartnerProfilePicture, chatPartnerPricing } = chatPartnerData;

  const toast = useToast();

  const { push } = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const { mutate: createChatroom } = useCreateChatroom({
    onSuccess: (response) => {
      useCallToast(toast, "Success", "Token yang anda masukkan benar silahkan berkonsultasi dengan dokter", "success")

      push(`chat/${response.data.id}`);
    },
  });

  const { mutate: editChatroomExpiry } = useEditChatroomExpiry({
    onSuccess: () => {
      setIsChatExpired(false);

      useCallToast(toast, "Success", "Sesi konsultasi diperpanjang", "success")

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
  });


  const checkToken = async () => {
    try {
      await useFetchToken(inputValue);

      if (isInChatRoom) {
        editChatroomExpiry(chatroomId);
      } else {
        createChatroom({
          mainUserData: {
            uid,
            username,
            profilePicture,
          },
          chatPartnerData: {
            uid: chatPartnerId,
            username: chatPartnerUsername,
            profilePicture: chatPartnerProfilePicture,
          },
        });
      }
    } catch (error) {
      useCallToast(toast, "Error", error.response.data, "error");
    }
  };

  const buyToken = () => {
    const encodedUrlText = encodeURIComponent(
      `Saheb\n=====\nUID: ${uid}\nUsername: ${username}\nEmail:${email}\n=====\nPembelian token senilai Rp.${Intl.NumberFormat("id-ID").format(parseInt(chatPartnerPricing))} untuk berkonsultasi dengan ${chatPartnerUsername}`
    );

    const whatsappLink = `https://wa.me/6285656736455?text=${encodedUrlText}`;
    window.open(whatsappLink, "_blank");
  };

  const openModal = async () => {
    try {
      const chatroomData = await useFetchChatroomByParticipants(uid, chatPartnerId);

      push(`chat/${chatroomData.id}`);
    } catch (error) {
      onOpen();
    }
  };

  if (!isAuth) {
    return <SignInPopUp text="Konsultasi" />;
  }

  return (
    <>
      {isInChatRoom ? (
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
        <button
          className="text-white sm:w-[30%] lg:w-auto bg-[#001a9d] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm lg:text-md px-3 lg:px-5 py-2.5 text-center"
          onClick={chatPartnerId !== uid ? openModal : () => ""}
        >
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

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useAuthContext } from "../context/Auth";
import SignInPopUp from "../components/SignInPopUp";
import { getUserInfo } from "../logic/getUserInfo";
import { useRouter } from "next/navigation";
import { useMessageContext } from "../context/Message";
import { useCreateChatroom } from "../features/chatroom/useCreateChatroom";
import { useEditChatroomExpiry } from "../features/chatroom/useEditChatroomExpiry";
import { axiosInstance } from "../lib/axiosInstance";
import { QueryClient } from "@tanstack/react-query";

const ConsultBtn = ({ chatPartnerData, isInChatRoom, chatroomId }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      toast({
        status: "success",
        title: "Token Valid",
        description: "Token yang anda masukkan benar silahkan berkonsultasi dengan dokter",
      });
      push(`chat/${response.data.id}`);
    },
  });

  const { mutate: editChatroomExpiry } = useEditChatroomExpiry({
    onSuccess: () => {
      setIsChatExpired(false);
      toast({
        status: "success",
        title: "Token Valid",
        description: "Sesi konsultasi berhasil diperpanjang",
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
  });

  const fetchToken = async (tokenValue) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
        },
      },
    });
    try {
      const token = await queryClient.fetchQuery({
        queryKey: ["token"],
        queryFn: () => axiosInstance.get(`/consult/token/${tokenValue}`).then((res) => res.data),
      });
      return token;
    } catch (error) {
      throw new Error(error.response?.data || "An error occurred");
    }
  };

  const checkToken = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchToken(inputValue);

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
      setError(error.message);
      toast({
        status: "error",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
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
      const { data: chatroomData } = await axiosInstance.get(`/chatrooms/participants?mainUserId=${uid}&chatPartnerId=${chatPartnerId}`);
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
              <Input
                onChange={(e) => setInputValue(e.target.value)}
                ref={initialRef}
                placeholder="cth: 12345678"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={buyToken} mr={3}>
              Beli Token
            </Button>
            <Button onClick={checkToken} colorScheme="blue" isLoading={isLoading}>
              Enter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConsultBtn;

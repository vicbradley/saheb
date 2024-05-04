import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useEditChatroomExpiry = ({onSuccess, onError}) => {
  return useMutation({
    mutationFn: async (chatroomId) => {
      const response = await axiosInstance.patch(`/chatrooms/${chatroomId}/expiry`);

      return response;
    },
    onSuccess
  });
};
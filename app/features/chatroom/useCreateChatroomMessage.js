import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useCreateChatroomMessage = (chatroomId, {onSuccess}) => {
  return useMutation({
    mutationFn: async (body) => {
      const response = await axiosInstance.post(`/chatrooms/${chatroomId}/message`, body);

      return response;
    },
    onSuccess
  });
};
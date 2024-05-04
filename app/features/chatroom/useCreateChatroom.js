import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useCreateChatroom = ({onSuccess, onError}) => {
  return useMutation({
    mutationFn: async (body) => {
      const chatroomResponse = await axiosInstance.post("/chatrooms", body);

      return chatroomResponse;
    },
    onSuccess
  });
};
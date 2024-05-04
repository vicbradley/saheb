import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useEditChatroomsUserData = (userId) => {
  return useMutation({
    mutationFn: async (body) => {
      const chatroomResponse = await axiosInstance.patch(`/chatrooms/users/${userId}`, body);

      return chatroomResponse;
    },
  });
};

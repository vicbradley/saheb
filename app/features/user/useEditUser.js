import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useEditUser = (userId) => {
  return useMutation({
    mutationFn: async (body) => {
      const userResponse = await axiosInstance.patch(`/users/${userId}`, body);

      return userResponse;
    },
  });
};

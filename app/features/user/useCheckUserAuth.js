import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useCheckUserAuth = () => {
  return useMutation({
    mutationFn: async (body) => {
      const response = await axiosInstance.post(`/users/login`, body);

      return response;
    },
  });
};

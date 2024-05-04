import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useCreateStore = ({onSuccess, onError}) => {
  return useMutation({
    mutationFn: async (body) => {
      const storeResponse = await axiosInstance.post("/stores", body);

      return storeResponse;
    },
    onSuccess,
    onError
  });
};
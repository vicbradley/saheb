import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddCartItem = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body) => {
      const response = await axiosInstance.post(`/cart/${userId}`, body);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart items"]);
    },
  })
};

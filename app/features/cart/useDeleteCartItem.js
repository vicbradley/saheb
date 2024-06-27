import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCartItem = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId) => {
      const response = await axiosInstance.delete(`/cart/${userId}?productId=${productId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart items"]);
    },
  })
}

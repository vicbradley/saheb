import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCancelOrderItems = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body) => {
      const response = await axiosInstance.patch(`/cart/${userId}/cancel-order`, body);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart items"]);
    },
  })
}

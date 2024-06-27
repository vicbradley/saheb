
import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteProduct = (storeId, productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const productsResponse = await axiosInstance.delete(`/stores/${storeId}/products/${productId}`);

      return productsResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["store products"]);
    },
  });
};
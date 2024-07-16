
import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteProduct = (storeId, productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body) => {
      const productsResponse = await axiosInstance.delete(`/stores/${storeId}/products/${productId}`, body);

      return productsResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["store products"]);
    },
  });
};
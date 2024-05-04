
import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useDeleteProduct = (storeId, productId) => {
  return useMutation({
    mutationFn: async () => {
      const productsResponse = await axiosInstance.delete(`/stores/${storeId}/products/${productId}`);

      return productsResponse;
    },
  });
};
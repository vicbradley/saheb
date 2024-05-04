import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useEditProduct = (productId) => {
  return useMutation({
    mutationFn: async (body) => {
      const productsResponse = await axiosInstance.put(`/stores/${body.storeId}/products/${productId}`, body);

      return productsResponse;
    },
  });
};

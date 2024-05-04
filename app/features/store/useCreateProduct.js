import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (body) => {
      const productsResponse = await axiosInstance.post(`/stores/${body.storeId}/products`, body);

      return productsResponse;
    },
  });
};
// useCreateProduct.js
import { axiosInstance } from "@/app/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body) => {
      const productsResponse = await axiosInstance.post(`/stores/${body.storeId}/products`, body);
      return productsResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["store products"]);
    },
  });
};

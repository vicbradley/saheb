import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useFetchProductById = (productId) => {
  return useQuery({
    queryKey: ["product by id"],
    queryFn: () => axiosInstance.get(`/products/${productId}`).then((res) => res.data),
  });
};
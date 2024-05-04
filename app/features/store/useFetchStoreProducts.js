import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useFetchStoreProducts = (storeId) => {
  return useQuery({
    queryKey: ["store products"],
    queryFn: () => axiosInstance.get(`/stores/${storeId}/products`).then((res) => res.data),
  });
};
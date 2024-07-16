import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useFetchStoreProducts = (storeId, page) => {
  return useQuery({
    queryKey: ["store products", storeId],
    queryFn: () => axiosInstance.get(`/stores/${storeId}/products?page=${page}`).then((res) => res.data),
  });
};

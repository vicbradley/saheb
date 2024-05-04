import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useFetchStoreData = (storeId) => {
  return useQuery({
    queryKey: ["store data"],
    queryFn: () => axiosInstance.get(`/stores/${storeId}`).then((res) => res.data),
  });
};
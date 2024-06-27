import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useFetchProducts = (page, limit) => { // Set default values
  return useQuery({
    queryKey: ["products", page], // Include page in query key for unique queries
    queryFn: () => axiosInstance.get(`/products?page=${page}&limit=${limit}`).then((res) => res.data),
    staleTime: 60000
  });
}
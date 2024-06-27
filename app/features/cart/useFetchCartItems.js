import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useFetchCartItems = (userId) => {
  return useQuery({
    queryKey: ["cart items"],
    queryFn: () => axiosInstance.get(`/cart/${userId}`).then((res) => res.data),
  });
}
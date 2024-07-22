import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useFetchTransactionsByUserId = (userId) => {
  return useQuery({
    queryKey: ["transactions by user id"],
    queryFn: () => axiosInstance.get(`/transactions/users/${userId}`).then((res) => res.data),
  });
};
import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useFetchTransactionById = (transactionId) => {
  return useQuery({
    queryKey: ["transactions by  id"],
    queryFn: () => axiosInstance.get(`/transactions/${transactionId}`).then((res) => res.data),
  });
};
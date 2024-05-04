import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useFetchConsultants = () => {
  return useQuery({
    queryKey: ["consultants"],
    queryFn: () => axiosInstance.get("/consult/consultants").then((res) => res.data),
  });
};
import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useFetchUser = (userId) => {
  return useQuery({
    queryKey: ["user by id"],
    queryFn: () => axiosInstance.get(`/users/${userId}`).then((res) => res.data),
  });
};
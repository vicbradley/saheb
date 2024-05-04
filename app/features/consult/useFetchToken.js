import { axiosInstance } from "@/app/lib/axiosInstance";
import { QueryClient } from "@tanstack/react-query";

export const useFetchToken = async (tokenValue) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  const token = await queryClient.fetchQuery({ queryKey: ["token"], queryFn: () => axiosInstance.get(`/consult/tokens/${tokenValue}`).then((res) => res.data) });

  return token;
};

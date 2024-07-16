import { axiosInstance } from "@/app/lib/axiosInstance";
import { QueryClient } from "@tanstack/react-query";

export const useFetchChatroomByParticipants = async (mainUserId, chatPartnerId) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  const chatroomData = await queryClient.fetchQuery({ queryKey: ["fetch chatroom by participants"], queryFn: () => axiosInstance.get(`/chatrooms/participants?mainUserId=${mainUserId}&chatPartnerId=${chatPartnerId}`).then((res) => res.data) });

  return chatroomData;
};




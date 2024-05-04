import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useFetchChatPartnerData = (chatroomId, mainUserId) => {
  return useQuery({
    queryKey: ["chat partner data"],
    queryFn: () => axiosInstance.get(`/chatrooms/${chatroomId}/chatPartner?mainUserId=${mainUserId}`).then((res) => res.data),
  });
}

import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const useSearchStoreProducts = (storeId, keyword) => {
  return useQuery({
    queryKey: ["search store products"],
    queryFn: () => axiosInstance.get(`/stores/${storeId}/products/search/${keyword}`).then((res) => res.data),
  });
};

export default useSearchStoreProducts;

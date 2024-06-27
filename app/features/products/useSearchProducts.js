import { axiosInstance } from "@/app/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";


const useSearchProducts = (keyword) => {
  return useQuery({
    queryKey: ["search products"],
    queryFn: () => axiosInstance.get(`/products/search/${keyword}`).then((res) => res.data),
  });
};

export default useSearchProducts;

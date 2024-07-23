"use client";
import AddProductBtn from "./AddProductBtn";
import Products from "./Products";
import { useFetchStoreData } from "@/app/features/store/useFetchStoreData";
import Loading from "@/app/components/Loading";
import EmptyPage from "@/app/components/EmptyPage";

export default function StoreDashboard({ params }) {
  const { isPending, data: storeData, isError, failureReason } = useFetchStoreData(params.store);

  if (isError) return <EmptyPage text={`Error: ${failureReason.response.data}`} />;

  if (isPending) return <Loading />;

  return (
    <>
      <div className="bg-[#001a9d] min-h-[20vh] lg:min-h-[25vh] w-[98.5%] flex items-center mx-auto rounded-md p-3">
        <div className="avatar">
          <div className="w-16 sm:w-20 lg:w-24 rounded-full">
            <img src={storeData.profilePicture} alt="Profile" />
          </div>
        </div>
        <div className="py-4 ml-2 flex-grow">
          <p className="text-white text-md lg:text-2xl font-bold">{storeData.name}</p>
        </div>
        <AddProductBtn storeData={storeData} />
      </div>

      <div className="divider"></div>

      <div className="p-3">
        <p className="text-lg font-semibold">Daftar Produk</p>
        <Products storeData={storeData} />
      </div>
    </>
  );
}

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
      <div className="p-3">
        <h1 className="text-3xl font-bold">{params.store}</h1>
        <p className="text-lg font-semibold">Tambah Produk</p>
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

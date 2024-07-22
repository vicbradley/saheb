"use client";
import Loading from "@/app/components/Loading";
import Product from "@/app/components/Product";
import { useFetchStoreData } from "@/app/features/store/useFetchStoreData";
import useSearchStoreProducts from "@/app/features/store/useSearchStoreProducts";
import SearchProducts from "@/app/products/SearchProducts";
import React from "react";

const Page = ({ params }) => {
  const {store, keyword} = params;
  const { data: products, isLoading: productsIsLoading } = useSearchStoreProducts(store, keyword);
  const { data: storeData, isLoading: storeDataIsLoading } = useFetchStoreData(store);


  const renderProducts = () => {
    return (
      <>
        {products.length < 1 ? (
          <p className="w-[80%] h-[50vh] text-center mx-auto flex items-center justify-center text-[#001a9d] font-semibold text-lg">Produk tidak ditemukan, coba keyword lain...</p>
        ) : (
          <div className="flex flex-wrap justify-around">
            {products.map((product) => (
              <Product key={product.id} data={product} />
            ))}
          </div>
        )}
      </>
    );
  };


  if (productsIsLoading || storeDataIsLoading) return <Loading />;

  return (
    <>
     <div className="bg-[#001a9d] min-h-[20vh] lg:min-h-[25vh] w-[98.5%] flex items-center mx-auto rounded-md p-3">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img src={storeData.profilePicture} />
          </div>
        </div>
        <div className="py-4 ml-4">
          <p className="text-white text-2xl font-bold ">{storeData.name}</p>
          <p className="  text-white text-sm lg:text-md mt-2 ">{storeData.location}</p>
        </div>
      </div>

      <div className="bg-[white]">
        <SearchProducts isInStorePage={true} />

        {renderProducts()}
      </div>
    </>
  );
};

export default Page;

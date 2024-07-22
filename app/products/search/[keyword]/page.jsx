"use client"
import Product from "@/app/components/Product";
import useSearchProducts from "@/app/features/products/useSearchProducts";
import React from "react";
import SearchProducts from "../../SearchProducts";
import Loading from "@/app/components/Loading";

const Page = ({ params }) => {
  const { data: products, isLoading } = useSearchProducts(params.keyword);

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

  if (isLoading) return <Loading />

  return (
    <div className="pb-6">
      <div className="bg-[#001a9d] min-h-[25vh] w-full flex items-center">
        <p className="font-extrabold text-white text-3xl ml-3 mb-6">Daftar Produk</p>
      </div>

      <div className="bg-[white] rounded-t-[3rem]">
        <SearchProducts />

        {renderProducts()}
      </div>
    </div>
  );
};

export default Page;

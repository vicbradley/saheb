"use client";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Product from "../components/Product";
import { useSearchParams } from "next/navigation";
import { useFetchStoreData } from "../features/store/useFetchStoreData";
import { useFetchStoreProducts } from "../features/store/useFetchStoreProducts";
import SearchProducts from "../products/SearchProducts";
import useSearchProducts from "../features/products/useSearchProducts";

export default function Page({ params }) {
  const storeId = params.store;
  const { isPending: storeDataIsPending, data: storeData } = useFetchStoreData(storeId);
  const { isPending: isProductsPending, data: products, isError: isProductsError } = useFetchStoreProducts(storeId);
  const [searchedProducts, setSearchedProducts] = useState(products);
  const searchParams = useSearchParams();

  const renderProducts = () => {
    const productsToRender = searchedProducts || products;
    return (
      <>
        {productsToRender.length < 1 ? (
          <p className="w-[80%] h-[50vh] text-center mx-auto flex items-center justify-center text-[#001a9d] font-semibold text-lg">Produk tidak ditemukan, coba keyword lain...</p>
        ) : (
          <div className="flex flex-wrap justify-around">
            {productsToRender.map((product) => (
              <Product data={product} key={product.id} />
            ))}
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    if (products && searchParams.get("query")) {
      const results = useSearchProducts(products, searchParams.get("query"));

      setSearchedProducts(results);
    } else {
      setSearchedProducts(products);
    }
  }, [products, searchParams.get("query")]);

  if (isProductsPending || storeDataIsPending) return <Loading />;

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
        {isProductsError ? (
          <p className="w-[80%] h-[50vh] text-center mx-auto flex items-center justify-center text-[#001a9d] font-semibold text-lg">Toko belum memiliki produk</p>
        ) : (
          <>
            <SearchProducts isInStorePage={true} />
            {renderProducts()}
          </>
        )}
      </div>
    </>
  );
}

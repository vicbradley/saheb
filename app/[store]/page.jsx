"use client";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Product from "../components/Product";
import { useSearchParams, useRouter } from "next/navigation";
import { useFetchStoreData } from "../features/store/useFetchStoreData";
import { useFetchStoreProducts } from "../features/store/useFetchStoreProducts";
import SearchProducts from "../products/SearchProducts";

export default function Page({ params }) {
  const storeId = params.store;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const { isPending: storeDataIsPending, data: storeData } = useFetchStoreData(storeId);
  const { isPending: isProductsPending, data, isError: isProductsError, refetch } = useFetchStoreProducts(storeId, page);
  const { products, totalPages } = data || {};

  const renderProducts = () => {
    return (
      <>
        {products.length < 1 ? (
          <p className="w-[80%] h-[50vh] text-center mx-auto flex items-center justify-center text-[#001a9d] font-semibold text-lg">Toko belum memiliki produk</p>
        ) : (
          <div className="flex flex-wrap justify-around">
            {products.map((product) => (
              <Product data={product} key={product.id} />
            ))}
          </div>
        )}
      </>
    );
  };

  const renderPagination = () => {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    return (
      <div className="join flex justify-center mt-8">
        {pages.map((pageNum) => (
          <button key={pageNum} onClick={() => setPage(pageNum)} className={`join-item btn ${page === pageNum ? "btn-active bg-[#001a9d] text-white hover:bg-blue-500" : ""}`}>
            {pageNum}
          </button>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (totalPages <= 1) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    router.push(`?${params.toString()}`);
    refetch();
  }, [page, totalPages]);

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

            {totalPages > 1 && renderPagination()}
          </>
        )}
      </div>
    </>
  );
}

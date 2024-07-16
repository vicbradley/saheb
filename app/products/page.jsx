"use client";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "../components/Loading";
import { useFetchProducts } from "../features/products/useFetchProducts";
import SearchProducts from "./SearchProducts";

const Products = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  // const [limit] = useState(parseInt(searchParams.get("limit")) || 20);

  const { isLoading, data, refetch } = useFetchProducts(page);
  const { products, totalPages } = data || {};

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
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    router.push(`?${params.toString()}`);
    refetch();
  }, [page]);

  if (isLoading) return <Loading />;

  return (
    <div className="pb-6">
      <div className="bg-[#001a9d] min-h-[25vh] w-full flex items-center">
        <p className="font-extrabold text-white text-3xl ml-3 mb-6">Daftar Produk</p>
      </div>

      <div className="bg-[white] rounded-t-[3rem]">
        <SearchProducts />

        {renderProducts()}

        {renderPagination()}
      </div>
    </div>
  );
};

export default Products;

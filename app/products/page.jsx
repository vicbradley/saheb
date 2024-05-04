"use client";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import { useSearchParams } from "next/navigation";
import Loading from "../components/Loading";
import { useFetchProducts } from "../features/products/useFetchProducts";
import SearchProducts from "./SearchProducts";
import useSearchProducts from "../features/products/useSearchProducts";

const Products = () => {
  const { isPending, data: products } = useFetchProducts();
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
              <Product key={product.id} data={product} />
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

  if (isPending) return <Loading />;

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

export default Products;

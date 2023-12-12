"use client";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import Product from "../components/Product";
import MiniSearch from "minisearch";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Loading from "../components/Loading";

const Products = () => {
  const [productsData, setProductsData] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [inputValue, setInputValue] = useState(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const miniSearchConfig = {
    fields: ["name", "desc", "storeName"],
    storeFields: ["id", "name", "price", "stock", "desc", "image", "storeName", "storeId"],
  };

  const fetchProducts = async () => {
    const collectionRef = collection(db, "products");
    try {
      const snapshot = await getDocs(collectionRef);
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (!searchParams.get("query")) {
        setProductsData(data);
        setIsDataReady(true);
        return;
      }

      let miniSearch = new MiniSearch(miniSearchConfig);
      miniSearch.addAll(data);

      let results = miniSearch.search(searchParams.get("query"));

      setProductsData(results);
      setIsDataReady(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (inputValue) {
      params.set("query", inputValue);
    } else {
      params.delete("query");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams.get("query")]);

  if (!isDataReady) return <Loading />;

  return (
    <div className="pb-6">
      <div className="bg-[#001a9d] min-h-[25vh] w-full flex items-center">
        <p className="font-extrabold text-white text-3xl ml-3 mb-6">Daftar Produk</p>
      </div>

      <div className="bg-[white] rounded-t-[3rem]">
        <form className="pt-12 -mt-10 px-3">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              onChange={(e) => setInputValue(e.target.value)}
              defaultValue={searchParams.get("query")?.toString()}
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="Cari Produk..."
              required
            />
            <button
              onClick={handleSearch}
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>

        {productsData.length < 1 ? (
          <p className="w-[80%] h-[50vh] text-center mx-auto flex items-center justify-center text-[#001a9d] font-semibold text-lg">Produk tidak ditemukan, coba keyword lain...</p>
        ) : (
        <div className="flex flex-wrap justify-around">
          {productsData.map((product) => (
            <Product key={product.id} data={product} />
          ))}
        </div>
        )}

      </div>
    </div>
  );
};

export default Products;

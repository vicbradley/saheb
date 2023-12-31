"use client";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import Loading from "../components/Loading";
import Product from "../components/Product";
import MiniSearch from "minisearch";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Page({ params }) {
  const storeId = params.store;
  const [storeInfo, setStoreInfo] = useState(null);
  const [products, setProducts] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [inputValue, setInputValue] = useState(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const miniSearchConfig = {
    fields: ["name", "desc", "storeName"],
    storeFields: ["id", "name", "price", "stock", "desc", "image", "storeName", "storeId"],
  };

  const getStoreData = async () => {
    try {
      const docRef = doc(db, "stores", storeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // setStoreName(docSnap.data().name);

        const { name, location, profilePicture } = docSnap.data();

        setStoreInfo({
          name,
          location,
          profilePicture,
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = async () => {
    const q = query(collection(db, "products"), where("storeId", "==", storeId));

    const querySnapshot = await getDocs(q);

    const temp = [];

    querySnapshot.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id };

      temp.push(data);
    });

    if (!searchParams.get("query")) {
      setProducts(temp);
      setIsDataReady(true);
      return;
    }

    let miniSearch = new MiniSearch(miniSearchConfig);

    miniSearch.addAll(temp);

    let results = miniSearch.search(searchParams.get("query"));

    setProducts(results);
    setIsDataReady(true);
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
    getStoreData();
    getProducts();
  }, [searchParams.get("query")]);

  if (!isDataReady) {
    <Loading />;
  } else {
    return (
      <>
        <div className="bg-[#001a9d] min-h-[20vh] lg:min-h-[25vh] w-[98.5%] flex items-center mx-auto rounded-md p-3">
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src={storeInfo.profilePicture} />
            </div>
          </div>
          <div className="py-4 ml-4">
            <p className="text-white text-2xl font-bold ">{storeInfo.name}</p>
            <p className="  text-white text-sm lg:text-md mt-2 ">{storeInfo.location}</p>
          </div>
        </div>

        <div className="bg-[white] ">
          <form className="pt-12  px-3">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
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
              <button onClick={handleSearch} type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ">
                Search
              </button>
            </div>
          </form>

          {products.length < 1 ? (
            <p className="w-[80%] h-[50vh] text-center mx-auto flex items-center justify-center text-[#001a9d] font-semibold text-lg">Produk tidak ditemukan, coba keyword lain...</p>
          ) : (
            <div className="flex flex-wrap justify-around">
              {products.map((product) => (
                <Product data={product} key={product.id} />
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
}

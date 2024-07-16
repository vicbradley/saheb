"use client";
import Loading from "@/app/components/Loading";
import Products from "./Products";
import { useCartContext } from "@/app/context/Cart";

export default function UserCart({ params }) {
  const { cart } = useCartContext();

  if (cart.length < 1) {
    return <Loading />;
  }

  if (cart.stores.length < 1) {
    return <p className="w-[80%] h-[50vh] text-center mx-auto flex items-center justify-center text-[#001a9d] font-semibold text-lg">Belum ada produk yang ditambahkan</p>;
  }

  return (
    <>
      {cart.stores.map((store) => (
        <div className=" w-[95%] mx-auto my-10 bg-white border border-gray-200 rounded-lg" key={store.storeId}>
          <div className="bg-[#001a9d]  mx-auto rounded-md p-3">
            <h2 className=" font-bold text-2xl text-white">{store.storeName}</h2>
          </div>
          <Products key={store.storeId} products={store.products} storeId={store.storeId} storeName={store.storeName} />
        </div>
      ))}
    </>
  );
}

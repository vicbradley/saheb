"use client";
import { getUserInfo } from "@/app/logic/getUserInfo";
import AddProductBtn from "./AddProductBtn";
import Products from "./Products";

export default function StoreDashboard ({ params }) {
  if (getUserInfo().store !== params.store) return <h1>Error: Id tidak sesuai</h1>;

  return (
    <>
      <div className="p-3">
        <h1 className="text-3xl font-bold">{params.store}</h1>
        <p className="text-lg font-semibold">Tambah Produk</p>
        <AddProductBtn />
      </div>

      <div className="divider"></div>

      <div>
        <p className="text-lg font-semibold">Daftar Produk</p>
        <Products />
      </div>
    </>
  );
};

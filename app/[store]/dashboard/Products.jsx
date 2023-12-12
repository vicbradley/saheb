"use client";
import { db } from "@/src/firebase/config";
import { useEffect, useState } from "react";
import { getUserInfo } from "../../logic/getUserInfo";
import DeleteProductBtn from "./DeleteProductBtn";
import UpdateProductBtn from "./UpdateProductBtn";
import Loading from "@/app/components/Loading";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Products = () => {
  const { store } = getUserInfo();
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), where("storeId", "==", store));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsTemp = [];
      querySnapshot.forEach((doc) => {
        productsTemp.push({ ...doc.data(), id: doc.id });
      });
      setProducts(productsTemp);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (products.length < 1) {
    return <p>Belum ada produk yang ditambahkan</p>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-xs lg:table-md">
          {/* head */}
          <thead>
            <tr>
              <th>Nama</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <th>{product.name}</th>
                <td>Rp.{Intl.NumberFormat('id-ID').format(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <UpdateProductBtn productData={product} />
                </td>
                <td>
                  <DeleteProductBtn productId={product.id} productName={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;

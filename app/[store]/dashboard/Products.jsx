"use client";
import { useFetchStoreProducts } from "@/app/features/store/useFetchStoreProducts";
import { useEffect, useState } from "react";
import DeleteProductBtn from "./DeleteProductBtn";
import UpdateProductBtn from "./UpdateProductBtn";
import Loading from "@/app/components/Loading";

const Products = ({ storeData }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useFetchStoreProducts(storeData.id, page);
  const { products, totalPages } = data || {};

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
    refetch();
  }, [page]);

  if (isLoading) return <Loading />;

  if (error) return <h1>{error.response.data}</h1>;

  if (products.length < 1) {
    return <p className="w-[80%] h-[50vh] text-center mx-auto flex items-center justify-center text-[#001a9d] font-semibold text-lg">Toko belum memiliki produk</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th></th>
              <th></th>
              <th></th>
              <th>Harga</th>
              <th></th>
              <th>Stok</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td colSpan={4}>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-16 w-16 lg:h-20 lg:w-20">
                        <img src={product.image} alt={product.name} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td colSpan={2}>Rp. {Intl.NumberFormat("id-ID").format(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <UpdateProductBtn productData={product} storeData={storeData} />
                </td>
                <td>
                  <DeleteProductBtn storeId={product.storeId} productId={product.id} productName={product.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && renderPagination()}
    </>
  );
};

export default Products;

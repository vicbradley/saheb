"use client";
import DeleteProductBtn from "./DeleteProductBtn";
import UpdateProductBtn from "./UpdateProductBtn";
import Loading from "@/app/components/Loading";
import useListenDashboard from "@/app/features/store/useListenDashboard";

const Products = ({storeData}) => {
  const {data: products, isLoading, error}  = useListenDashboard();

  if (isLoading) return <Loading />

  if (error) return <h1>Error</h1>

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
                  <UpdateProductBtn productData={product} storeData={storeData}/>
                </td>
                <td>
                  <DeleteProductBtn storeId={product.storeId} productId={product.id} productName={product.name} />
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

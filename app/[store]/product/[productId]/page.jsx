"use client";
import Loading from "@/app/components/Loading";
import AddToCartBtn from "@/app/components/AddToCartBtn";
import { useFetchProductById } from "@/app/features/products/useFetchProductById";

export default function ProductInStore({ params }) {
  const { productId } = params;
  const { isPending, data: product } = useFetchProductById(productId);

  if (isPending) return <Loading />;

  return (
    <div className="card lg:flex lg:flex-row bg-base-100 shadow-xl  ">
      <figure className="lg:w-[50vw] lg:h-[87vh] h-[60vh] ">
        <img className="lg:w-[100%] lg:h-[100%]  lg:object-contain " src={product.image} />
      </figure>
      <div className="card-body  ">
        <h2 className="card-title text-2xl lg:text-3xl">{product.name}</h2>
        <div className="card-actions justify-between items-center">
          <p className="text-xl font-semibold lg:text-2xl">Rp{Intl.NumberFormat("id-ID").format(product.price)}</p>
          <AddToCartBtn productData={product} />
        </div>
        <div>
          <p className="  mt-2">Stock : {product.stock}</p>

          <p className="lg:mt-7  mt-2">Deskripsi :</p>
          <p className="">{product.desc}</p>
        </div>
      </div>
    </div>
  );
}

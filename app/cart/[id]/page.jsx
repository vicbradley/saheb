"use client";
import Loading from "@/app/components/Loading";
import Product from "./Product";
import { useCartContext } from "@/app/context/Cart";
import PaymentDetails from "./PaymentDetails";
import PaymentProcess from "./PaymentProcess";

export default function UserCart ({ params }) {
  const { cartProducts } = useCartContext();
  const cartId = params.id;

  if (!cartProducts) {
    return <Loading />;
  }
  
  return (
    <>
      <p className="font-extrabold m-4 text-2xl">Cart Items</p>
      <div>

      {cartProducts.map((product) => (
        <Product data={product} key={product.id} cartId={cartId} />
        ))}

      <PaymentDetails cartId={cartId}/>
        </div>

      <PaymentProcess />
    </>
  );
};
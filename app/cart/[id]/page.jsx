"use client";
import Loading from "@/app/components/Loading";
import Product from "./Product";
import { useCartContext } from "@/app/context/Cart";
import PaymentDetails from "./PaymentDetails";
import PaymentProcess from "./PaymentProcess";

export default function UserCart({ params }) {
  const { cart } = useCartContext();

  const cartId = params.id;

  if (cart.length < 1) {
    return <Loading />;
  }

  return (
    <>
      <p className="font-extrabold m-4 text-2xl">Cart Items</p>
      <div>
        {cart.products.map((product) => (
          <Product productData={product} key={product.id} />
        ))}

        <PaymentDetails/>
      </div>

      <PaymentProcess />
    </>
  );
}

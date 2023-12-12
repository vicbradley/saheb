"use client";
import Loading from "@/app/components/Loading";
import Product from "./Product";
import { useCartContext } from "@/app/context/Cart";
import PaymentDetails from "./PaymentDetails";
import EmptyPage from "@/app/components/EmptyPage";
import { useEffect, useState } from "react";
import PaymentProcess from "./PaymentProcess";

const UserCart = ({ params }) => {
  const { cartProducts, totalPrice } = useCartContext();
  const cartId = params.id;

  if (!cartProducts) {
    return <Loading />;
  }

  // if (cartProducts.length < 1) return <EmptyPage text="Belum ada barang yang ditambahkan"/>
  
  // if (cartProducts.length < 1) return <EmptyPage text="Belum ada barang yang ditambahkan"/>

  return (
    <>
      <button onClick={() => console.log(cartProducts)}>test</button>
      <button onClick={() => console.log(totalPrice)}>test</button>
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

export default UserCart;

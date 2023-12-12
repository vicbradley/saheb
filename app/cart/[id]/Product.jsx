"use client";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { useCartContext } from "@/app/context/Cart";

const Product = (props) => {
  const { id, name, price, stock, image, amount, storeId, storeName } = props.data;
  const cartId = props.cartId;
  const { totalPrice, setTotalPrice, cartProducts, setCartProducts } = useCartContext();

  const handleIncrement = () => {
    if (amount == stock) return;

    const updatedCartProducts = cartProducts.map(obj => 
      obj.id === id ? { ...obj, amount: amount + 1 } : obj
    );

    setCartProducts(updatedCartProducts);

    setTotalPrice(totalPrice + parseInt(price));
  };

  const handleDecrement = () => {
    if (amount == 1) return;

    const updatedCartProducts = cartProducts.map(obj => 
      obj.id === id ? { ...obj, amount: amount - 1 } : obj
    );

    setCartProducts(updatedCartProducts);

    setTotalPrice(totalPrice - parseInt(price));
  };

  const handleDelete = async () => {
    // const obj = { productId: id, productPrice: price };
    const obj = { id, name, price, stock, image, amount, storeId, storeName  };
    const cartRef = doc(db, "carts", cartId);

    // only remove products object in db if === obj
    await updateDoc(cartRef, {
      products: arrayRemove(obj),
    });
  };

  return (
    <div className=" w-[95%] mx-auto p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex items-center">
        <div className="avatar">
          <div className="w-24 rounded-xl">
            <img src={image} className="object-cover" />
          </div>
        </div>

        <div className="ml-3 ">
          <p className="font-extrabold">{name}</p>
          <p>Rp {Intl.NumberFormat("id-ID").format(price)}</p>
          <p>Stock : {stock}</p>
        </div>
      </div>

      <div className="flex justify-end items-center">
        <button
          className="bg-red-500 text-white btn btn-sm sm:btn-sm md:btn-md lg:btn-md mr-4" onClick={handleDelete}>
          Delete
        </button>
        <div className="flex w-20 border border-slate-800 rounded-lg justify-around p-1">
          <button onClick={handleDecrement}>-</button>
          <p>{amount}</p>
          <button onClick={handleIncrement}>+</button>
        </div>
      </div>
    </div>
  );
};

export default Product;

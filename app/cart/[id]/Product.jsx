"use client";
import { useCartContext } from "@/app/context/Cart";
import { useDeleteCartItem } from "@/app/features/cart/useDeleteCartItem";
import { getUserInfo } from "@/app/logic/getUserInfo";

const Product = ({ productData }) => {
  const { id, name, price, stock, image, amount, storeId, storeName } = productData;
  const { totalPrice, setTotalPrice, cart, setCart } = useCartContext();

  const { mutate: deleteCartItem } = useDeleteCartItem(getUserInfo().uid);

  const handleDelete = () => {
    deleteCartItem(id);
  };

  const handleIncrement = () => {
    if (amount == stock) return;

    const updatedCartProducts = cart.products.map((obj) => (obj.id === id ? { ...obj, amount: amount + 1 } : obj));

    setCart((prevCart) => ({ ...prevCart, products: updatedCartProducts }));

    setTotalPrice(totalPrice + parseInt(price));
  };

  const handleDecrement = () => {
    if (amount == 1) return;

    const updatedCartProducts = cart.products.map((obj) => (obj.id === id ? { ...obj, amount: amount - 1 } : obj));

    setCart((prevCart) => ({ ...prevCart, products: updatedCartProducts }));

    setTotalPrice(totalPrice - parseInt(price));
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
        <button className="bg-red-500 text-white btn btn-sm sm:btn-sm md:btn-md lg:btn-md mr-4" onClick={handleDelete}>
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

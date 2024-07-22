"use client";
import { useDeleteCartItem } from "@/app/features/cart/useDeleteCartItem";
import { useOrderItems } from "@/app/features/cart/useOrderItems";
import { generateTransactionId } from "@/app/features/helper/generateTransactionId";
import { axiosInstance } from "@/app/lib/axiosInstance";
import { getUserInfo } from "@/app/logic/getUserInfo";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";

const Products = ({ products, storeId, storeName }) => {
  const { uid, username, email } = getUserInfo();
  const [quantities, setQuantities] = useState(products.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {}));

  const totalPrice = products.reduce((acc, product) => acc + product.price * quantities[product.id], 0);

  const toast = useToast();

  const { mutate: orderItems } = useOrderItems(uid);

  const { mutate: deleteCartItem } = useDeleteCartItem(uid);

  const handleIncrease = (productId, stock) => {
    setQuantities((prevQuantities) => {
      const newQuantity = prevQuantities[productId] + 1;
      if (newQuantity <= stock) {
        return { ...prevQuantities, [productId]: newQuantity };
      }
      return prevQuantities;
    });
  };

  const handleDecrease = (productId) => {
    setQuantities((prevQuantities) => {
      const newQuantity = prevQuantities[productId] - 1;
      if (newQuantity >= 1) {
        return { ...prevQuantities, [productId]: newQuantity };
      }
      return prevQuantities;
    });
  };

  const handleDelete = (productId) => {
    deleteCartItem(productId);
  };

  const openWA = async () => {
    const userData = (await axiosInstance.get(`/users/${uid}`)).data;
    const transactionId = generateTransactionId();
    if (!userData.address || !userData.phoneNumber) {
      toast({
        status: "error",
        title: "Lengkapi Data Pengiriman",
        description: "Tambahkan alamat pengiriman dan nomor telepon terlebih dahulu pada menu profile",
      })
      return;
    }

    const updatedProducts = products.map((product) => ({
      ...product,
      quantity: quantities[product.id],
    }));



    orderItems({
      transactionId,
      storeId,
      storeName,
      products: updatedProducts,
      totalPrice,
    });

    let encodedUrlText = `Saheb%0A=====%0APemesan: ${username}%0AUID: ${uid}%0AEmail: ${email}%0A=========%0AId Transaksi: ${transactionId}%0ANama Toko: ${storeName}`;

    updatedProducts.map((product) => {
      const { name, price, quantity } = product;
      encodedUrlText += `%0A=========%0ANama Produk: ${name}%0AHarga: ${Intl.NumberFormat("id-ID").format(price)}%0AJumlah: ${quantity}`;
    });

    encodedUrlText += `%0A=========%0ATotal Harga : ${Intl.NumberFormat("id-ID").format(totalPrice)}`;

    const whatsappLink = `https://wa.me/6285656736455?text=${encodedUrlText}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <>
      {products.map((product) => (
        <div className="p-4" key={product.id}>
          <div className="flex items-center">
            <div className="avatar">
              <div className="w-24 rounded-xl">
                <img src={product.image} className="object-cover" />
              </div>
            </div>

            <div className="ml-3">
              <p className="font-extrabold">{product.name}</p>
              <p>Rp {Intl.NumberFormat("id-ID").format(product.price)}</p>
              <p>Stock : {product.stock}</p>
            </div>
          </div>
          <div className="flex justify-end items-center mt-2">
            <button className="bg-red-500 text-white btn btn-sm sm:btn-sm md:btn-md lg:btn-sm mr-4" onClick={() => handleDelete(product.id)}>
              Delete
            </button>
            <div className="flex w-20 border border-slate-800 rounded-lg justify-around p-1">
              <button onClick={() => handleDecrease(product.id)}>-</button>
              <p>{quantities[product.id]}</p>
              <button onClick={() => handleIncrease(product.id, product.stock)}>+</button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md mt-4">
        <h2 className="font-bold sm:text-xl lg:text-2xl">Total Harga: Rp {Intl.NumberFormat("id-ID").format(totalPrice)}</h2>
        <button className="btn btn-sm bg-[#001a9d] text-white" onClick={openWA}>
          Buy Now
        </button>
      </div>
    </>
  );
};

export default Products;

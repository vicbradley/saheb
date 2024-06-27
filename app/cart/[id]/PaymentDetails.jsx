import { useCartContext } from "@/app/context/Cart";
import { useOrderItems } from "@/app/features/cart/useOrderItems";
import { getUserInfo } from "@/app/logic/getUserInfo";

const PaymentDetails = () => {
  const { cart, totalPrice } = useCartContext();

  const { uid, username, email } = getUserInfo();

  const { mutate: orderItems } = useOrderItems(uid);

  const openWA = () => {
    orderItems(cart.products);

    let encodedUrlText = `Saheb%0A=====%0APemesan: ${username}%0AUID: ${uid}%0AEmail: ${email}`;

    cart.products.map((product) => {
      const { name, price, amount, storeName } = product;
      encodedUrlText += `%0A=========%0ANama Produk: ${name}%0ANama Toko: ${storeName}%0AHarga: ${Intl.NumberFormat("id-ID").format(price)}%0AJumlah: ${amount}`;
    });

    encodedUrlText += `%0A=========%0ATotal Harga : ${Intl.NumberFormat("id-ID").format(totalPrice)}`;

    const whatsappLink = `https://wa.me/6285656736455?text=${encodedUrlText}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <>
      <div className="w-[95%] mx-auto p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow flex justify-between items-center">
        <div>
          <p className="text-xl font-bold">Total Price</p>
          <p className="text-xl">Rp. {Intl.NumberFormat("id-ID").format(totalPrice)}</p>
        </div>

        <button className="btn bg-[#001a9d] text-white" onClick={openWA} disabled={cart.length < 1 ? true : false}>
          Buy Now
        </button>
      </div>
    </>
  );
};

export default PaymentDetails;

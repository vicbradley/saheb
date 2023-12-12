import { useCartContext } from "@/app/context/Cart";
import { getUserInfo } from "@/app/logic/getUserInfo";
import { updateDoc, doc,getDoc } from "firebase/firestore";
import { db } from "@/src/firebase/config";

const PaymentDetails = (props) => {
  const { cartProducts, totalPrice } = useCartContext();

  const moveProductsToBeingPaid = async () => {
    const cartRef = doc(db, "carts", props.cartId);
    const cartSnap = await getDoc(cartRef);

    await updateDoc(doc(db, "carts", getUserInfo().uid), {
      products: [],
      productsBeingPaid: [...cartSnap.data().productsBeingPaid, ...cartProducts]
      
    });
  };

  const openWA = () => {
    moveProductsToBeingPaid();

    const { uid, username, email } = getUserInfo();

    let encodedUrlText = `Saheb%0A=====%0APemesan: ${username}%0AUID: ${uid}%0AEmail: ${email}`;

    cartProducts.map((product) => {
      const { name, price, amount, storeName } = product;
      encodedUrlText += `%0A=========%0ANama Produk: ${name}%0ANama Toko: ${storeName}%0AHarga: ${Intl.NumberFormat("id-ID").format(price)}%0AJumlah: ${amount}`;
    });

    encodedUrlText += `%0A=========%0ATotal Harga : ${Intl.NumberFormat("id-ID").format(totalPrice)}`;

    const whatsappLink = `https://wa.me/6285656736455?text=${encodedUrlText}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <>
      {/* <p className="text-2xl m-4 font-extrabold">Order Summary</p> */}
      <div className="w-[95%] mx-auto p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow flex justify-between items-center">
        <div>
          <p className="text-xl font-bold">Total Price</p>
          <p className="text-xl">Rp. {Intl.NumberFormat("id-ID").format(totalPrice)}</p>
        </div>

        <button className="btn bg-[#001a9d] text-white" onClick={openWA} disabled={cartProducts.length < 1 ? true : false}>
          Buy Now
        </button>

        {/* <div className="divider"></div> */}

        {/* <p className="text-xl font-bold">Payment Method</p>
        <p className="text-xl">Whatsapp</p> */}
      </div>
    </>
  );
};

export default PaymentDetails;

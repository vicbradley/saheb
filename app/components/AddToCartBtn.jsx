import { useAuthContext } from "../context/Auth";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getUserInfo } from "../logic/getUserInfo";
import { db } from "@/src/firebase/config";
import { useToast } from "@chakra-ui/react";
import SignInPopUp from "./SignInPopUp";

const AddToCartBtn = (props) => {
  const { id, name, price, stock, image, storeId, storeName } = props.productData;
  const { isAuth } = useAuthContext();
  const toast = useToast();
  const {store,uid} = getUserInfo();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const cartRef = doc(db, "carts", uid);

    console.log({id, name, price, stock, image, storeId, storeName, amount: 1});

    await updateDoc(cartRef, {
     products: arrayUnion({id, name, price, stock, image, storeId, storeName, amount: 1}) 
    })

    toast({
      title: "Success",
      description: "Produk ditambah ke keranjang",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  if (!isAuth) {
    return <SignInPopUp text="Add To Cart" />;
  }

  return (
    <div>
      <button 
      onClick={handleAddToCart}
      className="text-white  lg:w-auto bg-[#001a9d] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm lg:text-md px-3 lg:px-5 py-2.5 text-center" disabled={store === storeId ? true : false}>
      Add to cart
    </button>
    </div>
  );
};

export default AddToCartBtn;

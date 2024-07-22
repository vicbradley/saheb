import { useAuthContext } from "../context/Auth";
import { getUserInfo } from "../logic/getUserInfo";
import { useToast } from "@chakra-ui/react";
import SignInPopUp from "./SignInPopUp";
import { useAddCartItem } from "../features/cart/useAddCartItem";

const AddToCartBtn = ({ productData }) => {
  const { stock, storeId } = productData;
  const { isAuth } = useAuthContext();
  const toast = useToast();
  const { store, uid } = getUserInfo();

  const { mutate: addCartItem } = useAddCartItem(uid);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    addCartItem(productData);
    toast({
      status: "success",
      title: "Success",
      description: "Produk ditambah ke keranjang",
    });
  };

  const checkIsProductEligible = () => {
    if (store === storeId) {
      return false;
    }

    if (stock < 1) {
      return false;
    }

    return true;
  };

  if (!isAuth) {
    return <SignInPopUp text="Add To Cart" />;
  }

  return (
    <div>
      <button
        onClick={handleAddToCart}
        className={`text-white  lg:w-auto bg-[#001a9d]  focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm lg:text-md px-3 lg:px-5 py-2.5 text-center ${!checkIsProductEligible() ? "bg-[#d5d6d9]" : "hover:bg-blue-800"}`}
        disabled={!checkIsProductEligible() ? true : false}
      >
        Add to cart
      </button>
    </div>
  );
};

export default AddToCartBtn;

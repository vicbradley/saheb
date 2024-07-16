import { useRouter } from "next/navigation";
import { getUserInfo } from "../logic/getUserInfo";
import { useAuthContext } from "../context/Auth";
import { useCartContext } from "../context/Cart";
import { signInWithGoogle } from "../auth/signInWithGoogle";
import { useEffect } from "react";
import { useFetchCartItems } from "../features/cart/useFetchCartItems";
import { auth } from "@/src/firebase/config";
import { signOut } from "firebase/auth";

const CartIcon = () => {
  const { push } = useRouter();
  const { isAuth, setIsAuth } = useAuthContext();
  const { totalPrice, setTotalPrice, cartProductsLength, setCartProductsLength, cart, setCart } = useCartContext();
  const { uid } = getUserInfo();

  const { data: cartData, isLoading, isError } = useFetchCartItems(uid);

  useEffect(() => {
    if (isLoading || !cart) return;

    if (cartData) {
      // Set cart data
      setCart(cartData);

      // Calculate total price and total products length
      let total = 0;
      let length = 0;

      cartData.stores.forEach(store => {
        store.products.forEach(product => {
          total += product.price;
          length += 1;
        });
      });

      setTotalPrice(total);
      setCartProductsLength(length);
    }
  }, [cartData, isLoading]);

  const handleSignIn = async () => {
    if (await signInWithGoogle()) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
      return;
    }
  };

  const handleOnClick = () => {
    push(`/cart/${uid}`);
  };

  return (
    <>
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="badge badge-sm indicator-item">{isAuth ? cartProductsLength : 0}</span>
        </div>
      </label>
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
        <div className="card-body">
          <span className="font-bold text-lg">{isAuth ? cartProductsLength : 0} Items</span>
          <span className="text-[#001a9d]">{isAuth ? `Subtotal: Rp.${Intl.NumberFormat("id-ID").format(totalPrice)}` : "Sign In Terlebih dahulu"}</span>
          <div className="card-actions">
            <button className="btn btn-primary btn-block text-white" onClick={isAuth ? handleOnClick : handleSignIn}>
              {isAuth ? "Lihat Keranjang" : "Sign In With Google"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};


export default CartIcon;

import { useRouter } from "next/navigation";
import { getUserInfo } from "../logic/getUserInfo";
import { useAuthContext } from "../context/Auth";
import { useCartContext } from "../context/Cart";
import { signInWithGoogle } from "../auth/signInWithGoogle";
import { doc, onSnapshot, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { useEffect } from "react";

const CartIcon = () => {
  const { push } = useRouter();
  const { isAuth, setIsAuth } = useAuthContext();
  // const { uid } = getUserInfo();
  const { cartItemsCount, setCartItemsCount, totalPrice, setTotalPrice, setCartProducts, cartProducts } = useCartContext();

  const handleSignIn = async () => {
    const { uid } = getUserInfo();
    if (await signInWithGoogle()) {
      setIsAuth(true);
      push(`/cart/${uid}`);
    } else {
      setIsAuth(false);
      return;
    }
  };

  const handleOnClick = () => {
    const { uid } = getUserInfo();
    push(`/cart/${uid}`);
  };

  useEffect(() => {
    if (!isAuth) return;

    const { uid } = getUserInfo();
    const cartRef = doc(db, "carts", uid);

    const unsub = onSnapshot(cartRef, async (document) => {
      if (!document.data() || document.data().products.length < 1) {
        setCartProducts([]);
        setTotalPrice(0);
        return;
      }

      if (document.data().hasPaid) {
        setCartProducts([]);
        setTotalPrice(0);
        return;
      };

      console.log("cartIcon");

      // const cartProductsFromDB = document.data().products;

      // const temp = [];

      // for (const object of cartProductsFromDB) {
      //   const productRef = doc(db, "products", object.productId);
      //   const productSnap = await getDoc(productRef);
      //   const data = { ...productSnap.data(), id: productSnap.id, amount: 1 };
      //   // console.log("haerin");
      //   temp.push(data);
      // }

      // set state context cartProducts
      // console.log(temp);
      // setCartProducts(temp);

      setCartProducts(document.data().products);

      console.log("awikwok");

      // set state context totalPrice
      // const sum = document.data().products.reduce((accumulator, current) => accumulator + parseInt(current.productPrice), 0);
      const sum = document.data().products.reduce((accumulator, current) => accumulator + parseInt(current.price), 0);
      setTotalPrice(sum);

      // set state context cartItemsCount
      const cartItemsLength = document.data().products.length;
      setCartItemsCount(cartItemsLength);
    });

    return () => unsub();
  }, [isAuth]);

  return (
    <>
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="badge badge-sm indicator-item">{isAuth ? cartItemsCount : 0}</span>
        </div>
      </label>
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
        <div className="card-body">
          <span className="font-bold text-lg">{isAuth ? cartItemsCount : 0} Items</span>
          <span className="text-[#001a9d]">{isAuth ? `Subtotal: Rp.${Intl.NumberFormat("id-ID").format(totalPrice)}` : "Sign In Terlebih dahulu"}</span>
          <div className="card-actions">
            <button className="btn btn-primary btn-block" onClick={isAuth ? handleOnClick : handleSignIn}>
              {isAuth ? "View cart" : "Sign In With Google"}
            </button>
            <button onClick={() => console.log(cartProducts)}>test</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartIcon;



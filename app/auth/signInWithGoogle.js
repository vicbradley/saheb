import { signInWithPopup } from "firebase/auth";
import { checkStore } from "../logic/checkStore";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { auth, googleProvider } from "@/src/firebase/config";
import { checkCart } from "../logic/checkCart";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const hasAStore = await checkStore(result.user.uid);


    const docRef = doc(db, "users", result.user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const authInfo = {
        uid: result.user.uid,
        username: result.user.displayName,
        email: result.user.email,
        profilePicture: result.user.photoURL,
        store: hasAStore,
      };
      await setDoc(docRef, authInfo);
      localStorage.setItem("auth", JSON.stringify(authInfo));
    } else {
      const authInfo = {
        uid: docSnap.data().uid,
        username: docSnap.data().username,
        email: docSnap.data().email,
        profilePicture: docSnap.data().profilePicture,
        store: hasAStore,
      };
      localStorage.setItem("auth", JSON.stringify(authInfo));
    }


    await checkCart();

    return localStorage.getItem("auth") ? true : false;
  } catch (err) {
    console.log(err);
  }
};

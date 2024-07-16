import { signInWithPopup } from "firebase/auth";
import { checkStore } from "../logic/checkStore";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { auth, googleProvider } from "@/src/firebase/config";
import { checkCart } from "../logic/checkCart";
import { axiosInstance } from "@/app/lib/axiosInstance";
import generateFortKnoxPassword from "../features/helper/generateFortKnoxPassword";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const hasAStore = await checkStore(result.user.uid);

    const docRef = doc(db, "users", result.user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const {uid, displayName, email, photoURL} = result.user;

      const fortknoxPassword = generateFortKnoxPassword()

      const authInfo = {
        uid,
        username: displayName,
        email: email,
        profilePicture: photoURL,
        store: hasAStore,
        authToken: fortknoxPassword,
        address: null,
        phoneNumber: null
      };
      await setDoc(docRef, authInfo);

      const userData = {
        userId: uid,
        authToken: fortknoxPassword,
      };

      const response = await axiosInstance.post("/users/login", userData);

      const localAuth = {
        uid,
        username: displayName,
        email: email,
        profilePicture: photoURL,
        store: hasAStore,
        accessToken: response.data,
      }
      localStorage.setItem("auth", JSON.stringify(localAuth));
    } else {
      const userData = {
        userId: docSnap.data().uid,
        authToken: docSnap.data().authToken,
      };

      const response = await axiosInstance.post("/users/login", userData);

      const authInfo = {
        uid: docSnap.data().uid,
        username: docSnap.data().username,
        email: docSnap.data().email,
        profilePicture: docSnap.data().profilePicture,
        store: hasAStore,
        accessToken: response.data,
      };

      localStorage.setItem("auth", JSON.stringify(authInfo));
    }

    await checkCart();

    return localStorage.getItem("auth") ? true : false;
  } catch (err) {
    console.log(err);
  }
};

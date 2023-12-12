import { db } from "@/src/firebase/config";
import { collection, setDoc, getDoc, query, where, doc } from "firebase/firestore";
import { getUserInfo } from "./getUserInfo";

export const checkCart = async () => {
  const { uid } = getUserInfo();

  const docRef = doc(db, "carts", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return null;
  } else {
    await setDoc(docRef, {
      products: [],
      productsBeingPaid: [],
      paidProducts: [],
      hasPaid: false
    });
  }
};

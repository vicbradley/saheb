import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "@/src/firebase/config";

export const checkStore = async (uid) => {
  const q = query(collection(db, "stores"), where("owner", "==", uid));

  const querySnapshot = await getDocs(q);

  if(querySnapshot.docs[0]) {
    const storeId = querySnapshot.docs[0].id
    return storeId;
  } else {
    return null;
  }
};

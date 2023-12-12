"use client";
import { db } from "@/src/firebase/config";
import { collection, query, where, getDocs, getDoc, setDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "../logic/getUserInfo";
import isAlphanumeric from "validator/lib/isAlphanumeric";
import isEmpty from "validator/lib/isEmpty";
import isLowercase from "validator/lib/isLowercase"
import { useAuthContext } from "../context/Auth";
import {  useToast } from "@chakra-ui/react";

const StoreRegister = () => {
  const [storeId, setStoreId] = useState("");
  const [storeName, setStoreName] = useState("");
  const {isAuth, setIsLocalStorageUpdated} = useAuthContext();
  
  const toast = useToast();
  const { push } = useRouter();

  const callToast = (title, description, status) => {
    return toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  const checkIfUserAlreadyHasAStore = () => {
    return getUserInfo().store ? true : false;
  }

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      // if input == empty string, return
      if (isEmpty(storeId) || isEmpty(storeName)) {
        callToast("Error", "Isi Form Dengan Lengkap !", "error");
        return;
      }

      // if input is not alpahnumeric, return
      if (!isAlphanumeric(storeId)) {
        callToast("Error", "Id hanya terdiri dari huruf,angka,dan tanpa spasi", "error");
        return;
      }

      // if id input is not a lowercase, return
      if (!isLowercase(storeId)) {
        callToast("Error", "id harus huruf kecil", "error");
        return;
      }

      const docRef = doc(db, "stores", storeId);
      const docSnap = await getDoc(docRef);
      // if doc exists then there is the same id, return
      if (docSnap.exists()) {
        callToast("Error", "Id yang sama sudah digunakan", "error");
        return;
      }

    
      const q = query(collection(db, "stores"), where("name", "==", storeName));
      const querySnapshot = await getDocs(q);
      // if query success then there is the same store name, return
      if (querySnapshot.docs[0]) {
        callToast("Error", "Nama toko sudah digunakan, buat nama lain", "error");
        return;
      }

      // set doc 
      // const userInfo = getUserInfo();
      const {uid, username, email, profilePicture} = getUserInfo();
      await setDoc(docRef, {
        name: storeName,
        owner: uid,
      });

      // update store to local storage
      const updatedLocalStorage = { uid, username, email, profilePicture, store: storeId };
      localStorage.setItem("auth", JSON.stringify(updatedLocalStorage));
      setIsLocalStorageUpdated(true);


      callToast("Berhasil", "Toko berhasil dibuat", "success");

      push(`${storeId}`);
    } catch (error) {
      console.log(error);
    }
  };

  
  if(!isAuth) {
    alert("Login Terlebih dahulu")
    push("/")
  }

  if(checkIfUserAlreadyHasAStore()) {
    push("/")
    return (
      alert("User ini sudah memiliki toko dengan id terkait")
    )
    
  }

  return (
    <div className="transition-opacity duration-500">
      <form action="">
      <p className="text-lg font-bold">Daftarkan Toko Anda</p>

        {/* Input Id */}
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Buat Id untuk toko anda</span>
          </label>
          <input 
            onChange={(e) => setStoreId(e.target.value)} 
            type="text" 
            placeholder="Type here" 
            className="input input-bordered w-full max-w-xs" 
          />
          <label className="label">
            <span className="label-text-alt">Id hanya berupa huruf kecil,angka ,dan tanpa spasi</span>
          </label>
        </div>

        {/* Input Store Name */}
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Apa nama toko anda ?</span>
          </label>
          <input 
            onChange={(e) => setStoreName(e.target.value)}
            type="text" 
            placeholder="Type here" 
            className="input input-bordered w-full max-w-xs" 
          />
          <label className="label"></label>
        </div>

        <button className="btn btn-primary" onClick={onSubmit}>
          Daftar
        </button>
      </form>
    </div>
  );
};

export default StoreRegister;

// "use client";
// import { db } from "@/src/firebase/config";
// import { collection, query, where, getDocs, getDoc, setDoc, doc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { getUserInfo } from "../logic/getUserInfo";
// import isAlphanumeric from "validator/lib/isAlphanumeric";
// import isEmpty from "validator/lib/isEmpty";
// import isLowercase from "validator/lib/isLowercase";
// import { useAuthContext } from "../context/Auth";
// import { useToast } from "@chakra-ui/react";


import StoreRegister from "./StoreRegister";



const Page = () => {


  return (
   <StoreRegister />
  );
};

export default Page;

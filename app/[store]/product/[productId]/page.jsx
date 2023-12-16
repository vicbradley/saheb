"use client";
import { db } from "@/src/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";
import AddToCartBtn from "@/app/components/AddToCartBtn";

export default function ProductInStore ({ params }) {
  const { productId } = params;
  const [productData, setProductData] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);

  const getData = async () => {
    try {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProductData({
          ...docSnap.data(),
          id: productId,
        })
        setIsDataReady(true);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (!isDataReady) {
    return <Loading />;
  } else {
    return (
      <div className="card lg:flex lg:flex-row bg-base-100 shadow-xl  ">
        <figure className="lg:w-[50vw] lg:h-[87vh] h-[60vh] ">
          <img className="lg:w-[100%] lg:h-[100%]  lg:object-contain " src={productData.image} />
        </figure>
        <div className="card-body  ">
          <h2 className="card-title text-2xl lg:text-3xl">{productData.name}</h2>
          <div className="card-actions justify-between items-center">
            <p className="text-xl font-semibold lg:text-2xl">Rp{Intl.NumberFormat("id-ID").format(productData.price)}</p>
            <AddToCartBtn productData={productData} />
          </div>
          <div>
            <p className="  mt-2">Stock : {productData.stock}</p>

            <p className="lg:mt-7  mt-2">Deskripsi :</p>
            <p className="">{productData.desc}</p>
          </div>
        </div>
      </div>
    );
  }
};
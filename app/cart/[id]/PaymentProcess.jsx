import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { getUserInfo } from "@/app/logic/getUserInfo";
import { useEffect, useState } from "react";
import { db } from "@/src/firebase/config";
import Loading from "@/app/components/Loading";

const PaymentProcess = () => {
  const cartRef = doc(db, "carts", getUserInfo().uid);
  const [productsBeingPaidState, setProductsBeingPaidState] = useState([]);
  const [paidProductsState, setPaidProductsState] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);

  const updateProducts = async (products) => {
    const updatePromises = products.map(async (product) => {
      console.log(product);

      const productRef = doc(db, "products", product.id);
      const productSnap = await getDoc(productRef);

      console.log("updateProducts");

      return updateDoc(productRef, {
        stock: parseInt(productSnap.data().stock) - product.amount,
      });
    });

    return Promise.all(updatePromises);
  };

  const cancelTransaction = async () => {
    const cartSnap = await getDoc(cartRef);

    const {products, productsBeingPaid} = cartSnap.data();

    const mergedArray = products.concat(productsBeingPaid.filter(paidProduct => !products.some(product => product.id !== paidProduct.id)));

    return updateDoc(cartRef, {
      products: mergedArray,
      productsBeingPaid: [],
    })
  };

  useEffect(() => {
    const unsub = onSnapshot(cartRef, async (document) => {
      console.log("Payment Process");
      const { productsBeingPaid, paidProducts, products } = document.data();

      setProductsBeingPaidState(productsBeingPaid ? productsBeingPaid : []);
      setPaidProductsState(paidProducts ? paidProducts : []);

      if (document.data().hasPaid) {
        await updateProducts(productsBeingPaid);

        await updateDoc(cartRef, {
          products: products ? products : [],
          productsBeingPaid: [],
          paidProducts: [...productsBeingPaid, ...paidProducts],
          hasPaid: false,
        });
      }

      setIsDataReady(true);
    });

    return () => unsub();
  }, []);

  if (!isDataReady) return <Loading />;

  return (
    <div>
      <div className="divider p-3 mb-3"></div>
      {productsBeingPaidState.length > 0 && (
        <div className="w-[95%] mx-auto p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <p className="text-lg font-bold">Proses Pembayaran</p>
              <span className="loading loading-dots loading-md ml-4"></span>
            </div>
            <button className="btn btn-danger" onClick={cancelTransaction}>
              Cancel
            </button>
          </div>
          {productsBeingPaidState.map((product) => (
            <div className="flex items-center p-3 mb-3" key={`${Math.floor(Math.random() * 100) + 1 + parseInt(product.price) + parseInt(product.amount)}`}>
              <div className="avatar">
                <div className="w-24 rounded-xl">
                  <img src={product.image} className="object-cover" />
                </div>
              </div>

              <div className="ml-3 ">
                <p className="font-extrabold">{product.name}</p>
                <p>Rp {Intl.NumberFormat("id-ID").format(product.price)}</p>
                <p>Jumlah : {product.amount}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {paidProductsState.length > 0 && (
        <>
          <div className="w-[95%] mx-auto p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow">
            <p className="text-xl font-bold">Pesanan Selesai</p>
            {paidProductsState.map((product) => (
              <div className="flex items-center p-3 mb-3" key={`${Math.floor(Math.random() * 100) + 1 + parseInt(product.price) + parseInt(product.amount)}`}>
                <div className="avatar">
                  <div className="w-24 rounded-xl">
                    <img src={product.image} className="object-cover" />
                  </div>
                </div>

                <div className="ml-3 ">
                  <p className="font-extrabold">{product.name}</p>
                  <p>Rp {Intl.NumberFormat("id-ID").format(product.price)}</p>
                  <p>Jumlah : {product.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentProcess;



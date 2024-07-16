"use client";
import PaymentProcess from "./PaymentProcess";
import TransactionHistory from "./TransactionHistory";
import Loading from "../components/Loading";
import { useCartContext } from "@/app/context/Cart";
import { useFetchTransactionsByUserId } from "../features/transaction/useFetchTransactionsByUserId";
import { getUserInfo } from "../logic/getUserInfo";
import { useEffect, useState } from "react";

const page = () => {
  const { data: transactions, isLoading: transactionsIsLoading } = useFetchTransactionsByUserId(getUserInfo().uid);
  const { cart } = useCartContext();
  const [cartIsLoading, setCartIsLoading] = useState(true);

  useEffect(() => {
    if (cart.length < 1) {
      return;
    } else {
      setCartIsLoading(false);
    }
  }, [cart, setCartIsLoading]);

  if (cartIsLoading || transactionsIsLoading) return <Loading />;

  if (cart.paymentProcess.length < 1 && transactions.length < 1) return <p className="w-[80%] h-[50vh] text-center mx-auto flex items-center justify-center text-[#001a9d] font-semibold text-lg">Belum ada transaksi</p>;

  return (
    <>
      <PaymentProcess cart={cart} />

      <TransactionHistory transactions={transactions} />
    </>
  );
};

export default page;

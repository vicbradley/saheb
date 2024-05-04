import { getUserInfo } from "@/app/logic/getUserInfo";
import { useState, useEffect } from "react";
import openSocket from "socket.io-client";

const useListenDashboard = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { store } = getUserInfo();

  const encodedType = encodeURIComponent("products dashboard");

  useEffect(() => {
    console.log("start");
    const socket = openSocket(`http://localhost:5000?type=${encodedType}&storeId=${store}`, { transports: ["websocket"] });

    socket.on("products", (data) => {
      setProducts(data);
      setIsLoading(false);
    });

    socket.on("error", (error) => {
      setError(error);
      setIsLoading(false);
    });

    console.log("exit");
    // Cleanup function to disconnect on unmount
    return () => socket.disconnect();
  }, []);

  return {
    data: products,
    isLoading,
    error,
  };
};

export default useListenDashboard;

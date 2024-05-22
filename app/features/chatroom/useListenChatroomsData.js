import { useAuthContext } from "@/app/context/Auth";
import { getUserInfo } from "@/app/logic/getUserInfo";
import { useState, useEffect } from "react";
import openSocket from "socket.io-client";

const useListenChatroomsData = () => {
  const [chatroomsData, setChatroomsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { uid } = getUserInfo();

  const encodedType = encodeURIComponent("chatrooms data");

  const { isAuth, isLocalStorageUpdated } = useAuthContext();

  useEffect(() => {
    if (!isAuth) return;
    
    console.log("start");
    const socket = openSocket(`http://localhost:5000?type=${encodedType}&uid=${uid}`, { transports: ["websocket"] });

    socket.on("chatrooms data", (data) => {
      setChatroomsData(data);
      setIsLoading(false);
    });

    socket.on("error", (error) => {
      setError(error);
      setIsLoading(false);
    });

    console.log("exit");
    // Cleanup function to disconnect on unmount
    return () => socket.disconnect();
  }, [isAuth, isLocalStorageUpdated]);

  return {
    chatroomsData,
    isLoading,
    error,
  };
};

export default useListenChatroomsData;

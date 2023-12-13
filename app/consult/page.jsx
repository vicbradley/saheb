"use client";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/src/firebase/config";
import Loading from "../components/Loading";
import ConsultantList from "./ConsultantList";

const Consult = () => {
  const [isDataReady, setIsDataReady] = useState(false);
  const [consultants, setConsultants] = useState(null);

  const fetchConsultants = async () => {
    const q = query(collection(db, "users"), where("isAConsultant", "==", true));

    const querySnapshot = await getDocs(q);

    const tempConsultants = querySnapshot.docs.map((doc) => {
      const { username, profilePicture, consultantData } = doc.data();
      return {
        id: doc.id,
        consultantData: { ...consultantData, username, profilePicture },
      };
    });

    setConsultants(tempConsultants);
    setIsDataReady(true);
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  if (!isDataReady) return <Loading />;

  return (
    <div className="pb-6">
      <div className="bg-[#001a9d] min-h-[25vh] w-full flex items-center">
        <p className="font-extrabold text-white text-3xl ml-3 mb-6">Dokter yang tersedia :</p>
      </div>

      <div className="bg-[white] rounded-t-[3rem] pt-12 -mt-10 px-3">
        <div className="flex flex-wrap w-full justify-around">
          {consultants.map((consultant) => (
            <ConsultantList key={consultant.id} consultantData={consultant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Consult;

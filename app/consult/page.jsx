"use client";
import Loading from "../components/Loading";
import ConsultantList from "./ConsultantList";
import { useFetchConsultants } from "../features/consult/useFetchConsultants";

const Consult = () => {
  const { isLoading, data: consultants } = useFetchConsultants();

  if (isLoading) return <Loading />;

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

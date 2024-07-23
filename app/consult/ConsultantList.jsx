import Image from "next/image";
import ConsultBtn from "./ConsultBtn";

const ConsultantList = ({ consultantData }) => {
  const { id, username, profilePicture, speciality, experience, pricing, location } = consultantData;

  const chatPartnerData = {
    chatPartnerId: id,
    chatPartnerUsername: username,
    chatPartnerProfilePicture: profilePicture,
    chatPartnerPricing: pricing,
  };

  return (
    <div className="w-[80%] h-[65vh] lg:h-[80vh] mt-4 p-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      <div className="relative w-80% h-[60%] lg:h-[60%] p-8 mt-6 mx-auto flex justify-center items-center rounded-t-lg">
        <Image 
          src={profilePicture} 
          alt={username} 
          layout="fill" 
          objectFit="cover" 
          className="rounded-lg"
        />
      </div>
      
      <div className="px-5 pb-5">
        <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{username}</h5>
        <div className="mt-2.5 mb-5">
          <div>
            <p>Keahlian : {speciality}</p>
            <p>Pengalaman : {experience}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="bg-blue-100 text-blue-800 text-sm sm:text-md md:text-md lg:text-base font-semibold p-2 rounded">Rp {Intl.NumberFormat("id-ID").format(pricing)}</span>

          <ConsultBtn chatPartnerData={chatPartnerData} />
        </div>
      </div>
    </div>
  );
};

export default ConsultantList;
